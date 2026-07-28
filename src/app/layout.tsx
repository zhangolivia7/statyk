import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const lcd14 = localFont({
  variable: "--font-lcd14",
  src: [
    { path: "./fonts/LCD14.otf", weight: "400", style: "normal" },
    { path: "./fonts/LCD14Italic.otf", weight: "400", style: "italic" },
  ],
});

export const metadata: Metadata = {
  title: "statyk",
  description: "share your static",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lcd14.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
