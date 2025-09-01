// src/utils/supabaseClient.ts
"use client";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://fzademwzyyhtqyvgidtt.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6YWRlbXd6eXlodHF5dmdpZHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTkxNzYsImV4cCI6MjA3MTQzNTE3Nn0.KsBAP7mynHHbMozIwY8PO6bk41QNPe66LiPCBkWsJyU";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,   // ✅ keeps the user logged in
    autoRefreshToken: true, // ✅ refreshes token automatically
    detectSessionInUrl: true, // ✅ needed for OAuth/redirects
  },
});
