import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Slider :- Made By Shivansh",
  description:
    "Here I am Shivansh, creating a slider project using Next.js & Tailwind.",
  authors: [{ name: "Shivansh Singh" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
