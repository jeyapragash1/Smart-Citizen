import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/Chatbot"; // 1. Import the Chatbot

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Smart Citizen LK", // Updated Title
  description: "National Digital Service Platform of Sri Lanka", // Updated Description
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/logo.jpeg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo.jpeg" />
        {/* Removed favicon.ico to force browser to use logo.jpeg */}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        {/* 2. Add the Floating Chatbot here */}
        <Chatbot />
      </body>
    </html>
  );
}