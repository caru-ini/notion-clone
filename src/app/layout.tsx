import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ModalProvider } from "@/components/providers/modal-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Notion Clone",
  description: "Notion Clone",
  icons: "/logo.svg",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={"ja"} suppressHydrationWarning>
      <body className={inter.className}>
        <EdgeStoreProvider>
          <ThemeProvider
            attribute={"class"}
            defaultTheme={"dark"}
            enableSystem
            disableTransitionOnChange
            storageKey={"notion-theme-2"}
          >
            <SessionProvider>
              <Toaster position={"bottom-center"} />
              <ModalProvider />
              {children}
            </SessionProvider>
          </ThemeProvider>
        </EdgeStoreProvider>
      </body>
    </html>
  );
}
