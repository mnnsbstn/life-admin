import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { getDemoSession } from "@/lib/auth/demo-session";
import { AppProviders } from "@/providers/app-providers";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Life Admin",
    template: "%s · Life Admin",
  },
  description:
    "Zentrales Dashboard für Haushalt, Verträge, Dokumente und Erinnerungen.",
};

export default async function RootLayout({
  children,
}: LayoutProps<"/">) {
  const { user, household } = await getDemoSession();

  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="min-h-full">
        <AppProviders
          householdId={household.id}
          householdName={household.name}
          userDisplayName={user.displayName}
        >
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
