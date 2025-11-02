"use client";

import Link from "next/link";
import AIAgent from "@/app/components/AIAgent";

export default function VillageConnectLanding() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-emerald-100 text-center p-6">
      {/* 🌾 Hero Section */}
      <div className="relative w-full max-w-5xl mb-10">
        <img
          src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80"
          alt="Peaceful Indian village landscape with sunrise and nature"
          className="rounded-3xl shadow-2xl w-full h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-3xl flex items-end justify-center pb-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg">
            🌾 VillageConnect
          </h1>
        </div>
      </div>

      {/* 💬 Intro Text */}
      <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-10 leading-relaxed">
        “A bridge between rural hearts and digital horizons.” <br />
        Celebrate your land, your people, and your stories — share your journey
        with the world through <strong>VillageConnect</strong>.
      </p>

      {/* 🚀 Action Buttons */}
      <div className="flex gap-5 flex-wrap justify-center">
        <Link
          href="/upload"
          className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition duration-300"
        >
          📤 Upload Video
        </Link>

        <Link
          href="/my-videos"
          className="bg-yellow-500 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-yellow-600 transition duration-300"
        >
          🎥 My Videos
        </Link>

        <Link
          href="/auth"
          className="bg-sky-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:bg-sky-700 transition duration-300"
        >
          🔐 Login / Sign Up
        </Link>
      </div>

      {/* 🌿 Footer */}
      <footer className="mt-14 text-gray-500 text-sm">
        🌱 Built with love for rural innovation • © {new Date().getFullYear()}{" "}
        VillageConnect
      </footer>

      {/* 🤖 Floating AI Agent */}
      <AIAgent />
    </main>
  );
}
