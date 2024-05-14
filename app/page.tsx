import Link from 'next/link'
import { getSortedPostsData } from '../lib/posts'
import './globals.css'

export default function Home() {
  const allPostsData = getSortedPostsData()

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold my-4">My Blog</h1>
      <ul>
        {allPostsData.map(({ id, date, title }) => (
          <li key={id} className="mb-4">
            <Link href={`/posts/${id}`} className="text-xl text-blue-500">
              {title}
            </Link>
            <br />
            <small className="text-gray-500">{date}</small>
          </li>
        ))}
      </ul>
    </div>
  )
}
