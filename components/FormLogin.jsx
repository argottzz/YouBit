import Link from "next/link";

export default function LoginForm({
  logo,
  subtitle,
  buttonText,
  registerText,
  registerLink,
  backText,
}) {
  return (
    <div className="min-h-screen bg-black/60 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black/40 border border-gray-800 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-white">
              {logo}
            </span>
          </h1>

          <p className="text-gray-400 mt-2">
            {subtitle}
          </p>
        </div>

        <form className="space-y-5">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Masukkan email"
              className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-700 rounded-xl text-white placeholder-gray-500 outline-none focus:border-red-600 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Password
            </label>

            <input
              type="password"
              placeholder="Masukkan password"
              className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-700 rounded-xl text-white placeholder-gray-500 outline-none focus:border-red-600 transition"
            />
          </div>
          
          <Link href="/">
          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl cursor-pointer transition"
          >
            {buttonText}
          </button>
          </Link>
          
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          {registerText}{" "}
          <Link
            href="/daftar"
            className="text-red-500 hover:text-red-400"
          >
            {registerLink}
          </Link>
        </p>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-gray-500 hover:text-white text-sm"
          >
            {backText}
          </Link>
        </div>
      </div>
    </div>
  );
}