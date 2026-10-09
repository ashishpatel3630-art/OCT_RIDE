import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "OCT RIDE | Campus mobility, made simple",
  description:
    "Find your assigned bus, check your route and discover pickup points with OCT RIDE, the campus mobility platform for Oriental College of Technology.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}