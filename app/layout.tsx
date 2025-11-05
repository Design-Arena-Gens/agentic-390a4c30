import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tomato Delight",
  description: "Hyper-realistic laughing tomato animation experience."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
