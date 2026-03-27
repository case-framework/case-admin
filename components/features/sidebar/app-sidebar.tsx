"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar"
import { SidebarBubbleBackground, type SidebarBubbleTheme } from "@/components/features/sidebar/sidebar-bubble-background"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import { Home, Users, BookOpen } from "lucide-react"

const overviewSidebarTheme: SidebarBubbleTheme = {
    key: "overview",
    hue: { value: 42, spread: 15 },
    saturation: { value: 80, spread: 10 },
    lightness: { value: 70, spread: 15 },
    alpha: { value: 0.38, spread: 0.08 },
    overlayOpacity: 0.2,
};

const studiesSidebarTheme: SidebarBubbleTheme = {
    key: "studies",
    hue: { value: 200, spread: 15 },
    saturation: { value: 80, spread: 10 },
    lightness: { value: 70, spread: 10 },
    alpha: { value: 0.38, spread: 0.08 },
    overlayOpacity: 0.20,
};

const userManagementSidebarTheme: SidebarBubbleTheme = {
    key: "user-management",
    hue: { value: 120, spread: 15 },
    saturation: { value: 80, spread: 15 },
    lightness: { value: 70, spread: 10 },
    alpha: { value: 0.38, spread: 0.08 },
    overlayOpacity: 0.20,
};

const navigation = [
    { name: "Overview", href: "/", icon: Home, theme: overviewSidebarTheme },
    { name: "Studies", href: "/studies", icon: BookOpen, theme: studiesSidebarTheme },
    { name: "User Management", href: "/user-management", icon: Users, theme: userManagementSidebarTheme },
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
                    </SidebarFooter>
                </div>
            </div>
        </Sidebar>
    )
}
