import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import { useEffect } from "react";
import { UserProvider, useUser } from "@/context/UserContext";
import { SettingsProvider } from "@/context/SettingsContext";
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DonorSync ✦ Blood Donation Platform",
  description: "A comprehensive web-based platform that connects blood donors directly with hospitals, ensuring quick and efficient blood donation.",
};

// Component to update device type


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider>
      <SettingsProvider>
        <html lang="en" suppressHydrationWarning>
          <head>
            <link rel="icon" type="image/svg+xml" href="/donor-sync-icon-rounder-black-bg.svg" />

            <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta>

          </head>

          <body className={inter.className}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >

              {children}
            </ThemeProvider>
            <Toaster />
          </body>
        </html>
      </SettingsProvider>
    </UserProvider>
  );
}
