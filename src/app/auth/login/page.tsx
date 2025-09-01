"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Role = "admin" | "owner" | "user";

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    // 1️⃣ Try login with Supabase
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setErr(signInError.message);
      setLoading(false);
      return;
    }

    // 2️⃣ Get the logged-in user
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      setErr("Failed to fetch user details after login.");
      setLoading(false);
      return;
    }

    const userId = userData.user.id;

    // 3️⃣ Fetch role from profiles table
    let role: Role = "user";
    const { data: profile, error: profileErr } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (!profileErr && profile?.role) {
      role = profile.role as Role;
    }

    setLoading(false);

    // 4️⃣ Role-based redirect
    if (role === "admin") router.replace("/admin/dashboard");
    else if (role === "owner") router.replace("/owner/dashboard");
    else router.replace("/user/dashboard");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="h-12 w-12 rounded-xl bg-blue-600 flex items-center justify-center shadow">
              {/* lock icon */}
              <svg width="24" height="24" fill="none" className="text-white">
                <path
                  d="M6 10V8a6 6 0 1 1 12 0v2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <rect
                  x="4"
                  y="10"
                  width="16"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-gray-900">
            Welcome back
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Log in to your account
          </p>

          {err && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
              {err}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  aria-label="Toggle password visibility"
                  className="absolute inset-y-0 right-0 px-3 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPwd((s) => !s)}
                >
                  {showPwd ? (
                    // eye-off
                    <svg width="20" height="20" fill="none">
                      <path
                        d="M3 3l14 14"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M10.94 10.94A3 3 0 0 1 9.06 9.06"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M10 5c4.5 0 7.5 3.5 9 5-1 1.11-3.55 3.75-7.03 4.6M6.1 13.9C3.8 12.97 2 11 1 10c.82-.9 2.63-2.73 5.1-3.9"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  ) : (
                    // eye
                    <svg width="20" height="20" fill="none">
                      <path
                        d="M1 10s3-5 9-5 9 5 9 5-3 5-9 5-9-5-9-5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <circle
                        cx="10"
                        cy="10"
                        r="3"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 text-white py-3 font-semibold shadow hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
            <a
              href="/auth/signup"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign up
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
