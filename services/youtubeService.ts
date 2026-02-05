
import { GoogleGenAI, Type } from "@google/genai";

export interface YouTubeResult {
  id: string;
  title: string;
  author: string;
  duration: number;
  thumbnail: string;
  viewCount: string;
  publishedTime: string;
}

export const searchYouTube = async (query: string): Promise<YouTubeResult[]> => {
  try {
    // Initialize GoogleGenAI inside the function to ensure the correct API key is used.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Simulate a YouTube search response for the query: "${query}". Return a JSON array of 5 highly relevant music/video results.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              title: { type: Type.STRING },
              author: { type: Type.STRING },
              duration: { type: Type.NUMBER, description: "seconds" },
              thumbnail: { type: Type.STRING },
              viewCount: { type: Type.STRING },
              publishedTime: { type: Type.STRING }
            },
            required: ["id", "title", "author", "duration", "thumbnail"]
          }
        }
      }
    });

    // Directly access the text property of the response.
    return JSON.parse(response.text);
  } catch (error) {
    console.error("YouTube Search Simulation Error:", error);
    return [];
  }
};

export const extractAudioMetadata = async (videoId: string) => {
  try {
    // Initialize GoogleGenAI inside the function.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Simulate high-fidelity audio metadata extraction for YouTube video ID: ${videoId}. Provide technical details.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            artist: { type: Type.STRING },
            album: { type: Type.STRING },
            bitrate: { type: Type.STRING },
            sampleRate: { type: Type.STRING },
            fileSizeMb: { type: Type.NUMBER }
          },
          required: ["title", "artist", "bitrate"]
        }
      }
    });
    // Access text property directly.
    return JSON.parse(response.text);
  } catch (err) {
    return null;
  }
};
