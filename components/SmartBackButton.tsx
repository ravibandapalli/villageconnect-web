"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function SmartBackButton({ fallback = "/" }) {
  const router = useRouter();
  const [hasHistory, setHasHistory] = useState(false);

  // Detect if user has a navigation history
  useEffect(() => {
    setHasHistory(window.history.length > 1);
  }, []);

  function handleBack() {
    if (hasHistory) {
      router.back();
    } else {
      router.push(fallback);
    }
  }

  return (
    <button
      onClick={handleBack}
      className="mt-4 bg-gradient-to-r from-green-500 to-lime-500 text-white font-semibold px-5 py-2 rounded-lg shadow-md hover:opacity-90 transition"
    >
      ← Back
    </button>
  );
}
