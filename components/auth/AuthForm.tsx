"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api";
import FormInput from "@/components/common/FormInput";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";
  const router = useRouter();
  const { login, register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (isRegister && username.trim().length < 3) {
      return setError("Username minimal 3 karakter");
    }
    if (!email.trim() || !password) {
      return setError("Email dan password harus diisi");
    }
    if (isRegister && password.length < 6) {
      return setError("Password minimal 6 karakter");
    }
    if (isRegister && password !== confirmPassword) {
      return setError("Konfirmasi password tidak sama");
    }

    setLoading(true);
    try {
      if (isRegister) {
        await register({ username: username.trim(), email: email.trim(), password });
      } else {
        await login({ email: email.trim(), password });
      }
      router.push("/");
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : isRegister
            ? "Gagal register"
            : "Email atau password salah",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4">
      <div className="w-full max-w-md rounded-2xl border border-line bg-card p-8">
        <div className="mb-8 text-center">
          <p className="text-3xl font-bold text-ink">
            VIEW<span className="text-primary">RA</span>
          </p>
          <p className="mt-2 text-sm text-muted">
            {isRegister ? "Buat akun VIEWRA baru" : "Masuk ke akun VIEWRA"}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <FormInput
              label="Username"
              placeholder="Masukkan username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          )}
          <FormInput
            label="Email"
            type="email"
            placeholder="Masukkan email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormInput
            label="Password"
            type="password"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isRegister && (
            <FormInput
              label="Konfirmasi Password"
              type="password"
              placeholder="Ulangi password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          )}

          {error && (
            <p className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-3 font-semibold text-base transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Memproses..." : isRegister ? "Daftar" : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-muted">
          {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
          <Link
            href={isRegister ? "/login" : "/register"}
            className="font-semibold text-primary hover:brightness-110"
          >
            {isRegister ? "Login" : "Daftar sekarang"}
          </Link>
        </p>
        <div className="mt-4 text-center">
          <Link href="/" className="text-sm text-muted hover:text-ink">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
