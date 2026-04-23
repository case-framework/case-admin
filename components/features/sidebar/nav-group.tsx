"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth/auth-client";
import { UserRole } from "@/lib/types/user";
import { type NavPageDef } from "@/lib/config/pages";

interface NavGroupProps {
    label?: string;
    items: NavPageDef[];
    isActive: (href: string) => boolean;
}

export function NavGroup({ label, items, isActive }: NavGroupProps) {
    const { data: session } = authClient.useSession();
    const t = useTranslations("Pages");
    const userRole = session?.user?.role as UserRole | undefined;

    const visibleItems = items.filter(
        ({ roles }) => !roles || (userRole !== undefined && roles.includes(userRole))
    );

    return (
        <SidebarGroup>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarGroupContent>
                <SidebarMenu>
                    {visibleItems.map(({ path, labelKey, icon: Icon }) => (
                        <SidebarMenuItem key={path}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive(path)}
                                tooltip={t(labelKey)}
                                className={cn(
                                    "hover:bg-black/4 active:bg-black/10 data-[active=true]:bg-black/8 data-[active=true]:font-medium transition-all",
                                    !isActive(path) && "opacity-75 hover:opacity-100"
                                )}
                            >
                                <Link href={path}>
                                    <Icon className="size-4" />
                                    <span>{t(labelKey)}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
