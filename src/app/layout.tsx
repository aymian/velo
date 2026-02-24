import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-lato",
});

export const metadata: Metadata = {
  title: "Veeloo Live - Live Stream & Video Chat",
  description:
    "Veeloo is your free video chat and live streaming platform to meet new people, stream live, and connect in real time, anytime. Join now and start chatting.",
  icons: {
    icon: "/icon.svg",
  },
};

import { Providers } from "@/components/providers/QueryProvider";
import { FloatingChatButton } from "@/components/FloatingChatButton";
import { KeyboardShortcuts } from "@/components/providers/KeyboardShortcuts";
import { ResponsiveGuard } from "@/components/providers/ResponsiveGuard";

import { Suspense } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lato.variable}>
      <body className="antialiased bg-black min-h-screen">
        <Providers>
          <ResponsiveGuard>
            <KeyboardShortcuts>
              <Suspense fallback={<div>Loading...</div>}>
                {children}
              </Suspense>
              <FloatingChatButton />
            </KeyboardShortcuts>
          </ResponsiveGuard>
        </Providers>
      </body>
    </html>
  );
}
