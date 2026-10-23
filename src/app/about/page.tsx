import type { Metadata } from "next";
import { About } from "@/components/sanmedia/About";
import { Statement } from "@/components/sanmedia/Statement";
import { Contact } from "@/components/sanmedia/Contact";

export const metadata: Metadata = {
  title: "The Production House",
  description:
    "Meet SANMEDIA, a film and video production house in Trivandrum, Kerala. Directors, cinematographers, colourists and editors creating images with feeling.",
};

export default function AboutPage() {
  return (
    <>
      <About standalone />
      <Statement />
      <Contact />
    </>
  );
}
