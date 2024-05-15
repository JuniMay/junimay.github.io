import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  return (
    <nav className="bg-gray-700 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link
          href="/"
          className="text-white text-2xl font-bold hover:text-gray-300 transition duration-300"
        >
          Juni&apos;s Blog
        </Link>
        <div className="flex space-x-6">
          <Link
            href="/"
            className="text-gray-300 hover:text-white transition duration-300"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-300 hover:text-white transition duration-300"
          >
            About
          </Link>
          <Link href="https://github.com/JuniMay">
            <Image
              src="/github.svg"
              alt="GitHub"
              className="w-6 h-6 invert"
              width={1}
              height={1}
            />
          </Link>

          <Link href="https://www.linkedin.com/in/junyi-mei-35b524304/">
            <Image
              src="/linkedin.svg"
              alt="LinkedIn"
              className="w-6 h-6 invert"
              width={1}
              height={1}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
