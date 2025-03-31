"use server";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";

export async function generatePdfSummary(
  uploadResponse: [
    {
      serverData: {
        userId: string;
        file: {
          url: string;
          name: string;
        };
      };
    }
  ]
) {
  if (!uploadResponse) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  const {
    serverData: {
      userId,
      file: { url: pdfUrl, name: fileName },
    },
  } = uploadResponse[0];

  if (!pdfUrl) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  try {
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    console.log("PDF Text length:", pdfText.length);
    console.log("First 500 chars of PDF:", pdfText.substring(0, 500));

    let summary;
    try {
      summary = await generateSummaryFromGemini(pdfText);
      console.log("Generated summary:", summary);
    } catch (err) {
      console.error("Error generating summary:", err);
      return {
        success: false,
        message: "Failed to generate summary",
        data: null,
      };
    }

    if (!summary) {
      return {
        success: false,
        message: "Failed to generate summary",
        data: null,
      };
    }

    return {
      success: true,
      message: "Summary generated successfully",
      data: { summary },
    };
  } catch (err) {
    console.error("Error processing PDF:", err);
    return {
      success: false,
      message: "File upload failed.",
      data: null,
    };
  }
}
