import type { Metadata } from "next";
import { Contact } from "@/components/sanmedia/Contact";

export const metadata: Metadata = {
  title: "Start Your Film",
  description:
    "Tell SANMEDIA your story, your screen and your budget. Start a film, advertising project or production with our team in Trivandrum, Kerala.",
};

export default function ContactPage() {
  return <Contact standalone />;
}
