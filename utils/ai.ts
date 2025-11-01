// utils/ai.ts
export async function callAI(prompt: string) {
  try {
    const res = await fetch(process.env.NEXT_PUBLIC_AI_FUNCTION_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) throw new Error("AI request failed");

    const data = await res.json();
    return data.result; // Supabase function should return { result: string }
  } catch (err) {
    console.error(err);
    throw err;
  }
}
