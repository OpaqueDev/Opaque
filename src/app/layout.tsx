import type { Metadata } from "next";
import "./globals.css";
import { Web3Provider } from "@/components/Web3Provider";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  title: "OPAQUE",
  description: "Privacy-first DeFi analytics powered by iExec Nox.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="dark" disableTransitionOnChange>
          <Web3Provider>{children}</Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
