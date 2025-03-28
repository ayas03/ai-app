import { FileText } from "lucide-react";
import Navlink from "./nav-link";
import { Button } from "@/components/ui/button";

export default function Header() {
  const isLoggedIn = false;
  return (
    <nav className="container flex items-center justify-between py-4 lg:px-8 px-2 mx-auto">
      <div className="flex lg:flex-1">
        <Navlink href="/" className="flex items-center gap-1 lg:gap-2 shrink-0">
          <FileText className="w-5 h-5 lg:w-8 lg:h-8 text-gray-900 hover:rotate-12 transform transition duration-200 ease-in-out" />
          <span className="font-extrabold lg:text-xl text-gray-900">
            My-app
          </span>
        </Navlink>
      </div>

      <div className="flex lg:justify-center gap-4 lg:gap-12 lg:items-center">
        <Navlink href="/#pricing">Pricing</Navlink>
        {isLoggedIn && <Navlink href="/dashboard">Your summaries</Navlink>}
      </div>

      <div className="flex lg:justify-end lg:flex-1">
        {isLoggedIn ? (
          <div className="flex gap-2 items-center">
            <Navlink href="/upload">Upload a PDF</Navlink>
            <div>Pro</div>
            <Button>Sign out</Button>
          </div>
        ) : (
          <div>
            <Navlink href="/sign-in">Sign in</Navlink>
          </div>
        )}
      </div>
    </nav>
  );
}
