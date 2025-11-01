"use client";
import { useState } from "react";

export default function DebugConsole() {
  const [logs, setLogs] = useState<string[]>([]);
  const [visible, setVisible] = useState(false);

  function addLog(msg: any) {
    const text =
      typeof msg === "object" ? JSON.stringify(msg, null, 2) : String(msg);
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${text}`]);
    console.log(msg);
  }

  // make global function for logging
  if (typeof window !== "undefined") {
    // @ts-ignore
    window.vcLog = addLog;
  }

  return (
    <>
      {/* toggle button */}
      <button
        onClick={() => setVisible(!visible)}
        className="fixed bottom-3 right-3 z-50 bg-gray-800 text-white rounded-full p-3 text-xs shadow-lg"
      >
        {visible ? "×" : "🐞"}
      </button>

      {/* debug window */}
      {visible && (
        <div className="fixed bottom-12 right-3 w-72 max-h-96 overflow-auto bg-black text-green-300 text-xs p-2 rounded-xl shadow-lg z-50">
          <div className="flex justify-between mb-1">
            <span className="font-bold">Debug Console</span>
            <button onClick={() => setLogs([])} className="text-red-400">
              Clear
            </button>
          </div>
          {logs.length === 0 ? (
            <div className="text-gray-400">No logs yet...</div>
          ) : (
            logs.map((l, i) => <pre key={i}>{l}</pre>)
          )}
        </div>
      )}
    </>
  );
}
