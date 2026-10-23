import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const tiers = [
  {
    number: "01",
    name: "ESSENTIAL",
    lines: ["Smart production.", "Strong storytelling.", "Designed for focused budgets."],
  },
  {
    number: "02",
    name: "SIGNATURE",
    lines: ["More production depth.", "Cinematic visuals.", "Premium execution."],
  },
  {
    number: "03",
    name: "PREMIUM",
    lines: ["Full-scale production.", "High-end cinematography.", "Maximum creative freedom."],
  },
];

export function Budget() {
  return (
    <section className="budget-section section-space paper-section" id="budget">
      <div className="site-container">
        <p className="eyebrow meta" data-reveal>
          Production scales
        </p>
        <div className="section-heading">
          <h2 className="display section-title" data-reveal>
            THE STORY
            <br />
            COMES FIRST.
          </h2>
          <p className="body-copy" data-reveal>
            From focused productions to full-scale cinematic campaigns, we build the strongest
            visual language possible within your budget.
          </p>
        </div>
        <div className="budget-grid">
          {tiers.map((tier) => (
            <Link href="/contact" key={tier.number} className="budget-tier" data-reveal>
              <div className="budget-tier-top">
                <span className="meta">{tier.number}</span>
                <ArrowUpRight size={22} strokeWidth={1} aria-hidden="true" />
              </div>
              <h3 className="display">{tier.name}</h3>
              <ul>
                {tier.lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
              <span className="budget-tier-link meta">Discuss your production</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
