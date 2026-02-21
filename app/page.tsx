import Link from "next/link";
import type { CSSProperties } from "react";
import { getSortedPostsData } from "../lib/posts";

export default function Home() {
  // Server component read: post metadata is loaded at render/build time.
  const allPostsData = getSortedPostsData();

  return (
    <main className="main-shell">
      <section className="hero-panel">
        <p className="eyebrow">/posts</p>
        <h1 className="page-title">System notes, ideas, and research logs.</h1>
        <p className="page-subtitle">
          Just a minimal technical blog.
        </p>
      </section>

      <section className="card-grid" aria-label="Posts list">
        {allPostsData.map(({ id, date, title, tags }, index) => (
          <article
            key={id}
            className="post-card"
            // `--card-index` staggers animation delays in CSS for a calmer entrance.
            style={{ "--card-index": index } as CSSProperties}
          >
            <Link href={`/posts/${id}`} className="post-link">
              {title}
            </Link>

            {tags && tags.length > 0 && (
              <div className="tag-row">
                {tags.map((tag) => (
                  <span key={tag} className="tag-pill">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p className="muted-date">{date}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
