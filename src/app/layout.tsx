import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./Provider";
import '@smastrom/react-rating/style.css';



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Foodie Cart",
  description: "App for buy the best food in your city",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <Provider>{children}</Provider>
          </body>
      </html>
    </ClerkProvider>
  );
}
