"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Original staggered section reveals, scoped to the current route. */
export function MotionRuntime() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      const targets = [...document.querySelectorAll<HTMLElement>("main [data-reveal]")];
      const reveals: { targets: HTMLElement[]; tween: gsap.core.Tween }[] = [];
      const context = gsap.context(() => {
        const reveal = (
          elements: HTMLElement[],
          trigger: Element,
          work = false,
          stagger = 0.12,
        ) => {
          if (!elements.length) return;
          elements.forEach((element) => {
            element.dataset.revealState = "pending";
          });
          const tween = gsap.fromTo(
            elements,
            { y: work ? 80 : 56, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: work ? 1.3 : 1.4,
              stagger: work ? 0 : stagger,
              ease: "power3.out",
              clearProps: "opacity,transform",
              scrollTrigger: { trigger, start: work ? "top 85%" : "top 78%", once: true },
              onStart: () =>
                elements.forEach((element) => {
                  element.dataset.revealState = "visible";
                }),
              onComplete: () =>
                elements.forEach((element) => element.removeAttribute("data-reveal-state")),
            },
          );
          reveals.push({ targets: elements, tween });
        };

        document.querySelectorAll<HTMLElement>("main section").forEach((section) => {
          const children = targets.filter((target) => target.closest("section") === section);
          children
            .filter((target) => target.dataset.reveal === "work")
            .forEach((card) => reveal([card], card, true));
          reveal(
            children.filter((target) => target.dataset.reveal !== "work"),
            section,
            false,
            Number(section.dataset.revealStagger ?? 0.12),
          );
        });
      });

      // Keyboard focus must never wait for an offscreen reveal to finish.
      const onFocus = (event: FocusEvent) => {
        if (!(event.target instanceof Element)) return;
        const focused = event.target;
        reveals.forEach(({ targets: elements, tween }) => {
          if (elements.some((element) => element.contains(focused))) tween.progress(1);
        });
      };
      document.addEventListener("focusin", onFocus);
      return () => {
        document.removeEventListener("focusin", onFocus);
        context.revert();
        targets.forEach((target) => target.removeAttribute("data-reveal-state"));
      };
    });

    return () => {
      media.revert();
    };
  }, [pathname]);

  return null;
}
