import ProjectCaseLayout from "../components/projects/ProjectCaseLayout";
import restaurantImg from "../assets/foto 2.png";

export const project = {
  title: "Premium Cocktail Website",
  category: "Web Application",
  heroImg: restaurantImg,
  tagline:
    "A visually striking and highly interactive website for a premium restaurant. Features include elegant animations, dark mode aesthetics, and an intuitive reservation system.",
  year: "2026",
  stack: [
    "React",
    "Tailwind CSS",
    "Framer Motion",
    "GSAP",
    "Vite",
  ],
  features: [
    "High-end UI/UX design with a sophisticated dark theme and beautiful typography.",
    "Smooth scroll animations and page transitions powered by GSAP and Framer Motion.",
    "Responsive layout ensuring a flawless experience on desktop, tablet, and mobile devices.",
    "Dynamic menu presentation with appetizing imagery and detailed descriptions.",
    "Integrated reservation form for seamless table bookings.",
  ],
  impact: [
    "Elevates the restaurant's digital presence to match its premium physical dining experience.",
    "Increases customer engagement and conversion rates for online reservations.",
    "Provides a lightning-fast, accessible, and intuitive user interface.",
  ],
  links: {
    live: "https://cocktail-website-rho.vercel.app/",
    repo: "https://github.com/fernanda894/cocktail-website",
  },
};

export default function LuxuryRestaurantDetail({ onClose, mode }) {
  return <ProjectCaseLayout project={project} onClose={onClose} closeLabel={mode === "modal" ? "Close" : "Back to Home"} mode={mode} />;
}
