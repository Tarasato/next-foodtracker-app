import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Food Tracker App V.1.0",
  description: "Food Tracker for everybody",
  keywords: ["Food", "Tracker", "App", "อาหาร", "ติดตาม"],
  icons: {
    icon: "/next.svg",
  },
  authors: [{
    name: "Tarasato",
    url: "https://github.com/Tarasato"
  }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${prompt.className}`}
      >
        {children}
        <p className="fixed bottom-0 left-0 w-full text-center py-[10px] text-xl md:text-2xl text-white opacity-90 bg-black/20">
          Created by Tarasato
          <br />
          Copyright &copy; 2025 Southeast Asia University
        </p>
      </body>
    </html>
  );
}
