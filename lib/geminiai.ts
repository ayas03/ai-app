import { GoogleGenerativeAI } from "@google/generative-ai";
import { SUMMARY_SYSTEM_PROMPT } from "../utils/prompts";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const generateSummaryFromGemini = async (pdfText: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro-002",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });

    // ✅ Correctly format the prompt using a template literal
    const prompt = ` ${SUMMARY_SYSTEM_PROMPT} \n\n Transform this document into an engaging, easy-to-read summary with contextually relevant emojis:\n\n ${pdfText}`;

    // ✅ Gemini API expects "contents" array
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // ✅ Extract response correctly
    const response = await result.response;
    const textResponse = response?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResponse) {
      throw new Error("No valid summary generated from Gemini API");
    }

    return textResponse;
  } catch (error: any) {
    console.error("Gemini API error:", error);
    if (error?.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    throw error;
  }
};
