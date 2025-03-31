"use server";
import { getDbConnection } from "@/lib/db";
import { generateSummaryFromGemini } from "@/lib/geminiai";
import { fetchAndExtractPdfText } from "@/lib/langchain";
import { generateSummaryFromOpenAI } from "@/lib/openai";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { auth } from "@clerk/nextjs/server";

interface PdfSummaryType {
  userId?: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}

export async function generatePdfSummary(
  uploadResponse: [
    {
      serverData: {
        userId: string;
        file: {
          ufsUrl?: string;
          url?: string;
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
      file: { ufsUrl, url, name: fileName },
    },
  } = uploadResponse[0];

  const pdfUrl = ufsUrl || url; // Use new UploadThing API field first

  if (!pdfUrl) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  try {
    console.log("Fetching PDF text from:", pdfUrl);
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

    const formattedFileName = formatFileNameAsTitle(fileName);

    return {
      success: true,
      message: "Summary generated successfully",
      data: { title: formattedFileName, summary },
    };
  } catch (err) {
    console.error("Error processing PDF:", err);
    return {
      success: false,
      message: "File processing failed.",
      data: null,
    };
  }
}

export async function storePdfSummaryAction({
  fileUrl,
  summary,
  title,
  fileName,
}: PdfSummaryType) {
  console.log("Starting storePdfSummaryAction with:", {
    fileUrl,
    title,
    fileName,
  });

  try {
    const authUser = await auth();
    console.log("Auth response:", authUser);
    if (!authUser || !authUser.userId) {
      console.error("No userId found in auth response", authUser);
      return {
        success: false,
        message: "User not authenticated.",
      };
    }
    const userId = authUser.userId;

    console.log("Attempting to save PDF summary for user:", userId);
    const insertResult = await savePdfSummary({
      userId,
      fileUrl,
      summary,
      title,
      fileName,
    });

    console.log("Database insert result:", insertResult);

    return {
      success: true,
      message: "PDF summary stored successfully",
    };
  } catch (error) {
    console.error("Error in storePdfSummaryAction:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error storing PDF summary",
    };
  }
}

async function savePdfSummary({
  userId,
  fileUrl,
  summary,
  title,
  fileName,
}: {
  userId: string;
  fileUrl: string;
  summary: string;
  title: string;
  fileName: string;
}) {
  console.log("Starting savePdfSummary with:", {
    userId,
    fileUrl,
    title,
    fileName,
    summary: summary.substring(0, 100) + "...", // Log just the start of the summary
  });

  try {
    const sql = await getDbConnection();
    console.log("Database connection established.");

    console.log(`Executing SQL Insert:
      user_id: ${userId}
      original_file_url: ${fileUrl}
      summary_text: ${summary.substring(0, 100)}...
      title: ${title}
      file_name: ${fileName}
      status: completed
    `);

    const result = await sql`
      INSERT INTO pdf_summaries (
        user_id,
        original_file_url,
        summary_text,
        title,
        file_name,
        status
      ) VALUES (
        ${userId},
        ${fileUrl},
        ${summary},
        ${title},
        ${fileName},
        'completed'
      ) RETURNING id;
    `;

    console.log("SQL insert successful:", result);
    return result;
  } catch (error) {
    console.error("Database insert error:", error);
    throw error;
  }
}
