"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { services } from "@/content/services";
import "./services-motion.css";

export function Services() {
  const [active, setActive] = useState(0);
  const id = useId();
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<{ index: number; scroll: number } | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add(
      "(min-width: 1024px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)",
      () => {
        const section = sectionRef.current;
        if (!section) return;
        section.classList.add("services-cinematic");

        const context = gsap.context(() => {
          const rows = gsap.utils.toArray<HTMLElement>(".service-row", section);
          const images = gsap.utils.toArray<HTMLElement>(".service-image", section);
          gsap.set(rows, { opacity: 0.18 });
          gsap.set(images, { opacity: 0 });
          gsap.set([rows[0], images[0]], { opacity: 1 });

          let timelineTime = 0;
          const syncSelection = () => {
            if (previewRef.current) return;
            setActive(Math.min(services.length - 1, Math.floor(timelineTime + 0.1)));
          };
          const timeline = gsap.timeline({
            onUpdate: function (this: gsap.core.Timeline) {
              timelineTime = this.time();
              syncSelection();
            },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.7,
              onUpdate: (trigger) => {
                // A selected button remains a useful preview until the visitor scrolls again.
                const preview = previewRef.current;
                if (preview && Math.abs(trigger.scroll() - preview.scroll) > 2) {
                  previewRef.current = null;
                  delete section.dataset.servicePreview;
                  syncSelection();
                }
              },
            },
          });

          services.forEach((_, index) => {
            if (index === 0) return;
            timeline
              .to(images[index - 1], { opacity: 0, duration: 0.3, ease: "none" }, index - 0.2)
              .to(rows[index - 1], { opacity: 0.18, duration: 0.2, ease: "none" }, index - 0.2)
              .to(images[index], { opacity: 1, duration: 0.35, ease: "none" }, index)
              .to(rows[index], { opacity: 1, duration: 0.2, ease: "none" }, index);
          });
        }, section);

        ScrollTrigger.refresh();
        return () => {
          context.revert();
          previewRef.current = null;
          delete section.dataset.servicePreview;
          section.classList.remove("services-cinematic");
        };
      },
    );

    return () => media.revert();
  }, []);

  const selectService = (index: number) => {
    const section = sectionRef.current;
    if (section?.classList.contains("services-cinematic")) {
      previewRef.current = { index, scroll: window.scrollY };
      section.dataset.servicePreview = "true";
    }
    setActive(index);
  };

  return (
    <section
      ref={sectionRef}
      className="services-section"
      id="services"
      aria-labelledby={`${id}-heading`}
    >
      <div className="services-stage">
        <div className="service-images" aria-hidden="true">
          {services.map((service, index) => (
            <div className="service-image" data-active={active === index} key={service.n}>
              <Image
                src={service.img}
                alt=""
                fill
                sizes="100vw"
                placeholder="blur"
                className="object-cover"
              />
            </div>
          ))}
          <div className="service-shade" />
        </div>
        <div className="site-container services-content">
          <div className="service-section-top">
            <h2 id={`${id}-heading`} className="meta">
              02 / What we make
            </h2>
            <span className="meta">Cinema. In every format.</span>
          </div>
          <div className="service-list">
            {services.map((service, index) => (
              <button
                type="button"
                className="service-row"
                data-active={active === index}
                aria-pressed={active === index}
                key={service.n}
                onClick={() => selectService(index)}
                onFocus={() => selectService(index)}
                onPointerEnter={(event) => {
                  if (
                    event.pointerType === "mouse" &&
                    !sectionRef.current?.classList.contains("services-cinematic")
                  )
                    selectService(index);
                }}
              >
                <span className="meta service-number">{service.n}</span>
                <span className="service-copy">
                  <span className="display service-title">{service.title}</span>
                  <span className="service-description">{service.desc}</span>
                </span>
                <ArrowUpRight aria-hidden="true" strokeWidth={1} />
              </button>
            ))}
          </div>
          <div className="service-section-bottom">
            <p>One production house. Every way to tell your story.</p>
            <Link className="text-link" href="/contact">
              Find your format
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
