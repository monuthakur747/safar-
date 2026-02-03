import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Safar - Discover Amazing Travel Destinations",
  description: "Explore beautiful travel packages and book your next adventure with Safar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
