import type { Metadata } from "next";
import { PageIntro } from "@/components/sanmedia/PageIntro";
import { Story } from "@/components/sanmedia/Story";
import { Contact } from "@/components/sanmedia/Contact";

export const metadata: Metadata = {
  title: "Our Filmmaking Process",
  description:
    "The idea. The frame. The production. The film. Follow the SANMEDIA filmmaking process from first thought to final frame.",
};

export default function ProcessPage() {
  return (
    <>
      <PageIntro number="03" eyebrow="The process" title={["FIRST THOUGHT.", "FINAL FRAME."]}>
        <p>
          A film is a thousand decisions.
          <br />
          Every one made with intent.
        </p>
        <p>Four chapters. One story that feels like you.</p>
      </PageIntro>
      <Story />
      <Contact />
    </>
  );
}
