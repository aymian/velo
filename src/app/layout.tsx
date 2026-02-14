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
    icon: "https://ext.same-assets.com/3286759155/2637069616.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={lato.variable}>
      <body className="antialiased bg-black min-h-screen">
        {children}
      </body>
    </html>
  );
}
