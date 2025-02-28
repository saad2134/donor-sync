import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


// Button
import { Button } from "@/components/ui/button"
export function ButtonDemo() {
  return <Button>Button</Button>
}

import { ThemeProvider } from "@/components/theme-provider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Donor Sync",
  description: "A comprehensive web-based platform that connects blood donors directly with hospitals, ensuring quick and efficient blood donation.",
};





// This layout applies a global header and footer to all pages.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>

      <head>
        <link rel="icon" type="image/svg+xml" href="/donor-sync-icon-rounder.svg" />
      </head>

      
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <header className="p-4 bg-gray-200 text-white">
          <h1>My Next.js App</h1>
        </header> */}



        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>

        {/* <footer className="p-4 bg-gray-200 text-center">
          © 2024 My Next.js App
        </footer> */}
      </body>

    </html>
  );
}
