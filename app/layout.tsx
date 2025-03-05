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
      <body className={`${inter.className} antialiased bg-[#faf3e0]`}>
        <SidebarProvider>
          <AppSidebar isConnected={isConnected} />
          <SidebarInset className="bg-[#faf3e0]">
            <Header session={session} />
            <main className="flex-1 px-0 sm:px-4 py-6 md:px-6 lg:px-8 overflow-y-auto">
              <div className="mx-auto md:w-full sm:max-w-7xl max-w-sm">
                {children}
              </div>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}

function Header(props: { session: Session | null }) {
  const { session } = props;

  return (
    <header className="flex justify-between h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 bg-[#faf3e0] border-b border-[#D4A373]/20">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <span className="font-medium text-[#606C38]">Play Log</span>
      </div>
      <div className="flex mr-4">
        {session ? (
          <>
            <Link
              href="/api/auth/signout"
              className="px-4 py-2 bg-[#F2C4C4] text-[#a94848] rounded-lg hover:bg-[#EDAfAF] transition-colors"
            >
              Sign Out
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/api/auth/signin"
              className="px-4 py-2 bg-[#E9EDCA] text-[#5c6246] rounded-lg hover:bg-[#dfe4b5] transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-[#949F6E] text-white rounded-lg ml-3 hover:bg-[#8a9462] transition-colors"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </header>
  );
}
