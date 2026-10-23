"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./Brand";
import { Modal } from "./Modal";
import { email, location, navigation } from "@/content/site";

function MobileNavigation({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 900px)");
    const dismiss = () => {
      if (desktop.matches) setOpen(false);
    };
    desktop.addEventListener("change", dismiss);
    return () => desktop.removeEventListener("change", dismiss);
  }, []);

  return (
    <div className="mobile-navigation">
      <button
        className="menu-toggle meta"
        type="button"
        aria-expanded={open}
        aria-controls="navigation-dialog"
        aria-haspopup="dialog"
        onClick={() => setOpen(true)}
      >
        Menu
        <span className="menu-glyph" aria-hidden="true">
          <i />
          <i />
        </span>
      </button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        id="navigation-dialog"
        label="Navigation"
        className="menu-modal"
      >
        <div className="menu-content">
          <Brand onClick={() => setOpen(false)} />
          <p className="meta menu-eyebrow">A different kind of production house.</p>
          <nav className="menu-links" aria-label="Mobile">
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setOpen(false)}
                style={{ "--menu-index": index } as React.CSSProperties}
              >
                <span className="meta menu-number">{item.number}</span>
                <span className="display menu-label">{item.label}</span>
                <ArrowUpRight aria-hidden="true" strokeWidth={1} />
              </Link>
            ))}
          </nav>
          <div className="menu-footer">
            <a href={`mailto:${email}`}>
              {email}
              <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <span className="meta">{location}</span>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 24);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header className="site-header" data-scrolled={scrolled}>
      <div className="header-inner site-container">
        <Brand />
        <nav aria-label="Primary" className="desktop-navigation">
          {navigation.map((item) => (
            <Link
              className={`nav-link meta ${item.href === "/contact" ? "nav-contact" : ""}`}
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
            >
              {item.label}
              {item.href === "/contact" && <ArrowUpRight size={15} aria-hidden="true" />}
            </Link>
          ))}
        </nav>
        <MobileNavigation key={pathname} pathname={pathname} />
      </div>
    </header>
  );
}
