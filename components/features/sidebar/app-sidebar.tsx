"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarBubbleBackground } from "@/components/features/sidebar/sidebar-bubble-background";
import { GlobalNav } from "@/components/features/sidebar/global-nav";
import { StudyNav } from "@/components/features/sidebar/study-nav";

import { usePathname } from "next/navigation";
import { SidebarUserButton } from "@/components/features/sidebar/sidebar-user-button";
import { useGetRecentStudies, useGetStudyByKey } from "@/hooks/use-studies-router";
import { useLocalizedText } from "@/hooks/use-localized-text";
import { cn } from "@/lib/utils";
import type { BubbleTheme } from "@/components/features/sidebar/sidebar-bubble-background";
import { SidebarHeaderLogo } from "./sidebar-header-logo";

// ---------------------------------------------------------------------------
// Deterministically map a study key to a hue (0–360)
// ---------------------------------------------------------------------------
function studyKeyToHue(key: string): number {
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
        hash = (hash * 31 + key.charCodeAt(i)) & 0xffff;
    }
    return hash % 360;
}

// ---------------------------------------------------------------------------
// Global theme map (outside study context)
// ---------------------------------------------------------------------------
const defaultTheme: BubbleTheme = { key: "overview", hue: 220 };
// const globalTheme: BubbleTheme = { key: "global", hue: 270 }
// const userManagementTheme: BubbleTheme = { key: "user-management", hue: 333 };
// const systemTheme: BubbleTheme = { key: "system", hue: 120 };

const globalThemes: { prefix: string; theme: BubbleTheme }[] = [
    { prefix: "/studies", theme: defaultTheme },
    { prefix: "/participants", theme: defaultTheme },
    { prefix: "/messages", theme: defaultTheme },
    { prefix: "/management-users", theme: defaultTheme },
    { prefix: "/external-services", theme: defaultTheme },
    { prefix: "/app-role-templates", theme: defaultTheme },
    { prefix: "/documentation", theme: defaultTheme },
    { prefix: "/database-indexes", theme: defaultTheme },
    { prefix: "/settings", theme: defaultTheme },
];

function getGlobalTheme(pathname: string): BubbleTheme {
    if (pathname === "/") return defaultTheme;
    return globalThemes.find((t) => pathname.startsWith(t.prefix))?.theme ?? defaultTheme;
}

// ---------------------------------------------------------------------------
// AppSidebar — main orchestrator
// ---------------------------------------------------------------------------
export function AppSidebar() {
    const pathname = usePathname() || "/";

    // Detect study context from URL
    const studyKeyMatch = pathname.match(/^\/studies\/([^/]+)/);
    const studyKey = studyKeyMatch?.[1] ?? null;
    const isStudyView = studyKey !== null;

    // Data fetching
    const { data: recentStudies = [], isLoading: studiesLoading } = useGetRecentStudies({ enabled: !isStudyView });
    const { data: currentStudy } = useGetStudyByKey(studyKey);
    const localizedText = useLocalizedText();

    const studyDisplayName = currentStudy?.name ? localizedText(currentStudy.name) : (studyKey ?? "");

    // Compute theme
    const activeTheme: BubbleTheme = isStudyView
        ? { key: `study-${studyKey}`, hue: studyKeyToHue(studyKey!) }
        : getGlobalTheme(pathname);

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
                    <SidebarHeader className="h-15.25 justify-center">
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarHeaderLogo
                                    isStudyView={isStudyView}
                                    studyDisplayName={studyDisplayName}
                                />
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>

                    {/* Nav layers — both mounted; off-screen layer is absolute+invisible */}
                    <SidebarContent className="relative overflow-hidden">
                        <div
                            className={cn(
                                "transition-[opacity,transform] duration-200 ease-in-out",
                                isStudyView
                                    ? "absolute inset-0 pointer-events-none opacity-0 -translate-x-3 overflow-hidden"
                                    : "relative opacity-100 translate-x-0"
                            )}
                            aria-hidden={isStudyView}
                        >
                            <GlobalNav
                                recentStudies={recentStudies}
                                studiesLoading={studiesLoading}
                            />
                        </div>

                        <div
                            className={cn(
                                "transition-[opacity,transform] duration-200 ease-in-out",
                                !isStudyView
                                    ? "absolute inset-0 pointer-events-none opacity-0 translate-x-3 overflow-hidden"
                                    : "relative opacity-100 translate-x-0"
                            )}
                            aria-hidden={!isStudyView}
                        >
                            {studyKey && <StudyNav studyKey={studyKey} />}
                        </div>
                    </SidebarContent>

                    <SidebarFooter>
                        <SidebarUserButton />
                    </SidebarFooter>
                </div>
            </div>
        </Sidebar>
    );
}
