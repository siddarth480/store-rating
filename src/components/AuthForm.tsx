"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  type: "login" | "signup";
}

export default function AuthForm({ type }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (type === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/user/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        router.push("/auth/login");
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white/90 backdrop-blur-md shadow-lg rounded-2xl p-8 mt-12">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        {type === "login" ? "Login to your account" : "Create a new account"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Processing..." : type === "login" ? "Login" : "Sign Up"}
        </button>
      </form>
    </div>
  );
}
