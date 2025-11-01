"use client";

import SmartBackButton from "../../components/SmartBackButton";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [message, setMessage] = useState("");

  // ✅ Login / Signup logic
  async function handleAuth() {
    setMessage("Processing...");

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) setMessage("❌ " + error.message);
      else {
        setMessage("✅ Logged in successfully!");
        router.push("/upload"); // ✅ Redirect to upload
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) setMessage("❌ " + error.message);
      else setMessage("✅ Account created! Check your email to verify.");
    }
  }

  // ✅ Logout + redirect to /auth
  async function handleLogout() {
    await supabase.auth.signOut();
    setMessage("👋 You have logged out.");
    router.push("/auth");
  }

  // ✅ Back button → return to landing page
  function handleBack() {
    router.push("/");
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-emerald-100 relative overflow-hidden p-6">
      {/* 🌅 Animated sunrise effect */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-amber-100/80 to-transparent animate-pulse"></div>

      {/* 🍃 Floating leaves */}
      <div className="absolute bottom-0 w-full flex justify-around opacity-30 animate-bounce">
        <span className="text-green-500 text-3xl">🍃</span>
        <span className="text-green-400 text-2xl">🌿</span>
        <span className="text-yellow-500 text-3xl">🌻</span>
      </div>

      {/* 🔙 Back + Logout Buttons (Top Bar) */}
      <div className="absolute top-5 left-5 flex gap-3 z-20">
        <button
          onClick={handleBack}
          className="bg-green-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-green-700 transition duration-300"
        >
          ⬅️ Back
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-full shadow-md hover:bg-red-600 transition duration-300"
        >
          🚪 Logout
        </button>
      </div>

      {/* 🌾 Auth Card */}
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-sm border border-green-100 relative z-10">
        <h1 className="text-3xl font-extrabold text-green-700 mb-6 text-center">
          {mode === "login" ? "🌾 Welcome Back" : "🌻 Join VillageConnect"}
        </h1>

        <p className="text-gray-600 text-sm text-center mb-6">
          {mode === "login"
            ? "Login to share your village stories with the world."
            : "Sign up and start connecting with your community."}
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          className="border border-green-200 p-3 mb-4 w-full rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter your password"
          className="border border-green-200 p-3 mb-4 w-full rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleAuth}
          className="bg-green-600 text-white w-full py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition"
        >
          {mode === "login" ? "🌿 Login" : "🌾 Sign Up"}
        </button>

        {message && (
          <p className="mt-4 text-center text-green-800 font-medium whitespace-pre-line">
            {message}
          </p>
        )}

        <div className="mt-6 text-center text-sm text-gray-600">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button
            className="text-green-600 hover:underline font-semibold"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "🌻 Sign up" : "🌿 Login"}
          </button>
        </div>
      </div>

      {/* 🌱 Footer */}
      <footer className="mt-10 text-gray-500 text-xs text-center">
        🌱 VillageConnect • Crafted with love for rural innovation
      </footer>
    </main>
  );
}
