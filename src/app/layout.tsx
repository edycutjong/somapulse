import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "SomaPulse — Offline-First Medical Triage & Diagnostic Translation",
  description:
    "Edge-native medical triage utilizing local speech-to-text and SapBERT semantic search on edge hardware. Zero network dependency.",
  icons: { icon: "/icon.svg" },
  openGraph: {
    title: "SomaPulse — Offline-First Medical Triage",
    description:
      "Bringing clinical intelligence to disaster zones with zero internet dependency.",
    url: "https://devpost-uoe-somapulse.vercel.app",
    siteName: "SomaPulse",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "SomaPulse" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SomaPulse — Offline-First Medical Triage",
    description:
      "Bringing clinical intelligence to disaster zones with zero internet dependency.",
    images: ["/og-image.png"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
