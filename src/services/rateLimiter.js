/**
 * Rate Limiter for AI Chatbot (Client-side & localStorage based)
 * Protects API tokens from exhaustion while giving fair usage to visitors.
 */

const RATE_LIMIT_KEY = 'portfolio_ai_ratelimit_v1';
const MAX_REQUESTS = 10; // Maksimal 10 pertanyaan per user
const WINDOW_MS = 2 * 60 * 60 * 1000; // Reset setiap 2 jam

/**
 * Check if the user is allowed to send an AI message.
 * @returns {{ allowed: boolean, remaining: number, total: number, timeStr?: string, resetTime?: number }}
 */
export function checkRateLimit() {
    try {
        const stored = localStorage.getItem(RATE_LIMIT_KEY);
        const now = Date.now();

        if (!stored) {
            return {
                allowed: true,
                remaining: MAX_REQUESTS,
                total: MAX_REQUESTS,
            };
        }

        const data = JSON.parse(stored);

        // If the 2-hour window has passed, reset
        if (now >= data.resetTime) {
            localStorage.removeItem(RATE_LIMIT_KEY);
            return {
                allowed: true,
                remaining: MAX_REQUESTS,
                total: MAX_REQUESTS,
            };
        }

        // If user reached the quota limit
        if (data.count >= MAX_REQUESTS) {
            const diffMs = data.resetTime - now;
            const diffMinutes = Math.max(1, Math.ceil(diffMs / (60 * 1000)));
            let timeStr = `${diffMinutes} menit`;
            if (diffMinutes >= 60) {
                const hours = Math.floor(diffMinutes / 60);
                const mins = diffMinutes % 60;
                timeStr = mins > 0 ? `${hours} jam ${mins} menit` : `${hours} jam`;
            }

            return {
                allowed: false,
                remaining: 0,
                total: MAX_REQUESTS,
                resetTime: data.resetTime,
                timeStr,
            };
        }

        return {
            allowed: true,
            remaining: Math.max(0, MAX_REQUESTS - data.count),
            total: MAX_REQUESTS,
            resetTime: data.resetTime,
        };
    } catch {
        // Fallback gracefully if localStorage is disabled in browser
        return {
            allowed: true,
            remaining: MAX_REQUESTS,
            total: MAX_REQUESTS,
        };
    }
}

/**
 * Record an AI request when the user actually makes a call.
 * @returns {number} Current count
 */
export function recordRequest() {
    try {
        const stored = localStorage.getItem(RATE_LIMIT_KEY);
        const now = Date.now();
        let data = stored ? JSON.parse(stored) : null;

        if (!data || now >= data.resetTime) {
            data = {
                count: 1,
                resetTime: now + WINDOW_MS,
            };
        } else {
            data.count += 1;
        }

        localStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
        return data.count;
    } catch {
        return 1;
    }
}

/**
 * Get current quota info for UI display.
 */
export function getQuotaInfo() {
    const status = checkRateLimit();
    return {
        remaining: status.remaining,
        total: status.total,
        isLimited: !status.allowed,
        timeStr: status.timeStr || '',
    };
}
