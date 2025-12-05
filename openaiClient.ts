// openaiClient.ts
import { UserData, NutritionPlan } from "./types";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.warn("VITE_OPENAI_API_KEY is missing");
}

export async function generateNutritionPlan(
  userData: UserData
): Promise<NutritionPlan> {
  const prompt = `
You are ShapeMate's nutrition engine.

Based on the following user profile, calculate:
- maintenanceCalories: realistic daily maintenance kcal
- targetCalories: kcal aligned with the user's goal (Lose weight, Maintain, Build muscle)
- proteinGrams: grams per day
- carbsGrams: grams per day
- fatsGrams: grams per day

User profile (JSON):
${JSON.stringify(userData, null, 2)}

Rules:
- Convert height and weight units correctly.
- Use standard sports nutrition formulas, like Mifflin-St Jeor or similar.
- Produce realistic values for a normal person, not extreme bodybuilders.
- Make sure macros sum up plausibly to the calorie target.

Return ONLY valid JSON in exactly this shape, no explanation, no markdown, no comments:

{
  "maintenanceCalories": number,
  "targetCalories": number,
  "proteinGrams": number,
  "carbsGrams": number,
  "fatsGrams": number
}
`.trim();

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-5.1",
      input: prompt,
      max_output_tokens: 500,
      text: {
        format: {
          type: "json"
        }
      }
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("OpenAI error:", err);
    throw new Error("Failed to generate nutrition plan");
  }

  const json = await response.json();

  // Safely extract text from Responses API
  let text: string | undefined;

  try {
    const firstOutput = json.output?.[0];
    const firstContent = firstOutput?.content?.find(
      (c: any) => c.type === "output_text"
    );
    text = firstContent?.text;
  } catch (e) {
    console.error("Failed to parse OpenAI response structure:", e, json);
  }

  if (!text || typeof text !== "string" || text.trim().length < 3) {
    console.error("OpenAI returned invalid content:", text, json);
    throw new Error("OpenAI returned no usable content");
  }

  // JSON cleaning, falls das Modell doch ```json ... ``` erzeugt
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) {
    console.error("Could not extract JSON:", cleaned);
    throw new Error("Invalid JSON structure");
  }

  const parsed = JSON.parse(match[0]);

  return {
    maintenanceCalories: Number(parsed.maintenanceCalories),
    targetCalories: Number(parsed.targetCalories),
    proteinGrams: Number(parsed.proteinGrams),
    carbsGrams: Number(parsed.carbsGrams),
    fatsGrams: Number(parsed.fatsGrams),
  };
}
