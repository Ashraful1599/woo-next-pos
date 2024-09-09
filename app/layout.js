// layout.js

import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head";
import LayoutClient from "@/components/client/LayoutClient";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "POS Application",
  description: "Nutrizone POS App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="alternate icon" href="/favicon.ico" type="image/x-icon" />
      </Head>
      <body className={`${inter.className} overflow-hidden bg-gray-50 text-gray-900`}>
        <LayoutClient>
          <div id="main" className="min-h-screen">
            {children}
          </div>
        </LayoutClient>
      </body>
    </html>
  );
}
