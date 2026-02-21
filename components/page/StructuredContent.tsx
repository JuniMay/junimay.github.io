import type { ReactNode } from "react";

/**
 * Shared primitives for content-heavy pages.
 *
 * The goal is to keep pages data-driven:
 * - page file: mostly maps over arrays of content
 * - components file: owns structure and semantics
 * - stylesheet: owns look-and-feel
 */

type ClassValue = string | null | undefined | false;

function cx(...classNames: ClassValue[]): string {
  return classNames.filter(Boolean).join(" ");
}

export interface PageHeroProps {
  routeLabel: string;
  title: string;
  subtitle?: string;
  introParagraphs?: string[];
  className?: string;
}

/**
 * Standard hero block for top-of-page context.
 * Reuse on About, Projects, Reading List, etc.
 */
export function PageHero({
  routeLabel,
  title,
  subtitle,
  introParagraphs = [],
  className,
}: PageHeroProps) {
  return (
    <section className={cx("hero-panel", className)}>
      <p className="eyebrow">{routeLabel}</p>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
      {introParagraphs.map((paragraph) => (
        <p key={paragraph} className="about-intro">
          {paragraph}
        </p>
      ))}
    </section>
  );
}

export interface PageSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * Reusable section card with consistent title/divider spacing.
 * Keeps different pages visually coherent without repeating boilerplate.
 */
export function PageSection({
  title,
  children,
  className,
  contentClassName,
}: PageSectionProps) {
  return (
    <section className={cx("structured-section", className)}>
      <h2 className="structured-section-title">{title}</h2>
      <hr className="structured-section-divider" />
      <div className={cx("structured-section-body", contentClassName)}>{children}</div>
    </section>
  );
}

export interface SplitRowProps {
  title: ReactNode;
  meta?: ReactNode;
  description?: ReactNode;
  className?: string;
}

/**
 * Two-column heading row for entries like education, honors, or experience.
 *
 * Left side: title + optional description.
 * Right side: date/location metadata.
 */
export function SplitRow({ title, meta, description, className }: SplitRowProps) {
  return (
    <article className={cx("split-row", className)}>
      <div className="split-row-main">
        <h3 className="split-row-title">{title}</h3>
        {description && <div className="split-row-description">{description}</div>}
      </div>
      {meta && <div className="split-row-meta">{meta}</div>}
    </article>
  );
}

export interface BadgeProps {
  children: ReactNode;
  className?: string;
}

/**
 * Semantic badge used for awards, tags, and labels.
 */
export function Badge({ children, className }: BadgeProps) {
  return <span className={cx("info-badge", className)}>{children}</span>;
}

export interface DetailItemProps {
  title: ReactNode;
  badge?: ReactNode;
  meta?: ReactNode;
  contextLines?: ReactNode[];
  bullets?: ReactNode[];
  className?: string;
}

/**
 * Rich, reusable list item for sections that need:
 * - title
 * - optional badge
 * - optional date/location meta
 * - optional context lines
 * - bullet highlights
 */
export function DetailItem({
  title,
  badge,
  meta,
  contextLines = [],
  bullets = [],
  className,
}: DetailItemProps) {
  return (
    <article className={cx("detail-item", className)}>
      <header className="detail-item-header">
        <h3 className="detail-item-title">{title}</h3>
        {badge && <div className="detail-item-badge">{badge}</div>}
        {meta && <div className="detail-item-meta">{meta}</div>}
      </header>

      {contextLines.length > 0 && (
        <div className="detail-item-context">
          {contextLines.map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
      )}

      {bullets.length > 0 && (
        <ul className="detail-item-bullets">
          {bullets.map((bullet, index) => (
            <li key={index}>{bullet}</li>
          ))}
        </ul>
      )}
    </article>
  );
}
