import ProjectCaseLayout from "../components/projects/ProjectCaseLayout";
import heroImage from "../assets/smkn2.png";

export const project = {
  title: "SMK Negeri 2 Karanganyar",
  category: "Education / School Information Assistant",
  heroImg: heroImage,

  tagline:
    "A RAG-based virtual assistant for SMK Negeri 2 Karanganyar information services - helping students and visitors get quick, clear, and human-like answers about school profiles, majors, admissions, schedules, and academic information.",

  year: "2025",

  stack: [
    "Next.js (API Route)",
    "Google Gemini API",
    "RAG (Knowledge Base + Retrieval)",
    "Prompt Engineering (system prompt & guardrails)",
    "Chat UI (interactive conversation)",
  ],

  features: [
    "Interactive chat for Q&A about school information with a friendly, informative, and student-friendly tone.",
    "RAG knowledge base: answers are derived from internal school knowledge (school profile, majors, PPDB admissions, schedules, extracurriculars, facilities, and announcements).",
    "Response guardrails: assistant only answers topics relevant to school services and politely declines unrelated questions.",
    "Consistent answer format (plain text): no markdown, no unusual symbols - easily readable on any device.",
    "Quick actions to speed up user flow: e.g., school profile, majors, admission info, schedules, and contact admin.",
    "Download transcript: users can download chat history as conversation summaries or references.",
    "Multimodal mode (optional): can receive images for simple analysis or document support if needed.",
  ],

  impact: [
    "Speeds up access to school information so students and parents can instantly get answers without waiting for manual responses.",
    "Reduces repetitive administrative questions regarding admissions, schedules, and school services.",
    "Improves communication experience through clear, consistent, and human-like AI responses for students and visitors.",
  ],

  links: {
    repo: "https://github.com/fernanda/chatbot_ai",
  },
};

export default function PolsekRembangDetail({ onClose, mode }) {
  return (
    <ProjectCaseLayout
      project={project}
      onClose={onClose}
      closeLabel={mode === "modal" ? "Close" : "Back to Home"}
      mode={mode}
    />
  );
}