import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-4 bg-[#0F0F0F] border-b border-gray-700">
      <Link
        href="/"
        className="flex items-center gap-2 text-2xl font-bold text-red-600"
      >
        <span className="text-white cursor-pointer">
          You<span className="text-red-600">Bit</span>
        </span>
      </Link>

      <div className="hidden md:flex items-center w-full max-w-xl">
        <div className="flex items-center w-full px-4 py-2 border border-gray-700 rounded-3xl focus-within:border-red-600 transition-colors duration-200">
          <input
            type="text"
            placeholder="Cari video..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/login">
          <button className="flex items-center px-4 py-2 border border-gray-700 rounded-3xl hover:bg-[#263850] cursor-pointer text-white">
            Login
          </button>
        </Link>
        <Link href="/menu/streamer">
          <button className="flex items-center px-4 py-2 border border-gray-700 rounded-3xl hover:bg-[#263850] cursor-pointer text-white">
            Report
          </button>
        </Link>
      </div>
    </nav>
  );
}
``;
