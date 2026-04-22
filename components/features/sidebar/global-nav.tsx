"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    Home,
    BookOpen,
    MessageSquare,
    Settings,
    Database,
    BookText,
    ChevronRight,
    UserCog,
    Link2,
    LayoutTemplate,
    UserRound,
} from "lucide-react";
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
import { NavGroup, NavItem } from "./nav-group";

interface GlobalNavProps {
    recentStudies: Study[];
    studiesLoading: boolean;
}

export function GlobalNav({ recentStudies, studiesLoading }: GlobalNavProps) {
    const t = useTranslations("Sidebar.Global");
    const pathname = usePathname() || "/";
    const localizedText = useLocalizedText();

    const isActive = (href: string) =>
        href === "/" ? pathname === "/" : pathname.startsWith(href);

    const globalItems: NavItem[] = [
        { href: "/participants", label: t("participants"), icon: UserRound },
        { href: "/messages", label: t("messages"), icon: MessageSquare },
    ];

    const userManagementItems: NavItem[] = [
        { href: "/management-users", label: t("managementUsers"), icon: UserCog },
        { href: "/external-services", label: t("externalServices"), icon: Link2 },
        { href: "/app-role-templates", label: t("appRoleTemplates"), icon: LayoutTemplate },
    ];

    const systemItems: NavItem[] = [
        { href: "/documentation", label: t("documentation"), icon: BookText },
        { href: "/database-indexes", label: t("databaseIndexes"), icon: Database },
        { href: "/settings", label: t("settings"), icon: Settings },
    ];

    return (
        <>
            {/* Studies */}
            <SidebarGroup>
                <SidebarGroupLabel>{t("studiesSection")}</SidebarGroupLabel>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive("/")}
                                tooltip={t("dashboard")}
                                className={cn(
                                    "hover:bg-black/4 active:bg-black/10 data-[active=true]:bg-black/8 data-[active=true]:font-medium transition-all",
                                    !isActive("/") && "opacity-75 hover:opacity-100"
                                )}
                            >
                                <Link href="/">
                                    <Home className="size-4" />
                                    <span>{t("dashboard")}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>

                        <Collapsible defaultOpen className="group/collapsible">
                            <SidebarMenuItem>
                                <CollapsibleTrigger asChild>
                                    <SidebarMenuButton
                                        isActive={isActive("/studies")}
                                        tooltip={t("recentStudies")}
                                        className={cn(
                                            "hover:bg-black/4 active:bg-black/10 data-[active=true]:bg-black/8 data-[active=true]:font-medium data-[state=open]:hover:bg-black/4 transition-all",
                                            !isActive("/studies") && "opacity-75 hover:opacity-100"
                                        )}
                                    >
                                        <BookOpen className="size-4" />
                                        <span>{t("recentStudies")}</span>
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
                                                    {t("noStudies")}
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

            <NavGroup label={t("globalSection")} items={globalItems} isActive={isActive} />
            <NavGroup label={t("userManagementSection")} items={userManagementItems} isActive={isActive} />
            <NavGroup label={t("systemSection")} items={systemItems} isActive={isActive} />
        </>
    );
}
