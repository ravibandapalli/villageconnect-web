"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import SmartBackButton from "../../components/SmartBackButton";

export default function MyVideos() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiResults, setAIResults] = useState<{ [key: string]: string }>({});
  const [videoToDelete, setVideoToDelete] = useState<any | null>(null);
  const [deleting, setDeleting] = useState(false);

  // 🆕 Edit modal state
  const [videoToEdit, setVideoToEdit] = useState<any | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  // ✅ Fetch videos
  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setVideos([]);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("videos")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!error && data) setVideos(data);
      setLoading(false);
    };
    fetchVideos();
  }, []);

  // ✅ AI Caption/Description
  const handleAI = async (video: any) => {
    try {
      if (!video?.title) {
        setAIResults((prev) => ({
          ...prev,
          [video.id]: "❌ Missing video title — cannot generate AI description.",
        }));
        return;
      }

      setAIResults((prev) => ({
        ...prev,
        [video.id]: "🤖 Generating AI description...",
      }));

      const prompt = `Write a short, engaging description and 3 relevant hashtags for a video titled "${video.title}". Make it suitable for social media sharing.`;

      const response = await fetch("/api/ai-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error("AI API Error:", errorData);
        setAIResults((prev) => ({
          ...prev,
          [video.id]: "⚠️ AI request failed — please try again later.",
        }));
        return;
      }

      const data = await response.json();
      const result =
        data?.result?.trim() || "⚠️ No AI response received from the server.";

      setAIResults((prev) => ({
        ...prev,
        [video.id]: result,
      }));
    } catch (err) {
      console.error("💥 AI request failed:", err);
      setAIResults((prev) => ({
        ...prev,
        [video.id]: "❌ Network or server error during AI request.",
      }));
    }
  };

  // ✅ Delete Video
  const confirmDelete = (video: any) => setVideoToDelete(video);

  const handleDeleteConfirmed = async () => {
    if (!videoToDelete) return;
    setDeleting(true);
    try {
      const filePath = videoToDelete.video_url.split("/").pop();
      if (filePath)
        await supabase.storage.from("videos").remove([filePath]);
      await supabase.from("videos").delete().eq("id", videoToDelete.id);
      setVideos((prev) => prev.filter((v) => v.id !== videoToDelete.id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete video. Please try again.");
    }
    setDeleting(false);
    setVideoToDelete(null);
  };

  // 🆕 Edit Video
  const handleEditClick = (video: any) => {
    setVideoToEdit(video);
    setEditTitle(video.title || "");
    setEditDescription(video.description || "");
  };

  const handleEditSave = async () => {
    if (!videoToEdit) return;
    setSavingEdit(true);
    try {
      const { error } = await supabase
        .from("videos")
        .update({
          title: editTitle,
          description: editDescription,
        })
        .eq("id", videoToEdit.id);

      if (error) throw error;

      setVideos((prev) =>
        prev.map((v) =>
          v.id === videoToEdit.id
            ? { ...v, title: editTitle, description: editDescription }
            : v
        )
      );

      setVideoToEdit(null);
    } catch (err) {
      console.error("Edit save error:", err);
      alert("Failed to update video details. Please try again.");
    }
    setSavingEdit(false);
  };

  // ✅ Loading
  if (loading)
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 via-amber-50 to-emerald-100">
        <p className="text-lg font-semibold text-green-800 animate-pulse">
          Fetching your videos...
        </p>
      </main>
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-emerald-100 py-10 px-5 relative">
      <div className="max-w-5xl mx-auto">
        <SmartBackButton />
        <h1 className="text-3xl font-extrabold text-green-700 mb-8 text-center">
          🌻 My Village Videos
        </h1>

        {videos.length === 0 ? (
          <p className="text-center text-gray-600">
            You haven’t uploaded any videos yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {videos.map((v) => (
              <div
                key={v.id}
                className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-green-100 hover:shadow-2xl transition"
              >
                <video
                  src={v.video_url}
                  controls
                  className="rounded-xl mb-3 w-full aspect-video shadow-md"
                />
                <h2 className="font-semibold text-green-800 mb-1">
                  {v.title}
                </h2>
                <p className="text-xs text-gray-500">
                  {new Date(v.created_at).toLocaleString()}
                </p>

                {/* Buttons */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAI(v)}
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                  >
                    {aiResults[v.id]
                      ? "✅ AI Description Ready"
                      : "AI Description"}
                  </button>

                  <button
                    onClick={() => handleEditClick(v)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                  >
                    ✏️ Edit
                  </button>

                  <button
                    onClick={() => confirmDelete(v)}
                    className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                  >
                    🗑️ Delete
                  </button>
                </div>

                {/* AI Result */}
                {aiResults[v.id] && (
                  <p className="text-sm text-gray-700 mt-2 whitespace-pre-wrap">
                    {aiResults[v.id]}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🌿 Floating icons */}
      <div className="absolute bottom-4 w-full flex justify-around opacity-20 animate-pulse">
        <span className="text-green-500 text-3xl">🌿</span>
        <span className="text-yellow-600 text-3xl">🌻</span>
        <span className="text-green-400 text-3xl">🍃</span>
      </div>

      {/* 🧩 Delete Confirmation Modal */}
      {videoToDelete && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-3 text-center">
            <h2 className="text-xl font-bold text-red-700 mb-2">
              Delete Video?
            </h2>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete{" "}
              <strong>{videoToDelete.title}</strong>?
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setVideoToDelete(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirmed}
                disabled={deleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🆕 Edit Modal */}
      {videoToEdit && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl p-6 shadow-2xl w-full max-w-md mx-3">
            <h2 className="text-xl font-bold text-blue-700 mb-3 text-center">
              ✏️ Edit Video Details
            </h2>

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Title
            </label>
            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 mb-3 focus:ring-2 focus:ring-blue-400"
            />

            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 h-24 mb-4 focus:ring-2 focus:ring-blue-400"
            />

            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setVideoToEdit(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={savingEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                {savingEdit ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
