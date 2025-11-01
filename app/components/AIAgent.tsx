"use client";

import React, { useState } from "react";
import { MessageCircle, X } from "lucide-react";

const AIAgent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "👋 Hi! I’m your AI Village Agent. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        setMessages([
          ...newMessages,
          { role: "assistant", content: "⚠️ No AI response received from the server." },
        ]);
        setLoading(false);
        return;
      }

      const data = await response.json();
      const aiText = data.result || "🤖 Sorry, I couldn’t process that.";

      setMessages([...newMessages, { role: "assistant", content: aiText }]);
    } catch (error) {
      console.error("AI Agent error:", error);
      setMessages([
        ...newMessages,
        { role: "assistant", content: "❌ Connection error. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-xl hover:scale-110 transition"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl border border-green-200 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center bg-green-600 text-white p-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl animate-bounce">🤖</span>
              <h3 className="font-semibold">AI Village Agent</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-xl text-sm ${
                  msg.role === "user"
                    ? "bg-green-100 text-right ml-10"
                    : "bg-gray-100 text-left mr-10"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="text-gray-400 text-sm italic text-left mr-10">AI is typing...</div>
            )}
          </div>

          <div className="flex border-t p-2 bg-gray-50">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              className="flex-1 outline-none border border-gray-300 rounded-lg px-3 py-2 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAgent;
