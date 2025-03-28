import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative mx-auto flex flex-col z-0 items-center justify-center py-16 sm:py-20 lg:pb-28 transition-all animate-in lg:px-12 max-w-7xl">
      <div className="flex">
        <div className="relative p-[1px] overflow-hidden rounded-full bg-gradient-to-r from-rose-200 via-rose-500 to-rose-800 group">
          <Badge
            variant="secondary"
            className="flex items-center gap-2 relative px-6 py-2 text-base font-medium bg-white dark:bg-gray-950 rounded-full group-hover:bg-gray-50 dark:group-hover:bg-gray-900 transition-colors duration-200"
          >
            <Sparkles className="h-5 w-5 text-rose-500" />
            <span className="bg-gradient-to-r from-rose-500 to-rose-800 bg-clip-text text-transparent font-semibold">
              Powered by AI
            </span>
          </Badge>
        </div>
      </div>
      <h1 className="font-bold py-6 text-center text-3xl sm:text-4xl lg:text-5xl">
        Transform PDFs into{" "}
        <span className="relative inline-block">
          <span className="relative z-10 px-2">concise </span>
          <span
            className="absolute inset-0 bg-rose-200/50 -rotate-2 rounded-lg transform -skew-y-1"
            aria-hidden="true"
          ></span>
        </span>{" "}
        summaries
      </h1>
      <h2 className="text-lg sm:text-xl lg:text-2xl text-center px-4 lg:px-0 lg:max-w-4xl text-gray-600">
        Get a beautiful summary of your PDF in seconds
      </h2>
      <div>
        <Link href="/#pricing">
          <Button
            variant="default"
            className="bg-gradient-to-r from-slate-900 to-rose-500 hover:from-rose-500 hover:to-slate-900 text-white mt-6 text-base sm:text-lg lg:text-xl rounded-full px-8 sm:px-10 lg:px-12 py-6 sm:py-7 lg:py-8 lg:mt-16 font-bold shadow-lg transition-all duration-300"
          >
            <span>Try Summary</span>
            <ArrowRight className="animate-pulse ml-2" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
