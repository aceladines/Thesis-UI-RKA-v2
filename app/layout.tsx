import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Document Similarity Checker",
  description:
    "A simple document similarity checker using Enhanced Rabin-Karp Algorithm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} relative dark:bg-gray-900`}>
        {children} <Footer />
      </body>
    </html>
  );
}
