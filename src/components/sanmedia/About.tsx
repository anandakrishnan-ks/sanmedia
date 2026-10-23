import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import bts1 from "@/assets/bts-1.jpg";
import bts2 from "@/assets/bts-2.jpg";
import bts3 from "@/assets/bts-3.jpg";
import bts4 from "@/assets/bts-4.jpg";
import bts5 from "@/assets/bts-5.jpg";
import bts6 from "@/assets/bts-6.jpg";

const shots = [bts1, bts2, bts3, bts4, bts5, bts6];

export function About({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  return (
    <section
      className={`about-section section-space ${standalone ? "standalone-section" : ""}`}
      id="about"
      data-reveal-stagger="0.08"
    >
      <div className="site-container">
        <p className="eyebrow meta" data-reveal>
          04 / The house
        </p>
        <div className="about-grid">
          <Heading className="display about-title" data-reveal>
            Built in
            <br />
            Trivandrum.
            <br />
            <span>
              Shot like the world
              <br />
              is watching.
            </span>
          </Heading>
          <div className="about-copy" data-reveal>
            <p className="body-copy">
              SANMEDIA is a film and video production house from Kerala. Directors,
              cinematographers, colourists and editors working under one obsession — images that
              carry feeling first and information second. Every frame is composed, lit and cut with
              intent.
            </p>
            <Link className="text-link" href={standalone ? "/contact" : "/about"}>
              {standalone ? "Make something with us" : "Inside the house"}
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
            <p className="meta about-location">Rooted in Kerala. Open to the world.</p>
          </div>
        </div>
        <div className="bts-grid">
          {shots.map((shot, index) => (
            <figure key={shot.src} className="bts-image grain" data-reveal>
              <Image
                src={shot}
                alt={`SANMEDIA behind the scenes — frame ${index + 1}`}
                fill
                sizes="(min-width: 1024px) 17vw, (min-width: 600px) 33vw, 50vw"
                placeholder="blur"
                className="object-cover"
              />
              <figcaption className="meta">Frame 0{index + 1}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
