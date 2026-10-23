"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { films, type Film } from "@/content/films";
import { Modal } from "./Modal";
import "./gallery-motion.css";

export function Work({ standalone = false }: { standalone?: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [active, setActive] = useState<Film | null>(null);
  const Heading = standalone ? "h1" : "h2";
  const FilmHeading = standalone ? "h2" : "h3";

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const section = ref.current;
      if (!section) return;

      const context = gsap.context(() => {
        section.querySelectorAll<HTMLElement>(".work-card").forEach((card) => {
          const image = card.querySelector<HTMLElement>(".work-image-motion");
          if (!image) return;

          gsap.fromTo(
            image,
            { scale: 1.12 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        });
      }, section);

      return () => context.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <section
      ref={ref}
      id="work"
      className={`work-section section-space ${standalone ? "standalone-section" : ""}`}
    >
      <div className="site-container">
        <p className="eyebrow meta">01 / The film collection</p>
        <div className="section-heading">
          <Heading className="display section-title">
            Selected
            <br />
            Work<span className="title-period">.</span>
          </Heading>
          <div className="section-aside">
            <p>
              Stories rooted in feeling.
              <br />
              Frames made to stay with you.
            </p>
            <span className="meta">06 films — 2023 → 2025</span>
          </div>
        </div>
        <div className="work-grid">
          {films.map((film, index) => (
            <article className="work-card" key={film.title} data-reveal="work">
              <button
                type="button"
                onClick={() => setActive(film)}
                className="work-button group"
                aria-label={`Open ${film.title}`}
              >
                <div className="work-image grain">
                  <div className="work-image-motion">
                    <Image
                      src={film.img}
                      alt={`${film.title} — ${film.client}`}
                      fill
                      sizes="(min-width: 1024px) 55vw, (min-width: 700px) 50vw, 100vw"
                      placeholder="blur"
                      className="object-cover"
                      preload={standalone && index === 0}
                    />
                  </div>
                  <span className="work-number meta">0{index + 1}</span>
                  <span className="work-open">
                    <ArrowUpRight size={22} aria-hidden="true" />
                  </span>
                  <span className="work-view meta">View story</span>
                </div>
                <div className="work-info">
                  <FilmHeading className="display">{film.title}</FilmHeading>
                  <span className="meta">
                    {film.client}
                    <span className="work-year"> / {film.year}</span>
                  </span>
                </div>
              </button>
            </article>
          ))}
        </div>
        {!standalone && (
          <div className="section-end">
            <span className="meta">Every frame has a purpose.</span>
            <Link className="text-link" href="/work">
              The full collection
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
      <Modal
        open={active !== null}
        onClose={() => setActive(null)}
        label={active?.title || "Project details"}
        className="project-modal"
      >
        {active && (
          <article className="project-detail">
            <div className="project-detail-image">
              <Image
                src={active.img}
                alt={active.title}
                fill
                sizes="(min-width: 1100px) 1000px, 100vw"
                placeholder="blur"
                className="object-cover"
              />
            </div>
            <div className="project-detail-copy">
              <p className="meta">
                {active.client} / {active.year}
              </p>
              <h2 className="display">{active.title}</h2>
              <p>{active.desc}</p>
              <a
                className="text-link"
                href={`mailto:hello@sanmedia.in?subject=${encodeURIComponent(`Film request: ${active.title}`)}`}
              >
                Full film available on request
                <ArrowUpRight size={17} aria-hidden="true" />
              </a>
            </div>
          </article>
        )}
      </Modal>
    </section>
  );
}
