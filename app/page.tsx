"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  // Redirect if session is found
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.push("/dashboard");
    });
    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    await supabase.auth.signInWithOtp({ 
      email, 
      options: { emailRedirectTo: "http://localhost:3000" } 
    });
    alert("Check your email!");
  };

  return (
    <div className="bg-black min-h-screen text-white flex items-center justify-center">
      <form onSubmit={handleLogin} className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800">
        <h1 className="text-2xl font-bold mb-4">Uniis Login</h1>
        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          className="bg-black border border-zinc-700 p-3 rounded-lg w-full mb-4"
          placeholder="Enter email"
        />
        <button className="bg-white text-black w-full py-3 rounded-lg font-bold">Get Magic Link</button>
      </form>
    </div>
  );
}