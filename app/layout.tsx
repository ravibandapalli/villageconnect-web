import type { Metadata } from "next";
import "./globals.css";
import ProfileIcon from "./components/ProfileIcon";
import DebugConsole from "./components/DebugConsole"; // ✅ Keep import, auto-hide in production

export const metadata: Metadata = {
  title: "VillageConnect",
  description: "Connecting communities intelligently.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Load Google Fonts manually (no next/font) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>

      <body className="relative">
        {/* ✅ Profile icon visible globally */}
        <ProfileIcon />

        {children}

        {/* 🧩 Debug console appears only in development */}
        {process.env.NODE_ENV !== "production" && <DebugConsole />}
      </body>
    </html>
  );
}
