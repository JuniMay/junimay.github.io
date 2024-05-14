import { getPostData, getSortedPostsData } from '../../../lib/posts'

export async function generateStaticParams() {
  const posts = getSortedPostsData()
  return posts.map((post) => ({
    id: post.id,
  }))
}

export default async function Post({ params }: { params: { id: string } }) {
  const postData = await getPostData(params.id)

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-4">{postData.title}</h1>
      <div className="text-gray-500">{postData.date}</div>
      <div className="mt-4 markdown" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </div>
  )
}
