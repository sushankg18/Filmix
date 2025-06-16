import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ Initialize genAI instance with your API key
const genAI = new GoogleGenerativeAI(process.env.genvai_key);

export const extractMovieInfo = async (userInput) => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
You are a smart movie assistant.

From the user input below, extract the following information in strict JSON format only (no explanation, no code blocks):
- Genre (if mentioned)
- Actor/Actress name (if mentioned)
- Year (if a specific year is mentioned)

Return in this format:
{
  "genre": "<genre or null>",
  "actor": "<actor or null>",
  "year": <year or null>
}

User Input: """${userInput}"""
`;

  const delay = (ms) => new Promise((res) => setTimeout(res, ms));

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text(); 
      console.log("AI Raw Response:", text);

      const cleaned = text.replace(/```json|```/g, "").trim();

      const data = JSON.parse(cleaned);
      return {
        genre: data.genre || null,
        actor: data.actor || null,
        year: data.year || null,
      };
    } catch (err) {
      console.error(`Attempt ${attempt}:`, err.message);
      if (attempt === 3) throw new Error("AI Suggestion failed after multiple attempts.");
      await delay(3000); 
    }
  }
};
