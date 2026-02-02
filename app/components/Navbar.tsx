'use client';

import { useState, useContext } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { HiOutlineX } from 'react-icons/hi';
import { BiCameraMovie } from 'react-icons/bi';
import { FaUserCircle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { token, setToken } = useContext(AuthContext);

  const [isOpen, setIsOpen] = useState(false); // mobile menu
  const [dropdownOpen, setDropdownOpen] = useState(false); // profile dropdown

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    setToken(null);
    setDropdownOpen(false);
    router.push('/login');
  };

  const linkClass = (path: string) =>
    pathname === path
      ? 'text-red-600 font-bold no-underline'
      : 'text-white hover:text-red-600 font-bold no-underline';

  const profileActive =
    pathname === '/profile' || pathname === '/login'
      ? 'text-red-600'
      : 'text-white hover:text-red-600';

  return (
    <nav className="w-full bg-black/95 border-b border-red-700 border-opacity-80 text-gray-100 px-6 py-4 flex justify-between items-center fixed top-0 z-[300] h-[72px]">
      {/* Logo */}
      <h1 className="text-xl font-black">
        <Link
          href="/"
          className="animate-gradient-red transition-colors hover:brightness-125 no-underline"
        >
          CinemaSpace
        </Link>
      </h1>

      {/* Desktop Menu */}
      <ul className="hidden lg:flex gap-6 text-lg tracking-wider items-center">
        {['/', '/series', '/person', '/categories', '/informations'].map((path, idx) => {
          const name = ['Home', 'Series', 'Actors', 'Categories', 'Informations'][idx];
          return (
            <li key={path}>
              <Link href={path} className={linkClass(path)}>
                {name}
              </Link>
            </li>
          );
        })}

        {/* Profile Dropdown (Desktop) */}
        <li className="relative">
          <button
            onClick={() => {
              if (!token) return router.push('/login');
              setDropdownOpen(!dropdownOpen);
            }}
            className={`${profileActive} hover:scale-110 transition`}
          >
            <FaUserCircle size={28} />
          </button>

          {dropdownOpen && token && (
            <ul className="absolute right-0 mt-2 w-40 bg-gray-800 border border-red-900 rounded shadow-lg flex flex-col z-[400] h-20">
              <li className="h-1/2">
                <Link
                  href="/profile"
                  className="flex items-center justify-center w-full h-full border-b border-red-900 text-white font-semibold hover:bg-gray-700 transition"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link>
              </li>
              <li className="h-1/2">
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center w-full h-full text-red-600 font-semibold hover:bg-gray-700 transition"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </li>
      </ul>

      {/* Mobile Burger + Profile */}
      <div className="lg:hidden flex items-center gap-3 relative z-[350]">
        <button
          onClick={() => {
            if (!token) return router.push('/login');
            setDropdownOpen(!dropdownOpen);
          }}
          className={`${profileActive} hover:scale-125 transition`}
        >
          <FaUserCircle size={28} />
        </button>

        {dropdownOpen && token && (
          <ul className="fixed top-[72px] right-4 w-36 bg-gray-900 border-2 border-red-800/60 rounded shadow-lg flex flex-col z-[500] overflow-hidden">
            <li className="h-1/2">
              <Link
                href="/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center justify-center h-full w-full py-3 text-white font-semibold hover:bg-gray-800 transition"
              >
                Profile
              </Link>
            </li>

            <li className="h-1/2">
              <button
                onClick={handleLogout}
                className="flex items-center justify-center h-full w-full py-3 text-red-600 font-semibold hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </li>
          </ul>
        )}

        <button
          onClick={toggleMenu}
          aria-label="Open menu"
          className="flex items-center justify-center hover:text-red-600 hover:scale-125 transition z-[360]"
        >
          {!isOpen ? <BiCameraMovie size={32} /> : <HiOutlineX size={24} />}
        </button>
      </div>

      {/* Mobile Overlay Menu */}
      {isOpen && (
        <div className="fixed inset-x-0 top-[70px] bottom-0 bg-black/85 backdrop-blur-sm z-[200] flex flex-col items-center justify-center overflow-y-auto">
          <ul className="flex flex-col gap-8 text-3xl text-white text-center font-bold">
            {['/', '/series', '/person', '/categories', '/informations'].map((path, idx) => {
              const name = ['Home', 'Series', 'Actors', 'Categories', 'Informations'][idx];
              return (
                <li key={path}>
                  <Link href={path} className={linkClass(path)} onClick={toggleMenu}>
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </nav>
  );
}
