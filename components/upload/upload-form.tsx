"use client";
import { z } from "zod";
import { toast } from "sonner";
import { useRef } from "react";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";
import { generatePdfSummary } from "@/actions/upload-actions";
import { storePdfSummaryAction } from "@/actions/upload-actions";

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
  const formRef = useRef<HTMLFormElement>(null);
  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      toast.success("File uploaded successfully!");
    },
    onUploadError: (err) => {
      console.log("Error occurred while uploading", err);
      toast.error(err.message);
    },
    onUploadBegin: () => {
      toast.info("Starting upload...");
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;

    // Fields validation
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

    try {
      // File upload
      const uploadRes = await startUpload([file]);
      console.log("Upload response:", uploadRes);

      if (!uploadRes?.[0]) {
        toast.error("Failed to upload file");
        return;
      }

      const uploadedFileUrl = uploadRes[0].ufsUrl || uploadRes[0].url;
      console.log("Final file URL:", uploadedFileUrl);

      toast.info("Processing your file...", {
        description: "This may take a few seconds.. Our AI is working on it",
      });

      // Transform the upload response to match expected format
      const formattedResponse = [
        {
          serverData: {
            userId: uploadRes[0].serverData.userId,
            file: {
              url: uploadedFileUrl,
              name: uploadRes[0].name,
            },
          },
        },
      ] as [
        { serverData: { userId: string; file: { url: string; name: string } } }
      ];

      console.log("Formatted response:", formattedResponse);
      const { data = null, message = null } =
        (await generatePdfSummary(formattedResponse)) || {};

      if (data?.summary) {
        toast.info("Saving PDF...", {
          description: "Hang tight! We are saving your summary! ✨",
        });

        console.log("Attempting to store PDF summary with:", {
          summary: data.summary,
          fileUrl: uploadedFileUrl,
          title: data.title,
          fileName: file.name,
        });

        const storeResult = await storePdfSummaryAction({
          summary: data.summary,
          fileUrl: uploadedFileUrl,
          title: data.title,
          fileName: file.name,
        });

        console.log("Store result:", storeResult);

        if (storeResult.success) {
          toast.success("Summary saved successfully!", {
            description: "Your summary has been saved to your account.",
          });
          formRef.current?.reset();
        } else {
          toast.error("Failed to save summary", {
            description: storeResult.message || "Please try again later.",
          });
        }
      } else {
        toast.error("Failed to generate summary", {
          description: "Please try uploading the PDF again.",
        });
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error("An error occurred", {
        description:
          error instanceof Error ? error.message : "Please try again later.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput ref={formRef} onSubmit={handleSubmit} />
    </div>
  );
}
