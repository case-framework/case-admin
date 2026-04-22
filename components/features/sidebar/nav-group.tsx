"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";
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

export interface NavItem {
    href: string;
    label: string;
    icon: LucideIcon;
    roles?: UserRole[];
}

interface NavGroupProps {
    label?: string;
    items: NavItem[];
    isActive: (href: string) => boolean;
}

export function NavGroup({ label, items, isActive }: NavGroupProps) {
    const { data: session } = authClient.useSession();
    const userRole = session?.user?.role as UserRole | undefined;

    const visibleItems = items.filter(
        ({ roles }) => !roles || (userRole !== undefined && roles.includes(userRole))
    );

    return (
        <SidebarGroup>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarGroupContent>
                <SidebarMenu>
                    {visibleItems.map(({ href, label: itemLabel, icon: Icon }) => (
                        <SidebarMenuItem key={href}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive(href)}
                                tooltip={itemLabel}
                                className={cn(
                                    "hover:bg-black/4 active:bg-black/10 data-[active=true]:bg-black/8 data-[active=true]:font-medium transition-all",
                                    !isActive(href) && "opacity-75 hover:opacity-100"
                                )}
                            >
                                <Link href={href}>
                                    <Icon className="size-4" />
                                    <span>{itemLabel}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
