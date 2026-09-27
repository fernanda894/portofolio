import ProjectCaseLayout from "../components/projects/ProjectCaseLayout";
import restaurantImg from "../assets/foto 2.png";

export const project = {
  title: "Premium Cocktail Website",
  category: "Web Application",
  heroImg: restaurantImg,
  tagline:
    "A visually striking and highly interactive website for a premium cocktail bar. Features include elegant GSAP animations, sophisticated dark mode aesthetics, and a dynamic drink menu.",
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
    "Smooth scroll animations and seamless page transitions powered by GSAP and Framer Motion.",
    "Responsive layout ensuring a flawless experience on desktop, tablet, and mobile devices.",
    "Dynamic cocktail menu presentation with premium imagery and detailed drink compositions.",
    "Interactive elements that enhance user engagement and showcase the art of mixology.",
  ],
  impact: [
    "Elevates the brand's digital presence to match its premium physical cocktail lounge experience.",
    "Captivates visitors with immersive animations, increasing time spent on the website.",
    "Provides a lightning-fast, accessible, and highly intuitive user interface.",
  ],
  links: {
    live: "https://cocktail-website-rho.vercel.app/",
    repo: "https://github.com/fernanda894/cocktail-website",
  },
};

export default function LuxuryRestaurantDetail({ onClose, mode }) {
  return <ProjectCaseLayout project={project} onClose={onClose} closeLabel={mode === "modal" ? "Close" : "Back to Home"} mode={mode} />;
}
