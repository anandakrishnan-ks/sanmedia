import work1 from "@/assets/work-1.jpg";
import work2 from "@/assets/work-2.jpg";
import work3 from "@/assets/work-3.jpg";
import work4 from "@/assets/work-4.jpg";
import work5 from "@/assets/work-5.jpg";
import work6 from "@/assets/work-6.jpg";

export const films = [
  {
    title: "THE INHERITANCE",
    client: "Short film",
    year: "2025",
    desc: "A generational drama shot across the heritage homes of Kerala — silence, sunlight and a single door left open.",
    img: work1,
  },
  {
    title: "STILL WATERS",
    client: "Tourism campaign",
    year: "2025",
    desc: "Backwater mornings, mist and nets — a tourism film that trades postcards for patience.",
    img: work2,
  },
  {
    title: "BODIES IN MOTION",
    client: "Cultural festival",
    year: "2024",
    desc: "Two dancers, one warehouse, one light — a festival identity film about gravity and grace.",
    img: work3,
  },
  {
    title: "NIGHT DRIVE",
    client: "Automotive brand",
    year: "2024",
    desc: "A launch film for a classic reborn — wet asphalt, one streetlight and a city that never looks back.",
    img: work4,
  },
  {
    title: "HALF LIGHT",
    client: "Fashion film",
    year: "2023",
    desc: "A portrait series in single-source light — character over costume.",
    img: work5,
  },
  {
    title: "THE CARVER",
    client: "Craft documentary",
    year: "2023",
    desc: "Behind the hands of a Kathakali mask maker — a documentary short about devotion and detail.",
    img: work6,
  },
];

export type Film = (typeof films)[number];
