import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { RootProvider } from "fumadocs-ui/provider/next";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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
  metadataBase: new URL("https://onchain-ui.dev"),
  title: {
    default: "onchain-ui",
    template: "%s | onchain-ui",
  },
  description:
    "Open source shadcn registry of web3 UI components. Built with wagmi + viem.",
  openGraph: {
    type: "website",
    siteName: "onchain-ui",
    title: "onchain-ui",
    description:
      "Copy-paste web3 components for shadcn apps. Built with wagmi + viem.",
  },
  twitter: {
    card: "summary_large_image",
    title: "onchain-ui",
    description:
      "Copy-paste web3 components for shadcn apps. Built with wagmi + viem.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/logo-mark.svg", type: "image/svg+xml" },
    ],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <RootProvider theme={{ defaultTheme: "dark" }}>
          <TooltipProvider>{children}</TooltipProvider>
        </RootProvider>
        <Toaster />
      </body>
    </html>
  );
}
