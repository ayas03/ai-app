import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

export default function UploadHeader() {
  return (
    <div className="flex flex-col items-center gap-6 justify-center text-center">
      <Badge className="bg-transparent border-none p-0">
        <div className="flex items-center gap-1 text-rose-500 text-sm">
          <Sparkles className="w-4 h-4" />
          <span>AI-Powered Content Creation</span>
        </div>
      </Badge>
      <h1 className="text-5xl font-bold">Start Uploading Your PDF's</h1>
      <p className="text-base text-gray-600">
        Upload your PDF and let our AI do the magic!
      </p>
    </div>
  );
}
