"use client";

import Link from "next/link";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="error-page site-container">
      <p className="eyebrow meta">A brief intermission</p>
      <h1 className="display page-title">
        THIS SCENE
        <br />
        DIDN&apos;T LOAD.
      </h1>
      <p className="body-copy">Something went wrong. Refresh the scene or head back home.</p>
      <div className="error-actions">
        <button type="button" className="text-link" onClick={reset}>
          Try again ↗
        </button>
        <Link href="/" className="text-link">
          Back to the film ↗
        </Link>
      </div>
    </section>
  );
}
