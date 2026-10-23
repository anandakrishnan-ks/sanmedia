"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/** Reference-site scroll easing; touch and reduced-motion scrolling stay native. */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const media = window.matchMedia(
      "(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    let dispose: (() => void) | undefined;

    const sync = () => {
      dispose?.();
      dispose = undefined;
      if (!media.matches) return;

      gsap.registerPlugin(ScrollTrigger);
      const scroll = new Lenis({
        duration: 1.25,
        smoothWheel: true,
        syncTouch: false,
        anchors: { duration: 1.25, lerp: 0 },
        stopInertiaOnNavigate: true,
        prevent: (node) => node instanceof HTMLDialogElement,
      });
      const tick = (time: number) => scroll.raf(time * 1000);
      scroll.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);

      // A dialog must also cancel momentum already in flight, not only new wheel events.
      const syncLock = () => {
        if (document.body.style.overflow === "hidden") scroll.stop();
        else scroll.start();
      };
      const lockObserver = new MutationObserver(syncLock);
      lockObserver.observe(document.body, { attributes: true, attributeFilter: ["style"] });
      syncLock();

      // Native keyboard/focus and scrollbar interactions take control immediately.
      const cancelMomentum = () => {
        if (scroll.isScrolling === "smooth")
          scroll.scrollTo(scroll.actualScroll, { immediate: true });
      };
      const onKeyDown = (event: KeyboardEvent) => {
        if (
          [
            "Tab",
            "Enter",
            " ",
            "ArrowUp",
            "ArrowDown",
            "PageUp",
            "PageDown",
            "Home",
            "End",
          ].includes(event.key)
        )
          cancelMomentum();
      };
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("pointerdown", cancelMomentum, { passive: true });
      window.addEventListener("focusin", cancelMomentum);
      window.addEventListener("popstate", cancelMomentum);

      dispose = () => {
        lockObserver.disconnect();
        window.removeEventListener("keydown", onKeyDown);
        window.removeEventListener("pointerdown", cancelMomentum);
        window.removeEventListener("focusin", cancelMomentum);
        window.removeEventListener("popstate", cancelMomentum);
        gsap.ticker.remove(tick);
        scroll.destroy();
      };
    };

    sync();
    media.addEventListener("change", sync);
    return () => {
      media.removeEventListener("change", sync);
      dispose?.();
    };
  }, [pathname]);

  return null;
}
