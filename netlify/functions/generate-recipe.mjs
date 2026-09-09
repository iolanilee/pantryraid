import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export default async (req) => {

  try {

    // Only allow POST requests
    if (req.method !== "POST") {

      return new Response(
        JSON.stringify({
          error: "Method not allowed"
        }),
        {
          status: 405,
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

    }


    // Get the information sent from script.js
    const {
      vibe,
      flavor,
      effort,
      hunger,
      ingredients
    } = await req.json();


    // GEMINI PROMPT HERE
    const prompt = `
You are a fun, clever recipe creator for a website called
"Pantry Raid: Girl Dinner Meal Generator."

Create ONE realistic recipe based on the user's information.

USER VIBE:
${vibe}

FLAVOR:
${flavor}

EFFORT LEVEL:
${effort}

HUNGER LEVEL:
${hunger}

INGREDIENTS THE USER HAS:
${ingredients.join(", ")}

IMPORTANT RULES:

- Prioritize the ingredients the user actually has.
- Do not require unusual ingredients.
- The recipe should be realistic and actually cookable.
- Match the requested effort level.
- Match the requested flavor.
- Match the user's hunger level.
- Keep the personality playful, simple and concise.
- The recipe should still be useful and clear.
- If an ingredient is not appropriate for the recipe, simply don't use it.
- Give clear, numbered cooking instructions.
- Return 4 to 7 cooking steps.
- Use recipes from the internet.

Return ONLY valid JSON in this exact format:

{
  "title": "Recipe name",
  "time": "15 MIN",
  "difficulty": "★★ EASY",
  "flavor": "🍓 SWEET",
  "ingredients": [
    "ingredient 1",
    "ingredient 2",
    "ingredient 3"
  ],
  "instructions": [
    "First cooking step.",
    "Second cooking step.",
    "Third cooking step.",
    "Fourth cooking step."
  ]
}
`;


    // Ask Gemini to create the recipe
    const response =
      await ai.models.generateContent({

        model: "gemini-3.7-flash",

        contents: prompt

      });


    // Get Gemini's response
    let text = response.text;


    // Remove markdown code fences if Gemini adds them
    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();


    // Turn Gemini's JSON into a JavaScript object
    const recipe = JSON.parse(text);


    // Send recipe back to the website
    return new Response(
      JSON.stringify(recipe),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );


  } catch (error) {

    console.error(
      "Gemini error:",
      error
    );


    return new Response(
      JSON.stringify({
        error:
          "Something went wrong generating the recipe."
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

  }

};
