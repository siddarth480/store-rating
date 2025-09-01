"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";

const NAME_MIN = 3;
const NAME_MAX = 60;
const ADDRESS_MAX = 400;

const passwordOk = (pwd: string) =>
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_\-+=[\]{};:'",.<>/?\\|`~]).{8,16}$/.test(pwd);

export default function SignupPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setOk(null);

    // ✅ Client-side validation
    if (name.trim().length < NAME_MIN || name.trim().length > NAME_MAX) {
      setErr(`Name must be ${NAME_MIN}-${NAME_MAX} characters.`);
      return;
    }
    if (address.trim().length === 0 || address.trim().length > ADDRESS_MAX) {
      setErr(`Address is required and must be ≤ ${ADDRESS_MAX} characters.`);
      return;
    }
    if (!passwordOk(password)) {
      setErr(
        "Password must be 8–16 chars, include at least one uppercase and one special character."
      );
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create auth user
      const { data, error: signUpErr } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpErr) throw new Error(signUpErr.message);

      const userId = data.user?.id;
      if (!userId) throw new Error("Failed to get user ID after signup.");

      // 2️⃣ Ensure email uniqueness in profiles
      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("email", email)
        .maybeSingle();

      if (existing) {
        throw new Error("Email already exists in profiles. Please log in instead.");
      }

      // 3️⃣ Insert profile with default role = user
      const { error: profileErr } = await supabase.from("profiles").insert({
        id: userId,
        name,
        address,
        email,
        role: "user",
      });

      if (profileErr) throw new Error(profileErr.message);

      setOk("✅ Account created successfully! Please check your email to confirm.");

      // if email confirmation is disabled → auto redirect
      if (!data.session) {
        setOk("Account created! Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 1500);
      }
    } catch (error: any) {
      setErr(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-100 via-white to-emerald-200 px-4">
      <div className="w-full max-w-xl">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Create your account
          </h1>
          <p className="text-center text-gray-500 mb-6">
            Join StoreRatings today
          </p>

          {err && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
              {err}
            </div>
          )}
          {ok && (
            <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-2 text-sm">
              {ok}
            </div>
          )}

          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                minLength={NAME_MIN}
                maxLength={NAME_MAX}
                required
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                maxLength={ADDRESS_MAX}
                required
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  maxLength={16}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 px-3 text-gray-500"
                  onClick={() => setShowPwd((s) => !s)}
                >
                  {showPwd ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 text-white py-3 font-semibold hover:bg-emerald-700 transition disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{" "}
            <a
              href="/auth/login"
              className="text-emerald-700 font-medium hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
