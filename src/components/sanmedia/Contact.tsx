import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import locationImage from "@/assets/location.jpg";
import { email, location } from "@/content/site";

export function Contact({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  return (
    <section
      className={`contact-section section-space ${standalone ? "standalone-section" : ""}`}
      id="contact"
    >
      <div className="site-container">
        <p className="eyebrow meta" data-reveal>
          05 / Start a film
        </p>
        <div className="contact-grid">
          <div>
            <Heading className="display contact-title" data-reveal>
              LET&apos;S MAKE
              <br />
              YOUR FILM<span className="title-period">.</span>
            </Heading>
            <p className="body-copy" data-reveal>
              Tell us the story, the screen it&apos;s meant for and the budget you have in mind.
              We&apos;ll come back with a plan — and a picture of what it can become.
            </p>
            <a className="contact-email" data-reveal href={`mailto:${email}`}>
              {email}
              <ArrowUpRight aria-hidden="true" strokeWidth={1} />
            </a>
            <p className="meta contact-location">{location}</p>
            {!standalone && (
              <Link href="/contact" className="text-link">
                Start the conversation
                <ArrowUpRight size={17} aria-hidden="true" />
              </Link>
            )}
          </div>
          {standalone && (
            <figure className="contact-scene grain">
              <Image
                src={locationImage}
                alt="The cinematic landscape of Kerala, home to SANMEDIA"
                fill
                sizes="(min-width: 900px) 40vw, 100vw"
                placeholder="blur"
                className="object-cover"
              />
              <figcaption className="meta">
                Where our stories begin.
                <br />
                Trivandrum, Kerala.
              </figcaption>
            </figure>
          )}
        </div>
        {standalone && (
          <div className="contact-notes">
            <p>
              <span className="meta">The first conversation</span>Bring an idea, a brief, or simply
              a question.
            </p>
            <p>
              <span className="meta">The possibilities</span>Film · Advertising · Production ·
              Visual Storytelling
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
