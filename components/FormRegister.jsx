"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function FormRegister({
  logo,
  subtitle,
  buttonText,
  registerText,
  registerLink,
  backText,
}) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validasi mengikuti registerSchema backend:
    // username min 3, email valid, password min 6
    if (username.trim().length < 3) {
      setError("Username minimal 3 karakter");
      return;
    }
    if (email.trim() === "" || password === "") {
      setError("Email dan password harus diisi");
      return;
    }
    if (password.length < 6) {
      setError("Password minimal 6 karakter");
      return;
    }
    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak sama");
      return;
    }

    setLoading(true);
    try {
      // POST /api/register ke Express -> dapat JWT (token) + data user
      await register({ username: username.trim(), email: email.trim(), password });
      router.push("/menu/streamer");
    } catch (err) {
      setError(err.message || "Gagal register");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black/60 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-black/40 border border-gray-800 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            <span className="text-white">{logo}</span>
          </h1>

          <p className="text-gray-400 mt-2">{subtitle}</p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm text-gray-300 mb-2">Username</label>

            <input
              type="text"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-700 rounded-xl text-white placeholder-gray-500 outline-none focus:border-red-600 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Email</label>

            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-700 rounded-xl text-white placeholder-gray-500 outline-none focus:border-red-600 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Password</label>

            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-700 rounded-xl text-white placeholder-gray-500 outline-none focus:border-red-600 transition"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              Konfirmasi Password
            </label>

            <input
              type="password"
              placeholder="Konfirmasi"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0F0F0F] border border-gray-700 rounded-xl text-white placeholder-gray-500 outline-none focus:border-red-600 transition"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl cursor-pointer transition disabled:opacity-50"
          >
            {loading ? "Mendaftarkan..." : buttonText}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          {registerText}{" "}
          <Link href="/login" className="text-red-500 hover:text-red-400">
            {registerLink}
          </Link>
        </p>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-500 hover:text-white text-sm">
            {backText}
          </Link>
        </div>
      </div>
    </div>
  );
}
