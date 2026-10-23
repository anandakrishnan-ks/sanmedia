import { Hero } from "@/components/sanmedia/Hero";
import { Work } from "@/components/sanmedia/Work";
import { Services } from "@/components/sanmedia/Services";
import { Story } from "@/components/sanmedia/Story";
import { Statement } from "@/components/sanmedia/Statement";
import { Budget } from "@/components/sanmedia/Budget";
import { About } from "@/components/sanmedia/About";
import { Contact } from "@/components/sanmedia/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <Work />
      <Services />
      <Story />
      <Statement />
      <Budget />
      <About />
      <Contact />
    </>
  );
}
