import { GoogleGenAI } from "@google/genai";

/**
 * Analyzes text content for safety using the Gemini API.
 * It asks the model to classify content as SAFE or UNSAFE based on policies against
 * hate speech, harassment, and violence.
 * 
 * @param {string} text The text to be moderated.
 * @returns {Promise<{isSafe: boolean; reason?: string}>} An object indicating if the content is safe.
 */
export const moderateContent = async (text: string): Promise<{ isSafe: boolean; reason?: string }> => {
  if (!text.trim()) {
    // Empty content is considered safe.
    return { isSafe: true };
  }

  // The API key is sourced from the environment variable `process.env.API_KEY`.
  // If it's not available, moderation is skipped to avoid breaking functionality.
  if (!process.env.API_KEY) {
    console.warn("Gemini API key is not configured in the environment. Moderation is being skipped.");
    return { isSafe: true };
  }


  // Sanitize HTML from policies to check only text content
  const textOnly = text.replace(/<[^>]*>?/gm, ' ');

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `You are a content moderation expert. Your task is to determine if the provided text contains any harmful content, including but not limited to hate speech, harassment, incitement of violence, or explicit material. Respond with only a single word: "SAFE" if the content is acceptable, or "UNSAFE" if it violates these policies. Do not provide any explanation or additional text.`;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: textOnly,
        config: {
            systemInstruction: systemInstruction,
            temperature: 0.0,
        },
    });

    const result = response.text.trim().toUpperCase();

    if (result === 'UNSAFE') {
      return {
        isSafe: false,
        reason: 'Content was flagged as potentially unsafe by our AI moderation system. Please revise and try again.'
      };
    }

    // If the response is anything other than "UNSAFE", consider it safe.
    return { isSafe: true };

  } catch (error) {
    console.error("Gemini API call for moderation failed:", error);
    // If the API call fails (e.g., free tier limit, network error), default to safe to not block the user.
    // In a production app, this might trigger a manual review flag.
    return { isSafe: true };
  }
};