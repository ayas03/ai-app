import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function fetchAndExtractPdfText(fileUrl: string) {
  console.log("Starting PDF extraction from URL:", fileUrl);

  const response = await fetch(fileUrl);
  if (!response.ok) {
    console.error("Failed to fetch PDF:", response.status, response.statusText);
    throw new Error(
      `Failed to fetch PDF: ${response.status} ${response.statusText}`
    );
  }
  console.log("PDF fetched successfully");

  const blob = await response.blob();
  console.log("PDF converted to blob, size:", blob.size);

  const arrayBuffer = await blob.arrayBuffer();
  console.log("Blob converted to ArrayBuffer, size:", arrayBuffer.byteLength);

  console.log("Initializing PDFLoader...");
  const loader = await new PDFLoader(new Blob([arrayBuffer]));

  console.log("Loading PDF content...");
  const docs = await loader.load();
  console.log("PDF loaded successfully, number of pages:", docs.length);

  const text = docs.map((doc) => doc.pageContent).join("\n");
  console.log("PDF text extracted, length:", text.length);
  console.log("First 500 characters:", text.substring(0, 500));

  return text;
}
