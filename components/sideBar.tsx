"use client";
import { Home, Gamepad2, List, SquarePlus, TextSearch } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
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
    title: "Playlist",
    url: "/playlist",
    icon: TextSearch,
    items: [
      {
        title: "Create",
        url: "/playlist/create",
        icon: SquarePlus,
        needConnection: true,
      },
      {
        title: "My Playlists",
        url: "/playlist/mine",
        icon: List,
        needConnection: true,
      },
    ],
  },
];

export function AppSidebar(props: { isConnected: boolean }) {
  const { isConnected } = props;
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarContent className="bg-[#E9EDCA]">
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg mb-3">
            Play Log
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                return (
                  (!item.needConnection || isConnected) && (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton className="hover:bg-[#949F6E]" asChild>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                      {item.items &&
                        pathname.startsWith(item.url) &&
                        item.items.map(
                          (item) =>
                            (!item.needConnection || isConnected) && (
                              <SidebarMenu key={item.title} className="ml-5">
                                <SidebarMenuItem>
                                  <SidebarMenuButton
                                    className="hover:bg-[#949F6E]"
                                    asChild
                                  >
                                    <a href={item.url}>
                                      <item.icon />
                                      <span>{item.title}</span>
                                    </a>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              </SidebarMenu>
                            )
                        )}
                    </SidebarMenuItem>
                  )
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
