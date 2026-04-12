"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"
import { SidebarBubbleBackground } from "@/components/features/sidebar/sidebar-bubble-background"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Home, Users, BookOpen } from "lucide-react"
import { SidebarUserButton } from "@/components/features/sidebar/sidebar-user-button"

const navigation = [
    { name: "Overview", href: "/", icon: Home, theme: { key: "overview", hue: 42 } },
    { name: "Studies", href: "/studies", icon: BookOpen, theme: { key: "studies", hue: 200 } },
    { name: "User Management", href: "/user-management", icon: Users, theme: { key: "user-management", hue: 120 } },
];

export function AppSidebar() {
    const t = useTranslations('Common');
    const pathname = usePathname() || '/';

    const activeNavItem = navigation.find(item =>
        item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
    ) || navigation[0];

    const activeTheme = activeNavItem.theme;

    return (
        <Sidebar
            side="left"
            variant="sidebar"
            collapsible="icon"
            className="border-sidebar-border/70"
        >
            <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
                <SidebarBubbleBackground theme={activeTheme} />
                <div className="relative z-10 flex h-full min-h-0 flex-col">
                    <SidebarHeader className="h-[61px] justify-center">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton size="lg" asChild className="hover:bg-black/4 active:bg-black/10 transition-all">
                                    <Link href="/">
                                        <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-white/40 shadow-sm ring-1 ring-white/35">
                                            <Image src="/images/case_icon.svg" alt="CASE" className="size-8" width={32} height={32} />
                                        </div>
                                        <div className="text-left text-xl">
                                            <span className="truncate font-medium">{t('AppName')}</span>
                                        </div>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarGroup>
                            <SidebarGroupContent>
                                <SidebarMenu>
                                    {navigation.map((item) => {
                                        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                                        return (
                                            <SidebarMenuItem key={item.name}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={isActive}
                                                    tooltip={item.name}
                                                    className={`hover:bg-black/4 active:bg-black/10 data-[active=true]:bg-black/8 data-[active=true]:font-medium transition-all ${!isActive ? 'opacity-75 hover:opacity-100' : ''}`}
                                                >
                                                    <Link href={item.href}>
                                                        <item.icon className="size-4" />
                                                        <span>{item.name}</span>
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        );
                                    })}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                        <SidebarUserButton />
                    </SidebarFooter>
                </div>
            </div>
        </Sidebar>
    )
}
