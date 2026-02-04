import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full bg-black text-gray-300 py-3 lg:py-7 border-t border-red-800 border-opacity-80 ">
      {/* Center content */}
      <div className="max-w-4xl mx-auto text-center px-4">
        {/* Logo */}
        <h1 className="text-xl lg:text-3xl font-bold">
          <Link href="/" className="animate-gradient-red hover:brightness-125 transition-colors">
            CinemaSpace
          </Link>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-200 text-sm lg:text-base mt-2">
          Created by <span className="text-white font-semibold">Michal Hudák</span>
        </p>

        {/* Small text */}
        <p className="text-gray-200 text-sm lg:text-base mt-2">
          © {new Date().getFullYear()} CinemaSpace. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
