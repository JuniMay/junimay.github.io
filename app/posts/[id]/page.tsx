import { getPostData, getSortedPostsData } from "../../../lib/posts";

export async function generateStaticParams() {
  const posts = getSortedPostsData();
  return posts.map((post) => ({
    id: post.id,
  }));
}

export default async function Post({ params }: { params: { id: string } }) {
  const postData = await getPostData(params.id);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-4">{postData.title}</h1>
      {postData.tags && (
        <div className="flex space-x-2">
          {postData.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-700 px-2 py-1 text-sm text-white rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      <div className="text-gray-500 my-4">{postData.date}</div>
      <div
        className="mt-4 markdown"
        dangerouslySetInnerHTML={{ __html: postData.contentHtml }}
      />
    </div>
  );
}
