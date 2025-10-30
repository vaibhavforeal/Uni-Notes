
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

// The SDK can handle a missing API key on initialization, it will fail on the API call.
const ai = new GoogleGenAI({ apiKey: apiKey! });
const model = 'gemini-2.5-flash';

export const runChat = async (prompt: string): Promise<string> => {
  if (!apiKey) {
    return "Error: Gemini API key is not configured. Please set the API_KEY environment variable.";
  }
  try {
    const response = await ai.models.generateContent({
      model: model,
      // FIX: Use `contents` for the user's prompt and `systemInstruction` for the persona/instructions.
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful college assistant. Answer the user's questions clearly and concisely."
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API call failed:", error);
    if (error instanceof Error) {
        return `An error occurred while communicating with the Gemini API: ${error.message}`;
    }
    return "An unknown error occurred while communicating with the Gemini API.";
  }
};
