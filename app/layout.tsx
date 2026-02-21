import type { Metadata } from "next";
import Script from "next/script";
import Navbar from "../components/Navbar";
import { THEME_INIT_SCRIPT } from "../lib/theme";
import "./globals.css";

export const metadata: Metadata = {
  title: "Juni's Blog",
  description: "Just another blog.",
};

/**
 * Root layout mounts global navigation and applies the font variable.
 * All route segments render under this shell.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
