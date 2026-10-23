"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const lines = ["WE DON'T JUST SHOOT VIDEOS.", "WE BUILD VISUAL EXPERIENCES."];

export function Statement() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const section = ref.current;
      if (!section) return;
      const context = gsap.context(() => {
        gsap.fromTo(
          "[data-word]",
          { opacity: 0.12 },
          {
            opacity: 1,
            stagger: 0.5,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top 72%",
              end: "bottom 55%",
              scrub: 0.4,
            },
          },
        );
        gsap.fromTo(
          ".statement-rule",
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1.6,
            ease: "power3.inOut",
            scrollTrigger: { trigger: section, start: "top 70%", once: true },
          },
        );
      }, section);
      return () => context.revert();
    });
    return () => media.revert();
  }, []);

  return (
    <section ref={ref} className="statement-section section-space paper-section">
      <div className="site-container">
        <div className="statement-rule" />
        <p className="meta">Sanmedia — Trivandrum, Kerala</p>
        <h2 className="display statement-title">
          {lines.map((line) => (
            <span className="statement-line" key={line}>
              {line.split(" ").map((word, index) => (
                <span key={`${word}-${index}`} data-word>
                  {word}{" "}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <p className="body-copy" data-reveal>
          Your budget doesn&apos;t define the quality of your story. We create the best possible
          visual experience within it — premium cinematic production, at any scale.
        </p>
      </div>
    </section>
  );
}
