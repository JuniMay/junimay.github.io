import { getPostData, getSortedPostsData } from "../../../lib/posts";

// Build static routes for every markdown file in /public/posts.
export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function Post({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // Markdown is compiled on the server and injected as trusted HTML.
  const postData = await getPostData(id);

  return (
    <main className="page-shell">
      <article className="article-shell">
        <p className="eyebrow">/posts/{postData.id}.md</p>
        <h1 className="page-title">{postData.title}</h1>

        {postData.tags && (
          <div className="tag-row">
            {postData.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <p className="muted-date">{postData.date}</p>

        <div
          className="markdown article-content"
          // Content is authored locally and processed by the remark/rehype pipeline.
          dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
        />
      </article>
    </main>
  );
}
