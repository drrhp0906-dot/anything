import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "University Exam Database",
  description: "A comprehensive database for managing university exam questions, subjects, systems, and files.",
  keywords: ["University", "Exam", "Database", "Questions", "Education", "Study"],
  authors: [{ name: "University Exam Database Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "University Exam Database",
    description: "Manage subjects, systems, questions, and files for university exams",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "University Exam Database",
    description: "Manage subjects, systems, questions, and files for university exams",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
