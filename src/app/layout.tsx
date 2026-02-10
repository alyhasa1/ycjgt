import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConvexClientProvider } from "@/components/providers/convex-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "YCJGT — You Can Just Generate Things",
  description:
    "Drop your assets, get an AI-generated storyboard in seconds. Approve and generate — it's that simple.",
  icons: {
    icon: "/ycjgt.png",
  },
  metadataBase: new URL("https://youcanjustgeneratethings.com"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ConvexClientProvider>{children}</ConvexClientProvider>
      </body>
    </html>
  );
}
