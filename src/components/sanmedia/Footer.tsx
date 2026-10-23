import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Brand } from "./Brand";
import { email, location, navigation } from "@/content/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-container">
        <div className="footer-top">
          <Brand />
          <nav aria-label="Footer" className="footer-navigation">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
          <a className="text-link" href={`mailto:${email}`}>
            {email}
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>
        <div className="footer-meta meta">
          <span>{location}</span>
          <span>Film · Advertising · Production</span>
          <span>© {new Date().getFullYear()} Sanmedia</span>
        </div>
        <p className="footer-wordmark wordmark-outline" aria-hidden="true">
          SANMEDIA
        </p>
        <div className="footer-bottom meta">
          <span>Visual storytelling. With intent.</span>
          <a href="#main">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}
