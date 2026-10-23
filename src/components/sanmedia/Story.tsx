"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { stages } from "@/content/stages";

export function Story() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1024px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)",
      () => {
        const section = ref.current;
        if (!section) return;
        section.classList.add("process-cinematic");
        const context = gsap.context(() => {
          const images = gsap.utils.toArray<HTMLElement>(".process-image", section);
          const texts = gsap.utils.toArray<HTMLElement>(".process-copy", section);
          gsap.set(images.slice(1), { opacity: 0 });
          gsap.set(texts.slice(1), { autoAlpha: 0 });
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.7 },
          });
          texts.forEach((text, index) => {
            if (index === 0) return;
            // Image and title move independently, matching the original film chapters.
            timeline
              .to(
                texts[index - 1],
                { autoAlpha: 0, y: -50, duration: 0.2, ease: "power1.in" },
                index - 0.25,
              )
              .to(images[index - 1], { opacity: 0, duration: 0.3, ease: "none" }, index - 0.25)
              .fromTo(
                text,
                { autoAlpha: 0, y: 50 },
                { autoAlpha: 1, y: 0, duration: 0.25, ease: "power1.out" },
                index,
              )
              .to(images[index], { opacity: 1, duration: 0.35, ease: "none" }, index);
          });
          timeline.fromTo(
            ".process-progress-fill",
            { scaleX: 0 },
            { scaleX: 1, duration: texts.length, ease: "none" },
            0,
          );
        }, section);
        ScrollTrigger.refresh();
        return () => {
          context.revert();
          section.classList.remove("process-cinematic");
        };
      },
    );
    return () => media.revert();
  }, []);

  return (
    <section ref={ref} className="process-section" id="process" aria-label="Our filmmaking process">
      <div className="process-sticky">
        {stages.map((stage) => (
          <article key={stage.n} className="process-stage">
            <div className="process-image grain">
              <Image
                src={stage.img}
                alt={stage.title.toLowerCase().replace("the ", "Filmmaking: ")}
                fill
                sizes="(min-width: 1024px) 100vw, (min-width: 700px) 50vw, 100vw"
                placeholder="blur"
                className="object-cover"
              />
              <div className="process-shade" />
            </div>
            <div className="process-copy">
              <p className="meta">Chapter {stage.n} / 04</p>
              <h2 className="display">{stage.title}</h2>
              <p className="process-quote">{stage.quote}</p>
            </div>
          </article>
        ))}
        <div className="process-progress" aria-hidden="true">
          <span className="meta">From first thought to final frame</span>
          <div>
            <div className="process-progress-fill" />
          </div>
          <span className="meta">01 — 04</span>
        </div>
      </div>
    </section>
  );
}
