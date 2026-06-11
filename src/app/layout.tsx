import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "IntroCourse", template: "%s | IntroCourse" },
  description:
    "A guided introduction to the terminal, Git, GitHub, and developer tools.",
  applicationName: "IntroCourse",
  keywords: [
    "terminal",
    "git",
    "github",
    "developer onboarding",
    "command line",
    "intro to programming",
  ],
  creator: "AbaCord",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <body className="min-h-full">
        <Header />
        <main className="container mx-auto px-4 py-12 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
