"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { Study } from "@/lib/types/study";
import { useLocalizedText } from "@/hooks/use-localized-text";
import { Skeleton } from "@/components/ui/skeleton";
import { NavGroup } from "./nav-group";
import {
    globalNavSection,
    pageDashboard,
    pageStudies,
} from "@/lib/config/pages";

interface GlobalNavProps {
    recentStudies: Study[];
    studiesLoading: boolean;
}

export function GlobalNav({ recentStudies, studiesLoading }: GlobalNavProps) {
    const tSidebar = useTranslations("Sidebar");
    const tPages = useTranslations("Pages");
    const pathname = usePathname() || "/";
    const localizedText = useLocalizedText();

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    return (
        <>
            {/* Studies */}
            <SidebarGroup>
                <SidebarGroupLabel>{tSidebar("studiesSection")}</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive("/")}
                                tooltip={tPages(pageDashboard.labelKey)}
                                className={cn(
                                    "hover:bg-black/4 active:bg-black/10 data-[active=true]:bg-black/8 data-[active=true]:font-medium transition-all",
                                    !isActive("/") && "opacity-75 hover:opacity-100"
                                )}
                            >
                                <Link href="/">
                                    <pageDashboard.icon className="size-4" />
                                    <span>{tPages(pageDashboard.labelKey)}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <Collapsible defaultOpen className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        isActive={isActive("/studies")}
                                        tooltip={tSidebar("recentStudies")}
                                        className={cn(
                                            "hover:bg-black/4 active:bg-black/10 data-[active=true]:bg-black/8 data-[active=true]:font-medium data-[state=open]:hover:bg-black/4 transition-all",
                                            !isActive("/studies") && "opacity-75 hover:opacity-100"
                                        )}
                                    >
                                        <pageStudies.icon className="size-4" />
                                        <span>{tSidebar("recentStudies")}</span>
                                        <ChevronRight className="ml-auto size-4 shrink-0 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                    </SidebarMenuButton>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <SidebarMenuSub>
                                        {studiesLoading ? (
                                            <>
                                                <SidebarMenuSubItem>
                                                    <Skeleton className="h-6 w-full rounded" />
                                                </SidebarMenuSubItem>
                                                <SidebarMenuSubItem>
                                                    <Skeleton className="h-6 w-3/4 rounded" />
                                                </SidebarMenuSubItem>
                                            </>
                                        ) : recentStudies.length === 0 ? (
                                            <SidebarMenuSubItem>
                                                <span className="px-2 py-1 text-xs text-muted-foreground">
                                                    {tSidebar("noStudies")}
                                                </span>
                                            </SidebarMenuSubItem>
                                        ) : (
                                            recentStudies.map((study) => {
                                                const studyName = localizedText(study.name) || study.key;
                                                return (
                                                    <SidebarMenuSubItem key={study.id}>
                                                        <SidebarMenuSubButton
                                                            asChild
                                                            isActive={pathname.startsWith(`/studies/${study.key}`)}
                                                            className={cn(
                                                                "hover:bg-black/4 active:bg-black/10 data-[active=true]:bg-black/8 data-[active=true]:font-medium transition-all",
                                                                !pathname.startsWith(`/studies/${study.key}`) && "opacity-75 hover:opacity-100"
                                                            )}
                                                        >
                                                            <Link href={`/studies/${study.key}`}>
                                                                <span>{studyName}</span>
                                                            </Link>
                                                        </SidebarMenuSubButton>
                                                    </SidebarMenuSubItem>
                                                );
                                            })
                                        )}
                                    </SidebarMenuSub>
                                </CollapsibleContent>
                            </SidebarMenuItem>
                        </Collapsible>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>

            <NavGroup label={tSidebar("globalSection")} items={globalNavSection("global")} isActive={isActive} />
            <NavGroup label={tSidebar("userManagementSection")} items={globalNavSection("userManagement")} isActive={isActive} />
            <NavGroup label={tSidebar("systemSection")} items={globalNavSection("system")} isActive={isActive} />
        </>
    );
}

