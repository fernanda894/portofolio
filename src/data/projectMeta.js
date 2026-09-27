import smkn2Img from '../assets/smkn2.png';
import sejarahImg from '../assets/Sejarah.png';
import restaurantImg from '../assets/restaurant.png';

export const PROJECT_META = [
  {
    id: 1,
    slug: "luxury-restaurant",
    title: "Premium Cocktail Website",
    category: "Web Application",
    color: "bg-neutral-400",
    img: restaurantImg,
  },
  {
    id: 2,
    slug: "leadsup",
    title: "LeadsUp",
    category: "AI-Powered Lead Scoring",
    color: "bg-purple-400",
    img: "https://res.cloudinary.com/demlxsf08/image/upload/v1766486297/Gemini_Generated_Image_t441sjt441sjt441_pwjtsx.png",
  },
  {
    id: 3,
    slug: "smk-negeri-2-karanganyar",
    title: "SMK Negeri 2 Karanganyar",
    category: "RAG Chatbot / AI Assistant",
    color: "bg-orange-400",
    img: sejarahImg,
  },
  {
    id: 4,
    slug: "floodsegmen",
    title: "Flood Segmentation Analyzer",
    category: "Computer Vision",
    color: "bg-blue-400",
    img: "https://res.cloudinary.com/demlxsf08/image/upload/v1766488542/Gemini_Generated_Image_v501i1v501i1v501_wao1dj.png",
  },
  {
    id: 5,
    slug: "qmeal",
    title: "QMeal E-Kantin",
    category: "Multi-Vendor Ordering Platform",
    color: "bg-pink-400",
    img: "https://res.cloudinary.com/demlxsf08/image/upload/v1766489013/Gemini_Generated_Image_t52vclt52vclt52v_z5p8vi.png",
  },
  {
    id: 6,
    slug: "lostandfound",
    title: "SITEMU Lost & Found Portal",
    category: "Web Application",
    color: "bg-cyan-400",
    img: "https://res.cloudinary.com/demlxsf08/image/upload/v1766489701/Gemini_Generated_Image_v54x4rv54x4rv54x_mloefz.png",
  },
  {
    id: 7,
    slug: "imageclas",
    title: "Vegetable Image Classification",
    category: "Computer Vision",
    color: "bg-neutral-400",
    img: "https://res.cloudinary.com/demlxsf08/image/upload/v1766490520/Gemini_Generated_Image_s7woxks7woxks7wo_klw9jh.png",
  },
  {
    id: 8,
    slug: "financial-assistant-bot",
    title: "Financial Assistant Bot",
    category: "AI / Fintech",
    color: "bg-amber-400",
    img: "https://res.cloudinary.com/dujp9ydkx/image/upload/f_auto,q_auto/v1771095470/demo_1_clhmqw",
  },
];

export const PROJECT_META_BY_SLUG = PROJECT_META.reduce((accumulator, item) => {
  accumulator[item.slug] = item;
  return accumulator;
}, {});
