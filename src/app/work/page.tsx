import type { Metadata } from "next";
import { Work } from "@/components/sanmedia/Work";
import { Contact } from "@/components/sanmedia/Contact";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Explore SANMEDIA's selected films, brand stories, tourism campaigns and documentaries. A film collection from 2023 to 2025.",
};

export default function WorkPage() {
  return (
    <>
      <Work standalone />
      <Contact />
    </>
  );
}
