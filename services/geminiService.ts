
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { AISuggestion } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error("Gemini API Key not found. Please set the API_KEY environment variable.");
  // Potentially throw an error or disable AI features if running in an environment where this is critical
}

const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" }); // Provide a fallback for type safety if API_KEY could be undefined at runtime
const model = "gemini-2.5-flash-preview-04-17"; // As per latest guidance

export const geminiService = {
  draftContent: async (prompt: string): Promise<AISuggestion> => {
    if (!API_KEY) return { text: "API Key not configured. AI drafting disabled." };
    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: prompt,
      });
      return { text: response.text };
    } catch (error) {
      console.error("Error drafting content with Gemini:", error);
      return { text: `Error from AI: ${error instanceof Error ? error.message : String(error)}` };
    }
  },

  searchWithGemini: async (query: string): Promise<AISuggestion> => {
    if (!API_KEY) return { text: "API Key not configured. AI search disabled." };
    try {
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      
      const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
      const sources = groundingMetadata?.groundingChunks || [];
      
      return { 
        text: response.text,
        sources: sources.map(chunk => chunk) // Assuming chunk structure matches { web: { uri, title } }
      };

    } catch (error) {
      console.error("Error searching with Gemini:", error);
      // Check if the error is due to invalid config for googleSearch (e.g. if responseMimeType was set)
      if (error instanceof Error && error.message.includes("response_mime_type")) {
         return { text: `Configuration error with AI Search: ${error.message}. Ensure responseMimeType is not set when using googleSearch.`};
      }
      return { text: `Error from AI search: ${error instanceof Error ? error.message : String(error)}` };
    }
  },
};
    