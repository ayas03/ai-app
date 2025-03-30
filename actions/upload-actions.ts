"use server";
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
  console.log("Starting PDF processing with response:", uploadResponse);

  if (!uploadResponse) {
    console.log("No upload response received");
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

  console.log("Processing PDF:", { pdfUrl, fileName });

  if (!pdfUrl) {
    console.log("No PDF URL found in response");
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  try {
    console.log("Fetching PDF text...");
    const pdfText = await fetchAndExtractPdfText(pdfUrl);
    console.log("PDF Text length:", pdfText.length);
    console.log("First 500 chars of PDF:", pdfText.substring(0, 500));

    let summary;
    try {
      console.log("Generating summary with OpenAI...");
      summary = await generateSummaryFromOpenAI(pdfText);
      console.log("Summary generated:", summary);
    } catch (err) {
      console.error("Error generating summary:", err);
      return {
        success: false,
        message: "Failed to generate summary",
        data: null,
      };
    }

    if (!summary) {
      console.log("No summary generated");
      return {
        success: false,
        message: "Failed to generate summary",
        data: null,
      };
    }

    return {
      success: true,
      message: "Summary generated successfully",
      data: summary,
    };
  } catch (err) {
    console.error("Error processing PDF:", err);
    return {
      success: false,
      message: "Failed to process PDF",
      data: null,
    };
  }
}
