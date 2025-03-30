"use client";
import { z } from "zod";
import { toast } from "sonner";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { generatePdfSummary } from "@/actions/upload-actions";

const formSchema = z.object({
  file: z
    .instanceof(File, { message: "File is required" })
    .refine((file) => file.size <= 24 * 1024 * 1024, {
      message: "File size must be less than 20MB",
    })
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a PDF"
    ),
});

export default function UploadForm() {
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      toast.success("File uploaded successfully!");
    },
    onUploadError: (err) => {
      console.log("error occurred while uploading", err);
      toast.error(err.message);
    },
    onUploadBegin: () => {
      toast.info("Starting upload...");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submitted");
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    // fields validation
    const validatedFields = formSchema.safeParse({ file });

    if (!validatedFields.success) {
      toast.error(
        validatedFields.error.flatten().fieldErrors.file?.[0] ?? "Invalid File"
      );
      return;
    }

    toast.info("Uploading your file...", {
      description: "Please wait while we upload your file",
    });

    // file upload
    const uploadRes = await startUpload([file]);
    console.log("Upload response:", uploadRes);

    if (!uploadRes?.[0]) {
      toast.error("Failed to upload file");
      return;
    }

    toast.info("Processing your file...", {
      description: "This may take a few seconds.. Our AI is working on it",
    });

    // Transform the upload response to match expected format
    const formattedResponse = [
      {
        serverData: {
          userId: uploadRes[0].serverData.userId,
          file: {
            url: uploadRes[0].url,
            name: uploadRes[0].name,
          },
        },
      },
    ] as [
      { serverData: { userId: string; file: { url: string; name: string } } }
    ];

    try {
      console.log("Formatted response:", formattedResponse);
      const summary = await generatePdfSummary(formattedResponse);
      console.log("PDF Summary result:", summary);

      if (summary.success) {
        toast.success("Summary generated successfully!");
      } else {
        toast.error(summary.message || "Failed to generate summary");
      }
    } catch (error: any) {
      console.error("Error processing PDF:", error);
      if (
        error.message?.includes("insufficient_quota") ||
        error.message?.includes("exceeded your current quota")
      ) {
        toast.error(
          "OpenAI API quota exceeded. Please try again later or contact support."
        );
      } else {
        toast.error("Failed to process PDF. Please try again later.");
      }
    }
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
}
