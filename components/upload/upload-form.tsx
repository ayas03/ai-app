"use client";
import { z } from "zod";
import { toast } from "sonner";
import UploadFormInput from "./upload-form-input";
import { useUploadThing } from "@/utils/uploadthing";

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
    const resp = await startUpload([file]);
    if (!resp) {
      toast.error("Failed to upload file");
      return;
    }

    toast.info("Processing your file...", {
      description: "This may take a few seconds.. Our AI is working on it",
    });
    //parse pdf using langchain

    // summarize the pdf using AI
    // save the summary to the database
    // redirect to the summary page
  };
  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput onSubmit={handleSubmit} />
    </div>
  );
}
