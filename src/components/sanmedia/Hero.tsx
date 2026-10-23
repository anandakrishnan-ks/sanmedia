"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import heroImage from "@/assets/hero.jpg";

export function Hero() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add(
      "(min-width: 1024px) and (min-height: 660px) and (prefers-reduced-motion: no-preference)",
      () => {
        const section = ref.current;
        if (!section) return;
        section.classList.add("hero-cinematic");
        const context = gsap.context(() => {
          const timeline = gsap.timeline({
            scrollTrigger: { trigger: section, start: "top top", end: "bottom bottom", scrub: 0.6 },
          });
          timeline
            .fromTo(
              ".hero-film",
              { clipPath: "inset(18% 18% 18% 18%)", opacity: 0 },
              {
                clipPath: "inset(0% 0% 0% 0%)",
                opacity: 1,
                duration: 0.42,
                ease: "none",
              },
              0,
            )
            .fromTo(
              ".hero-film img",
              { scale: 1.22 },
              { scale: 1.02, duration: 1, ease: "none" },
              0,
            )
            .to(
              ".hero-intro",
              {
                autoAlpha: 0,
                scale: 0.86,
                y: -60,
                filter: "blur(6px)",
                duration: 0.3,
                ease: "power1.in",
              },
              0.18,
            )
            .fromTo(
              ".hero-caption",
              { opacity: 0, y: 24 },
              { opacity: 1, y: 0, duration: 0.25, ease: "power1.out" },
              0.62,
            );
        }, section);
        ScrollTrigger.refresh();
        return () => {
          context.revert();
          section.classList.remove("hero-cinematic");
        };
      },
    );
    return () => media.revert();
  }, []);

  return (
    <section ref={ref} className="hero-section" aria-label="SANMEDIA film production">
      <div className="hero-sticky">
        <div className="hero-film">
          <Image
            src={heroImage}
            alt="SANMEDIA film set at night, camera crane in a beam of light"
            fill
            sizes="100vw"
            preload
            placeholder="blur"
            className="object-cover"
          />
          <div className="hero-shade" />
        </div>
        <div className="hero-intro">
          <Image
            src="/images/sanmedia-mark-white.png"
            alt=""
            width={80}
            height={80}
            unoptimized
            className="hero-mark"
          />
          <p className="meta hero-eyebrow">Independent minds. Cinematic stories.</p>
          <h1 className="display hero-title">SANMEDIA</h1>
          <p className="hero-tagline">Films that make brands feel.</p>
          <p className="meta hero-disciplines">
            Film · Advertising · Production · Visual Storytelling
          </p>
          <Link className="text-link hero-link" href="/work">
            Explore our work
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="hero-caption">
          <p className="meta">Scene 01 — The Production</p>
        </div>
        <div className="hero-bottom site-container">
          <span className="meta">Trivandrum, Kerala</span>
          <a href="#work" className="meta">
            Scroll to explore
            <ArrowDown size={14} aria-hidden="true" />
          </a>
          <span className="meta hero-coordinate">Visual storytelling. With intent.</span>
        </div>
      </div>
    </section>
  );
}
