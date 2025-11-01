import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("❌ Missing OpenAI API key");
      return NextResponse.json({ error: "Missing API key" }, { status: 500 });
    }

    if (!prompt || typeof prompt !== "string") {
      console.error("❌ Invalid or missing prompt");
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    console.log("📤 Sending prompt to OpenAI:", prompt);

    const aiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini", // ✅ lightweight, reliable
        messages: [
          { role: "system", content: "You are a creative assistant that writes short, catchy video descriptions." },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
      }),
    });

    const data = await aiResponse.json();

    // ✅ Log everything to inspect if OpenAI returned any content
    console.log("🧩 OpenAI raw response:", JSON.stringify(data, null, 2));

    if (!aiResponse.ok) {
      return NextResponse.json(
        { error: data.error?.message || "OpenAI API request failed" },
        { status: aiResponse.status }
      );
    }

    const result = data?.choices?.[0]?.message?.content?.trim();

    if (!result) {
      return NextResponse.json({ result: "⚠️ OpenAI returned an empty response." });
    }

    return NextResponse.json({ result });
  } catch (err) {
    console.error("💥 AI route error:", err);
    return NextResponse.json({ error: "AI request failed" }, { status: 500 });
  }
}
