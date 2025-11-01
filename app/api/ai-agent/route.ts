import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 500 });
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are an AI assistant in the VillageConnect app. You help users with steps like uploading videos, viewing AI captions, and exploring features.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "⚠️ No AI response received from the server.";
    return NextResponse.json({ result });
  } catch (err) {
    console.error("AI Agent route error:", err);
    return NextResponse.json({ result: "⚠️ AI request failed." });
  }
}
