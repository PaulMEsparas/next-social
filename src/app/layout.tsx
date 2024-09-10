import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import { ClerkProvider } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sosyal Medya",
  description: "Social Media",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <div className="w-full px-4 bg-white md:px-8 lg:px-16 xl:px-32 2xl:px-64 dark:bg-gray-600">
            <Navbar />
          </div>
          <div className="bg-slate-100 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64  dark:bg-gray-700">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
