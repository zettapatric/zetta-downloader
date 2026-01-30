
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMediaUrl = async (url: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this hypothetical media URL: ${url}. Provide metadata if it was a real media resource.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            duration: { type: Type.NUMBER, description: "Seconds" },
            thumbnail: { type: Type.STRING, description: "Placeholder image URL" },
            formatSuggestions: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            isSafe: { type: Type.BOOLEAN }
          },
          required: ["title", "artist", "duration", "isSafe"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return null;
  }
};

export const suggestTags = async (title: string, artist: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 5 music genres or tags for: ${title} by ${artist}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return ["Music", "Uncategorized"];
  }
};
