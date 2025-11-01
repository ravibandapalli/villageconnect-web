"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  async function handleUpload() {
    setMessage("");
    if (!file) return setMessage("Please select a file.");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setMessage("Please log in first.");

    const filePath = `${user.id}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from("videos")
      .upload(filePath, file);

    if (uploadError) return setMessage("Upload failed: " + uploadError.message);

    const { data: urlData } = supabase.storage
      .from("videos")
      .getPublicUrl(filePath);

    const { error: insertError } = await supabase.from("videos").insert({
      user_id: user.id,
      title,
      video_url: urlData.publicUrl,
    });

    if (insertError) return setMessage("DB error: " + insertError.message);

    setMessage("✅ Upload successful!");
    setTitle("");
    setFile(null);
    router.push("/my-videos");
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-emerald-100 p-6 relative overflow-hidden">

      {/* Decorative Sun Glow */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-amber-100/80 to-transparent animate-pulse"></div>

      {/* Page Content */}
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md relative z-10 border border-green-100">
        <h1 className="text-3xl font-extrabold text-green-700 mb-5 text-center">
          🌿 Upload Your Village Story
        </h1>
        <p className="text-gray-600 text-sm text-center mb-6">
          Share your village life moments — let your stories inspire others.
        </p>

        <input
          type="text"
          placeholder="Enter video title"
          className="border border-green-200 p-3 mb-4 w-full rounded-xl focus:ring-2 focus:ring-green-400 outline-none"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="file"
          accept="video/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mb-4 w-full"
        />

        <button
          onClick={handleUpload}
          className="bg-green-600 text-white w-full py-3 rounded-xl font-semibold shadow-md hover:bg-green-700 transition"
        >
          🌾 Upload Video
        </button>

        {message && (
          <p className="mt-5 text-center text-green-800 font-medium whitespace-pre-line">
            {message}
          </p>
        )}
      </div>

      {/* Floating Leaves */}
      <div className="absolute bottom-0 w-full flex justify-around opacity-30 animate-bounce">
        <span className="text-green-500 text-3xl">🍃</span>
        <span className="text-green-400 text-2xl">🍂</span>
        <span className="text-green-500 text-3xl">🌿</span>
      </div>
    </main>
  );
}
