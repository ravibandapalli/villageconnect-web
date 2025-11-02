"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ProfileIcon() {
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    async function fetchAvatar() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsVisible(true);
        const { data } = await supabase
          .from("profiles")
          .select("avatar_url")
          .eq("id", user.id)
          .single();
        if (data?.avatar_url) setAvatarUrl(data.avatar_url);
      } else {
        setIsVisible(false);
      }
    }
    fetchAvatar();
  }, []);

  if (!isVisible) return null; // Hide icon on login/landing pages

  return (
    <button
      onClick={() => router.push("/profile")}
      className="absolute top-4 right-4 border-2 border-green-400 rounded-full shadow-md hover:scale-105 transition z-50 bg-white"
      title="My Profile"
    >
      <img
        src={avatarUrl || "https://i.imgur.com/8Km9tLL.png"}
        alt="Profile"
        className="w-10 h-10 rounded-full"
      />
    </button>
  );
}
