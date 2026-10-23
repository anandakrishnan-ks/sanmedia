import type { Metadata } from "next";
import { PageIntro } from "@/components/sanmedia/PageIntro";
import { Services } from "@/components/sanmedia/Services";
import { Budget } from "@/components/sanmedia/Budget";
import { Contact } from "@/components/sanmedia/Contact";

export const metadata: Metadata = {
  title: "Film & Production Services",
  description:
    "Advertising, brand, corporate and product films, social content and cinematic campaigns. Premium production at every scale, from SANMEDIA.",
};

export default function ServicesPage() {
  return (
    <>
      <PageIntro number="02" eyebrow="Our services" title={["YOUR STORY.", "EVERY SCREEN."]}>
        <p>One cinematic eye. Six ways to move people.</p>
        <p>
          From a single product to a full-scale campaign, we find the visual language your story
          deserves.
        </p>
      </PageIntro>
      <Services />
      <Budget />
      <Contact />
    </>
  );
}
