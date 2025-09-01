"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

type Role = "admin" | "owner" | "user" | null;

export default function Navbar() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch user + role
  const fetchUserRole = async () => {
    const { data: userData } = await supabase.auth.getUser();

    if (!userData.user) {
      setRole(null);
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userData.user.id)
      .single();

    setRole(profile?.role as Role);
    setLoading(false);
  };

  useEffect(() => {
    fetchUserRole();

    // listen for login/logout events
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, _session) => {
      fetchUserRole();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setRole(null);
    router.push("/auth/login");
  };

  if (loading) {
    return (
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow px-6 py-3">
        <p>Loading...</p>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="font-extrabold text-xl text-blue-600 tracking-tight hover:opacity-80">
          Rate<span className="text-gray-900">Store</span>
        </Link>

        {/* Links */}
        <div className="flex items-center space-x-6">
          {/* Public links */}
          {!role && (
            <>
              <Link
                href="/auth/login"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/auth/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
              >
                Sign Up
              </Link>
            </>
          )}

          {/* User links */}
          {role === "user" && (
            <>
              <Link
                href="/user/dashboard"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 shadow transition"
              >
                Logout
              </button>
            </>
          )}

          {/* Owner links */}
          {role === "owner" && (
            <>
              <Link
                href="/owner/dashboard"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Owner Panel
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 shadow transition"
              >
                Logout
              </button>
            </>
          )}

          {/* Admin links */}
          {role === "admin" && (
            <>
              <Link
                href="/admin/dashboard"
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Admin Panel
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-red-500 text-white hover:bg-red-600 shadow transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
