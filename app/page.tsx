import Link from "next/link";
import { getSortedPostsData } from "../lib/posts";
import "./globals.css";

export default function Home() {
  const allPostsData = getSortedPostsData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold my-4">Posts</h1>
      <ul>
        {allPostsData.map(({ id, date, title, tags }) => (
          <li key={id} className="mb-4">
            <Link href={`/posts/${id}`} className="text-xl text-gray-700 my-4">
              {title}
            </Link>
            <div className="my-2">
              {tags && (
                <div className="flex space-x-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-700 px-2 py-1 text-sm text-white rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <small className="text-gray-500">{date}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
