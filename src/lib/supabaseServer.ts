import { cookies } from "next/headers";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";

/**
 * Supabase server-side client
 * Use inside server components, layouts, and route handlers
 */
export const createSupabaseServerClient = () => {
  return createServerComponentClient(
    { cookies },
    {
      supabaseUrl: 'https://fzademwzyyhtqyvgidtt.supabase.co',
      supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ6YWRlbXd6eXlodHF5dmdpZHR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU4NTkxNzYsImV4cCI6MjA3MTQzNTE3Nn0.KsBAP7mynHHbMozIwY8PO6bk41QNPe66LiPCBkWsJyU',
    }
  );
};
