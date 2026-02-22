import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStarryNight from "rehype-starry-night";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";

/**
 * Store source markdown under /public/posts so local image references can resolve
 * in both this site and external markdown editors.
 */
const postsDirectory = path.join(process.cwd(), "public/posts");

interface PostFrontmatter {
  date: string;
  title: string;
  tags?: string[];
}

export interface PostListItem extends PostFrontmatter {
  id: string;
}

export interface PostData extends PostListItem {
  contentHtml: string;
}

/**
 * Read and sort post metadata for index/list pages.
 * Synchronous fs calls are acceptable here because this runs at build time / server side.
 */
export function getSortedPostsData(): PostListItem[] {
  const fileNames = fs.readdirSync(postsDirectory);

  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith(".md"))
    .map((fileName) => {
      const id = fileName.replace(/\.md$/, "");

      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const matterResult = matter(fileContents);

      return {
        id,
        ...(matterResult.data as PostFrontmatter),
      };
    });

  // Newest posts first; date is stored as sortable YYYY-MM-DD strings.
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

/**
 * Compile a single markdown post to HTML.
 *
 * Pipeline:
 * - `remarkGfm`: tables/task lists/strikethrough
 * - `remarkMath` + `rehypeKatex`: LaTeX math rendering
 * - `rehypeStarryNight`: code highlighting (unknown/missing scopes gracefully stay plain text)
 * - `rehypeRaw`: allow trusted inline HTML blocks from authored markdown
 */
export async function getPostData(id: string): Promise<PostData> {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkMath)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw)
    .use(rehypeKatex, { strict: false })
    .use(rehypeStarryNight, { allowMissingScopes: true })
    .use(rehypeStringify)
    .process(matterResult.content);

  // Rewrite `./image.png` to `/posts/image.png` so images load from public assets.
  const contentHtml = processedContent
    .toString()
    .replace(/src="\.\/(.*?)"/g, `src="/posts/$1"`);

  return {
    id,
    contentHtml,
    ...(matterResult.data as PostFrontmatter),
  };
}
