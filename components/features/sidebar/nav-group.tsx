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

export interface NavItem {
    href: string;
    label: string;
    icon: LucideIcon;
}

interface NavGroupProps {
    label?: string;
    items: NavItem[];
    isActive: (href: string) => boolean;
}

export function NavGroup({ label, items, isActive }: NavGroupProps) {
    return (
        <SidebarGroup>
            {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
            <SidebarGroupContent>
                <SidebarMenu>
                    {items.map(({ href, label: itemLabel, icon: Icon }) => (
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
