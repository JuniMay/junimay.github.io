import {
  Badge,
  DetailItem,
  PageHero,
  PageSection,
  SplitRow,
} from "../../components/page/StructuredContent";
import {
  ABOUT_HERO,
  ABOUT_SITE_TEXT,
  COMPETITIONS,
  CONTACT_LINKS,
  EDUCATION,
  HONORS,
  SKILLS,
} from "./content";

/**
 * About page renderer:
 * - data is declared in `content.ts`
 * - UI structure comes from reusable `StructuredContent` primitives
 *
 * This pattern keeps future page editing mostly "data-only".
 */
export default function About() {
  return (
    <main className="page-shell about-page">
      <PageHero
        routeLabel={ABOUT_HERO.routeLabel}
        title={ABOUT_HERO.title}
        subtitle={ABOUT_HERO.subtitle}
        introParagraphs={ABOUT_HERO.introParagraphs}
      />

      <PageSection title="Education">
        {EDUCATION.map((entry) => (
          <div key={entry.institution} className="stack-block">
            <SplitRow
              title={entry.institution}
              description={<p>{entry.program}</p>}
              meta={<p>{entry.locationAndDate}</p>}
            />
            {entry.courseSummary && (
              <p className="indented-text">
                <span className="strong-text">Main Courses:</span> {entry.courseSummary}
              </p>
            )}
          </div>
        ))}
      </PageSection>

      <PageSection title="Honors and Awards">
        {HONORS.map((honor) => (
          <SplitRow
            key={honor.title}
            title={honor.title}
            meta={<p>{honor.issuerAndDate}</p>}
            className="tight-row"
          />
        ))}
      </PageSection>

      <PageSection title="Competitions" contentClassName="detail-item-list">
        {/* Rich list items handle badge/meta/context/bullets in one reusable component. */}
        {COMPETITIONS.map((competition) => (
          <DetailItem
            key={competition.title}
            title={
              <>
                {competition.title}
                {competition.titleNote && (
                  <span className="muted-inline-note"> ({competition.titleNote})</span>
                )}
              </>
            }
            badge={<Badge>{competition.award}</Badge>}
            meta={<p>{competition.roleLocationAndDate}</p>}
            contextLines={competition.contextLines}
            bullets={competition.highlights}
          />
        ))}
      </PageSection>

      <PageSection title="Skills">
        <ul className="detail-item-bullets">
          {SKILLS.languages.map((item) => (
            <li key={item.label}>
              <span className="strong-text">{item.label}:</span> {item.detail}
            </li>
          ))}
          <li>
            <span className="strong-text">Programming Languages</span>
            <ul className="nested-bullet-list">
              {SKILLS.programming.map((entry) => (
                <li key={entry}>{entry}</li>
              ))}
            </ul>
          </li>
          {SKILLS.additional.map((entry) => (
            <li key={entry}>{entry}</li>
          ))}
        </ul>
      </PageSection>

      <PageSection title="About This Site">
        <p>{ABOUT_SITE_TEXT}</p>
      </PageSection>

      <PageSection title="Contact">
        <ul className="detail-item-bullets">
          {/* Keep link metadata in content.ts so labels/URLs stay centralized. */}
          {CONTACT_LINKS.map((contact) => (
            <li key={contact.label}>
              {contact.label}:{" "}
              <a href={contact.href} className="about-link" target="_blank" rel="noreferrer">
                {contact.text}
              </a>
            </li>
          ))}
        </ul>
      </PageSection>
    </main>
  );
}
