import { generateSystemPrompt, buildScopedContext } from './aiContext';

const CEREBRAS_API_KEY = (
    import.meta.env.VITE_CEREBRAS_API_KEY ||
    import.meta.env.REACT_APP_CEREBRAS_API_KEY ||
    ''
).trim();

const GEMINI_API_KEY = (
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.REACT_APP_GEMINI_API_KEY ||
    ''
).trim();

const CEREBRAS_CHAT_COMPLETIONS_URL = 'https://api.cerebras.ai/v1/chat/completions';
const GEMINI_MODEL = 'gemini-3.5-flash-lite';

// Error classification for granular UI feedback
const classifyError = (error) => {
    const msg = error?.message?.toLowerCase() || '';
    const status = error?.status || error?.statusCode || 0;

    if ((typeof navigator !== 'undefined' && !navigator.onLine) || msg.includes('network') || msg.includes('fetch') || msg.includes('failed to fetch') || msg.includes('econnrefused')) {
        return { type: 'network', message: 'Connection lost. Check your internet and try again.' };
    }
    if (status === 429 || msg.includes('rate limit') || msg.includes('too many') || msg.includes('resource_exhausted')) {
        return { type: 'rate_limit', message: 'Too many requests. Please wait a moment.' };
    }
    if (status >= 500 || status === 503 || msg.includes('server') || msg.includes('internal') || msg.includes('unavailable')) {
        return { type: 'server', message: 'Server is temporarily unavailable. Try again shortly.' };
    }
    if (status === 401 || status === 403 || msg.includes('auth') || msg.includes('api key') || msg.includes('api_key_invalid')) {
        return { type: 'auth', message: 'Authentication error. Contact the site owner.' };
    }
    return { type: 'unknown', message: error?.message || 'Something went wrong. Please try again.' };
};

// ─── OpenAI / Cerebras Stream Parser ────────────────────────────────
async function* parseOpenAICompatibleStream(response) {
    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() || '';

        for (const event of events) {
            const dataLines = event
                .split(/\r?\n/)
                .filter((line) => line.startsWith('data:'))
                .map((line) => line.slice(5).trim());

            for (const data of dataLines) {
                if (!data || data === '[DONE]') continue;

                try {
                    const parsed = JSON.parse(data);
                    const content = parsed.choices?.[0]?.delta?.content;
                    if (content) yield content;
                } catch {
                    // Ignore non-JSON frames
                }
            }
        }
    }

    const trailing = buffer.trim();
    if (trailing.startsWith('data:')) {
        const data = trailing.slice(5).trim();
        if (data && data !== '[DONE]') {
            try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) yield content;
            } catch {
                // Ignore trailing parser errors
            }
        }
    }
}

// ─── Google Gemini Stream Parser ────────────────────────────────────
async function* parseGeminiStream(response) {
    const reader = response.body?.getReader();
    if (!reader) return;

    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() || '';

        for (const event of events) {
            const dataLines = event
                .split(/\r?\n/)
                .filter((line) => line.startsWith('data:'))
                .map((line) => line.slice(5).trim());

            for (const data of dataLines) {
                if (!data || data === '[DONE]') continue;

                try {
                    const parsed = JSON.parse(data);
                    const parts = parsed.candidates?.[0]?.content?.parts || [];
                    for (const part of parts) {
                        if (part.text) yield part.text;
                    }
                } catch {
                    // Ignore non-JSON frames
                }
            }
        }
    }

    const trailing = buffer.trim();
    if (trailing.startsWith('data:')) {
        const data = trailing.slice(5).trim();
        if (data && data !== '[DONE]') {
            try {
                const parsed = JSON.parse(data);
                const parts = parsed.candidates?.[0]?.content?.parts || [];
                for (const part of parts) {
                    if (part.text) yield part.text;
                }
            } catch {
                // Ignore trailing parser errors
            }
        }
    }
}

// ─── Gemini Stream Handler ──────────────────────────────────────────
async function* streamGemini(messages, systemPrompt, scopedContext) {
    const fullSystemInstruction = scopedContext
        ? `${systemPrompt}\n\n[Context]\n${scopedContext}`
        : systemPrompt;

    const contents = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }]
        }));

    if (contents.length === 0) {
        contents.push({ role: 'user', parts: [{ text: 'Halo' }] });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            system_instruction: {
                parts: [{ text: fullSystemInstruction }]
            },
            contents,
            generationConfig: {
                temperature: 0.35,
                maxOutputTokens: 1024,
            }
        }),
    });

    if (!response.ok) {
        let errMessage = `Gemini API error: ${response.status}`;
        try {
            const errData = await response.json();
            if (errData?.error?.message) {
                errMessage = errData.error.message;
            }
        } catch {
            // Ignore JSON parse error on error response
        }
        const error = new Error(errMessage);
        error.status = response.status;
        throw error;
    }

    for await (const chunk of parseGeminiStream(response)) {
        yield chunk;
    }
}

// ─── Cerebras Stream Handler ────────────────────────────────────────
async function* streamCerebrasInternal(messages, systemPrompt, scopedContext) {
    const conversation = [
        { role: "system", content: systemPrompt },
        ...(scopedContext ? [{ role: 'system', content: scopedContext }] : []),
        ...messages
    ];

    const response = await fetch(CEREBRAS_CHAT_COMPLETIONS_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CEREBRAS_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: conversation,
            model: "gpt-oss-120b",
            max_tokens: 1024,
            temperature: 0.35,
            stream: true,
        }),
    });

    if (!response.ok) {
        const error = new Error(`Cerebras API error: ${response.status}`);
        error.status = response.status;
        throw error;
    }

    for await (const content of parseOpenAICompatibleStream(response)) {
        yield content;
    }
}

/**
 * Stream chat completions from Gemini (preferred if key is available) or Cerebras.
 * Yields text chunks as they arrive.
 * @param {Array} messages - Chat messages (already limited by caller)
 * @returns {AsyncGenerator<string>} - Yields text content chunks
 */
export async function* streamCerebras(messages) {
    if (!GEMINI_API_KEY && !CEREBRAS_API_KEY) {
        const error = new Error('Missing API key. Set VITE_GEMINI_API_KEY or VITE_CEREBRAS_API_KEY in .env');
        error.status = 401;
        throw classifyError(error);
    }

    const systemPrompt = generateSystemPrompt();
    const latestUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
    const scopedContext = buildScopedContext(latestUserMessage);

    try {
        if (GEMINI_API_KEY) {
            yield* streamGemini(messages, systemPrompt, scopedContext);
            return;
        }

        yield* streamCerebrasInternal(messages, systemPrompt, scopedContext);
    } catch (error) {
        const classified = classifyError(error);
        throw classified;
    }
}

export const streamAI = streamCerebras;
