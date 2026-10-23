import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <section className="error-page site-container">
      <p className="eyebrow meta">404 / Out of frame</p>
      <h1 className="display page-title">
        FINAL SCENE
        <br />
        NOT FOUND.
      </h1>
      <p className="body-copy">
        The reel you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/" className="text-link">
        Back to the film
        <ArrowUpRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
