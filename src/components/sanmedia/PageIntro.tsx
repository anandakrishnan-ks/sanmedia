import type { ReactNode } from "react";

export function PageIntro({
  number,
  eyebrow,
  title,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string[];
  children?: ReactNode;
}) {
  return (
    <header className="page-intro site-container">
      <p className="eyebrow meta">
        <span>{number} /</span> {eyebrow}
      </p>
      <div className="intro-grid">
        <h1 className="display page-title">
          {title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>
        {children && <div className="intro-description">{children}</div>}
      </div>
      <div className="intro-rule" />
    </header>
  );
}
