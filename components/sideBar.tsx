"use client";
import {
  Home,
  Gamepad2,
  List,
  SquarePlus,
  TextSearch,
  User,
} from "lucide-react";

import { Sidebar } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "My Games",
    url: "/myGames",
    icon: Gamepad2,
    needConnection: true,
  },
  {
    title: "Game Lists",
    url: "/list",
    icon: TextSearch,
    items: [
      {
        title: "Create",
        url: "/list/create",
        icon: SquarePlus,
        needConnection: true,
      },
      {
        title: "My Game Lists",
        url: "/list/mine",
        icon: List,
        needConnection: true,
      },
    ],
  },
  {
    title: "My Profile",
    url: "/profile",
    icon: User,
    needConnection: true,
  },
];

export function AppSidebar(props: { isConnected: boolean }) {
  const { isConnected } = props;
  const pathname = usePathname();
  return (
    <Sidebar>
      <div className={"bg-[#F8E8B8] border-r border-[#DACFB0] h-full"}>
        <div className="p-4 text-[#5E5034] text-xl font-bold">Play Log</div>
        <nav className="flex-1 overflow-y-auto px-2 space-y-1">
          {items.map((item) =>
            !item.needConnection || isConnected ? (
              <div key={item.title}>
                <a
                  href={item.url}
                  className={`
                    group flex items-center rounded-md px-3 py-2 mb-1
                    text-[#5E5034] hover:bg-[#E9DCC3] transition-colors
                    ${pathname === item.url ? "bg-[#E9DCC3]" : ""}
                  `}
                >
                  <item.icon className="w-5 h-5 mr-2" />
                  <span className="font-medium">{item.title}</span>
                </a>

                {/* Sous-menu si la route courante correspond */}
                {item.items &&
                  pathname.startsWith(item.url) &&
                  item.items.map(
                    (sub) =>
                      (!sub.needConnection || isConnected) && (
                        <a
                          key={sub.title}
                          href={sub.url}
                          className={`
                            flex items-center rounded-md px-3 py-2 ml-6 mb-1
                            text-[#5E5034] hover:bg-[#E9DCC3] transition-colors
                            ${pathname === sub.url ? "bg-[#E9DCC3]" : ""}
                          `}
                        >
                          <sub.icon className="w-4 h-4 mr-2" />
                          <span className="text-sm">{sub.title}</span>
                        </a>
                      )
                  )}
              </div>
            ) : null
          )}
        </nav>
      </div>
    </Sidebar>
  );
}
