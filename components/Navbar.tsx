import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="bg-gray-700 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-2xl font-bold hover:text-gray-300 transition duration-300">
          Juni&apos;s Blog
        </Link>
        <div className="flex space-x-6">
          <Link href="/" className="text-gray-300 hover:text-white transition duration-300">
            Home
          </Link>
          <Link href="/about" className="text-gray-300 hover:text-white transition duration-300">
            About
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
