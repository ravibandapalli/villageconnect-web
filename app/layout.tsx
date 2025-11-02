import type { Metadata } from "next";
import "./globals.css";
import DebugConsole from "./components/DebugConsole";
import ProfileIcon from "./components/ProfileIcon"; // ✅ Add this import

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
        {/* ✅ Global profile icon visible on all pages */}
        <ProfileIcon />

        {children}

        {/* Optional debug console */}
        <DebugConsole />
      </body>
    </html>
  );
}
