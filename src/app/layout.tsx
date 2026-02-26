import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import CustomCursor from "@/components/ui/CustomCursor";

export const metadata: Metadata = {
  title: "InterviewIQ — AI-Powered Mock Interview Platform",
  description: "Ace your next interview with autonomous AI-powered mock interviews tailored to your resume, target role, and experience level.",
  keywords: ["AI interview", "mock interview", "interview prep", "career"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        <AuthProvider>
          <CustomCursor />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
