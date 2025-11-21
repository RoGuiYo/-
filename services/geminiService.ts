import { GoogleGenAI, Type } from "@google/genai";
import { GeminiResponse, Language } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const processTextToCard = async (inputText: string, language: Language): Promise<GeminiResponse> => {
  if (!inputText.trim()) {
    throw new Error("Input text is empty");
  }

  const langInstruction = language === 'zh' 
    ? "Output Language: Chinese (Simplified). Ensure the Title and Tags are in Chinese." 
    : "Output Language: English. Ensure the Title and Tags are in English.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `You are an expert graphical editor and content curator. 
      Analyze the following text input. Your goal is to format it for a beautiful "Knowledge Card" (social media share card).
      
      Input Text: "${inputText}"
      
      ${langInstruction}
      
      Tasks:
      1. Title: Extract a short, catchy title (max 10-15 characters). 
      2. RefinedContent: Clean up the text. Fix punctuation. Ensure paragraphs are separated by single newlines.
         IMPORTANT: Do NOT summarize. Do NOT truncate. Use the full original text provided.
         Preserve the original meaning and length.
      3. Tags: Extract 3 relevant keywords/hashtags.
      4. MoodColor: Suggest a Hex color code that matches the emotion of the text (e.g., Soft Blue for calm, Red for urgent, Green for nature).
      5. AuthorSuggestion: If there is an author mentioned, extract it. If not, suggest "Anonymous" or leave empty.
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            refinedContent: { type: Type.STRING },
            tags: { 
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            moodColor: { type: Type.STRING },
            authorSuggestion: { type: Type.STRING }
          },
          required: ["title", "refinedContent", "tags", "moodColor"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text) as GeminiResponse;
      
      // Critical Fix: Replace literal \n sequences (which LLMs often output in JSON) with actual newlines
      if (data.refinedContent) {
        data.refinedContent = data.refinedContent.replace(/\\n/g, '\n');
      }
      
      return data;
    }
    throw new Error("No response from AI");

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback if API fails
    return {
      title: language === 'zh' ? "未命名笔记" : "Untitled Note",
      refinedContent: inputText,
      tags: ["Ideas", "Note"],
      moodColor: "#3b82f6",
      authorSuggestion: "Me"
    };
  }
};