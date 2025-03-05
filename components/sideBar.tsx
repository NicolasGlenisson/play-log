"use client";
import {
  Home,
  Gamepad2,
  List,
  SquarePlus,
  TextSearch,
  User,
} from "lucide-react";

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
