import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GT Nutri Bites — Social Post Generator",
  description: "Generate professional social media posts for GT Nutri Bites products",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400&family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&family=Cormorant+Garamond:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
