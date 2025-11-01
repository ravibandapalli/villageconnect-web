"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import SmartBackButton from "../../components/SmartBackButton";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Fetch profile on load
  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (!error && data) {
        setProfile(data);
        setNewName(data.full_name || "");
      }

      setLoading(false);
    }

    fetchProfile();
  }, [router]);

  // ✅ Update profile name
  async function handleUpdate() {
    if (!newName.trim()) return setMessage("Name cannot be empty.");

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: newName })
      .eq("id", profile.id);

    if (error) setMessage("❌ Update failed: " + error.message);
    else {
      setProfile({ ...profile, full_name: newName });
      setEditing(false);
      setMessage("✅ Profile updated successfully!");
    }
  }

  // ✅ Logout
  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/auth");
  }

  if (loading)
    return (
      <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-emerald-100">
        <p className="text-green-800 font-semibold animate-pulse">Loading your profile...</p>
      </main>
    );

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 via-yellow-50 to-emerald-100 p-6 relative overflow-hidden">
      {/* Background sunrise glow */}
      <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-amber-100/70 to-transparent animate-pulse"></div>

      {/* Floating leaves */}
      <div className="absolute bottom-0 w-full flex justify-around opacity-30 animate-bounce">
        <span className="text-green-500 text-3xl">🍃</span>
        <span className="text-green-400 text-2xl">🌿</span>
        <span className="text-yellow-500 text-3xl">🌻</span>
      </div>

      {/* Profile Card */}
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-green-100 relative z-10">
        <h1 className="text-3xl font-extrabold text-green-700 mb-6 text-center">👤 My Profile</h1>

        {profile ? (
          <>
            <div className="text-center mb-6">
              <img
                src={profile.avatar_url || "https://i.imgur.com/8Km9tLL.png"}
                alt="Profile Avatar"
                className="w-24 h-24 rounded-full mx-auto mb-3 border-4 border-green-300 shadow-md"
              />
              {editing ? (
                <>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="border border-green-200 p-2 rounded-lg w-full mb-3"
                  />
                  <button
                    onClick={handleUpdate}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
                  >
                    💾 Save
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setNewName(profile.full_name);
                    }}
                    className="ml-3 bg-gray-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-500 transition"
                  >
                    ❌ Cancel
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold text-green-800">
                    {profile.full_name || "No Name Set"}
                  </h2>
                  <p className="text-gray-600 mt-1">{profile.email}</p>
                  <p className="text-gray-400 text-sm mt-2">
                    Joined: {new Date(profile.created_at).toLocaleDateString()}
                  </p>

                  <button
                    onClick={() => setEditing(true)}
                    className="mt-4 bg-yellow-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-yellow-600 transition"
                  >
                    ✏️ Edit Profile
                  </button>
                </>
              )}
            </div>

            {message && (
              <p className="text-center text-green-800 font-medium mb-4 whitespace-pre-line">
                {message}
              </p>
            )}
            <SmartBackButton fallback="/my-videos" />

            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-3 rounded-xl font-semibold shadow-md hover:bg-red-600 transition"
            >
              🚪 Logout
            </button>
          </>
        ) : (
          <p className="text-gray-600 text-center">No profile data found.</p>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-10 text-gray-500 text-xs text-center">
        🌱 VillageConnect • Connecting hearts, sharing stories
      </footer>
    </main>
  );
}
