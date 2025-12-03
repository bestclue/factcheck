import { GoogleGenAI } from "@google/genai";

// Initialize Gemini Client
// NOTE: Process.env.API_KEY is handled by the runtime environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Validates the user's answer using Gemini.
 * Checks if they identified the "27%" or "Fake Number" concept.
 */
export const validateUserAnswer = async (userComment: string): Promise<boolean> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `
                Context: A user is watching a training video about AI hallucinations. The video contains a fake statistic: "Market growth is 27%".
                The user writes a comment. Determine if the user correctly identified the number "27%" or mentioned that the number is wrong/fake.
                
                User Comment: "${userComment}"
                
                Return JSON: { "isCorrect": boolean }
            `,
            config: {
                responseMimeType: "application/json"
            }
        });

        const text = response.text;
        if (!text) return false;
        const result = JSON.parse(text);
        return result.isCorrect;
    } catch (e) {
        console.error("Validation failed", e);
        // Fallback: simple text match
        return userComment.includes("27");
    }
}