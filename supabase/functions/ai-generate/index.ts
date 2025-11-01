// ai-generate Edge Function (Supabase + OpenAI)
import OpenAI from "https://esm.sh/openai@4.47.1";

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { prompt_type, language = "en", context = {} } = body;

    const openaiApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI key not set" }),
        { status: 500 },
      );
    }

    const client = new OpenAI({ apiKey: openaiApiKey });

    // Build dynamic prompt
    let userPrompt = "";
    if (prompt_type === "travel") {
      userPrompt = `You are a concise travel guide. In ${language}, write an 80–120 word overview for ${
        context.village_name || "this village"
      }, including one travel tip and one local food recommendation.`;
    } else if (prompt_type === "business_desc") {
      userPrompt = `Write a short description (40–80 words) in ${language} for a business named "${context.business_name}" located in ${
        context.village_name || "the village"
      }."`;
    } else {
      userPrompt = `Write a short friendly note about ${
        context.village_name || "this place"
      } in ${language}.`;
    }

    const resp = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful local travel assistant." },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 400,
      temperature: 0.7,
    });

    const resultText = resp.choices?.[0]?.message?.content ?? "";
    return new Response(
      JSON.stringify({ result: resultText }),
      { headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: String(err) }),
      { status: 500 },
    );
  }
});
