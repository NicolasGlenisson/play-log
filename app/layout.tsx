import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getServerSession, Session } from "next-auth";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sideBar";

import { Separator } from "@/components/ui/separator";
import { options } from "@/lib/auth";

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
  const session = await getServerSession(options);

  const isConnected = session?.user.id ? true : false;
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <SidebarProvider>
          <AppSidebar isConnected={isConnected} />
          <SidebarInset>
            <Header session={session} />
            <div className="flex flex-col items-center justify-start h-screen bg-gray-100 p-4">
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}

function Header(props: { session: Session | null }) {
  const { session } = props;

  return (
    <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        Play Log
      </div>
      <div className="flex mr-4">
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
              className="px-4 py-2 bg-blue-500 text-white rounded-lg "
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-green-500 text-white rounded-lg ml-3"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
