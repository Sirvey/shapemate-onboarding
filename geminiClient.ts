// geminiClient.ts
import { UserData, NutritionPlan } from './types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('VITE_GEMINI_API_KEY is not set');
}

export async function generateNutritionPlan(userData: UserData): Promise<NutritionPlan> {
  const prompt = `
You are ShapeMate's nutrition engine.

Based on the following user profile, calculate:
- maintenanceCalories: realistic daily maintenance kcal
- targetCalories: kcal aligned with the user's goal (Lose weight, Maintain, Build muscle)
- proteinGrams: grams per day
- carbsGrams: grams per day
- fatsGrams: grams per day

User data is collected from an onboarding flow.
Fields:
- gender: ${userData.gender}
- birthDate: ${userData.birthDate}
- height: ${userData.height.value} ${userData.height.unit}
- weight: ${userData.weight.value} ${userData.weight.unit}
- workoutFrequency: ${userData.workoutFrequency}
- goal: ${userData.goal}
- diet: ${userData.diet}
- obstacles: ${userData.obstacles.join(', ')}
- accomplishment: ${userData.accomplishment}
- caloriesBack: ${userData.caloriesBack}
- rollover: ${userData.rollover}

Important.
- Convert units correctly if needed.
- Use standard sports nutrition formulas such as Mifflin-St Jeor or similar.
- Make realistic values for an everyday person.

Return ONLY valid JSON in exactly this shape, no explanation, no markdown, no comments:

{
  "maintenanceCalories": number,
  "targetCalories": number,
  "proteinGrams": number,
  "carbsGrams": number,
  "fatsGrams": number
}
  `.trim();

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  };

  const response = await fetch(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GEMINI_API_KEY as string,
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gemini request failed (${response.status}): ${errorText}`);
  }

  const json = await response.json();

  const text =
    json?.candidates?.[0]?.content?.parts?.[0]?.text ??
    json?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Gemini returned no text content');
  }

  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();

  const parsed = JSON.parse(cleaned);

  return {
    maintenanceCalories: Number(parsed.maintenanceCalories),
    targetCalories: Number(parsed.targetCalories),
    proteinGrams: Number(parsed.proteinGrams),
    carbsGrams: Number(parsed.carbsGrams),
    fatsGrams: Number(parsed.fatsGrams),
  };
}
