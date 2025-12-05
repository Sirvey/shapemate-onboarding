// openaiClient.ts
import { UserData, NutritionPlan } from "./types";

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

export async function generateNutritionPlan(
  userData: UserData
): Promise<NutritionPlan> {
  if (!OPENAI_API_KEY) {
    console.error("Missing VITE_OPENAI_API_KEY");
    throw new Error("OpenAI API key missing");
  }

  const prompt = `
You are ShapeMate's nutrition engine.

Based on the following user profile, calculate:
- maintenanceCalories
- targetCalories
- proteinGrams
- carbsGrams
- fatsGrams

User profile:
${JSON.stringify(userData, null, 2)}

Return ONLY valid JSON. No markdown. No comments.
`;

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

      // THIS is the correct OpenAI spec
      text_format: {
        type: "json_object"
      }
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("OpenAI error:", err);
    throw new Error("Failed to generate nutrition plan");
  }

  const json = await response.json();

  const raw = json.output_text;

  if (!raw) {
    console.error("NO output_text returned:", json);
    throw new Error("Invalid AI response");
  }

  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.error("JSON parse error:", raw);
    throw new Error("AI returned invalid JSON");
  }

  return {
    maintenanceCalories: Number(parsed.maintenanceCalories),
    targetCalories: Number(parsed.targetCalories),
    proteinGrams: Number(parsed.proteinGrams),
    carbsGrams: Number(parsed.carbsGrams),
    fatsGrams: Number(parsed.fatsGrams),
  };
}
