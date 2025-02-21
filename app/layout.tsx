import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import SearchBar from "@/components/searchBar";
import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Play Log",
  description: "A web app to track the game you played and more...",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession();
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
          <div className="container mx-auto flex justify-between items-center p-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-gray-800">
                Play Log
              </Link>
            </div>
            <div className="flex-1 mx-4">
              <SearchBar />
            </div>
            <div className="flex items-center space-x-4">
              {session ? (
                <>
                  <Link
                    href="/api/auth/signout"
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Sign Out
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/api/auth/signin"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </header>
        <div className="pt-20">
          <div className="flex flex-col items-center justify-start h-screen bg-gray-100">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
