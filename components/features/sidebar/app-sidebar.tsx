import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { SidebarBubbleBackground, type SidebarBubbleTheme } from "@/components/features/sidebar/sidebar-bubble-background"
import Image from "next/image"
import { useTranslations } from "next-intl";

const overviewSidebarTheme: SidebarBubbleTheme = {
    key: "overview",
    hue: { value: 30, spread: 10 },
    saturation: { value: 82, spread: 10 },
    lightness: { value: 72, spread: 8 },
    alpha: { value: 0.38, spread: 0.08 },
    overlayOpacity: 0.30,
}

export function AppSidebar({
    theme = overviewSidebarTheme,
}: {
    theme?: SidebarBubbleTheme
}) {
    const t = useTranslations('Common');

    return (
        <Sidebar
            side="left"
            variant="sidebar"
            collapsible="icon"
            className="border-sidebar-border/70"
        >
            <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
                <SidebarBubbleBackground theme={theme} />
                <div className="relative z-10 flex h-full min-h-0 flex-col">
                    <SidebarHeader>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton size="lg" asChild className="hover:bg-white/30 data-[active=true]:bg-white/30">
                                    <a href="#">
                                        <div className="flex aspect-square size-8 items-center justify-center rounded-xl bg-white/40 shadow-sm ring-1 ring-white/35">
                                            <Image src="/images/case_icon.svg" alt="CASE" className="size-8" width={32} height={32} />
                                        </div>
                                        <div className="text-left text-xl">
                                            <span className="truncate font-medium">{t('AppName')}</span>
                                        </div>
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarHeader>
                    <SidebarContent></SidebarContent>
                    <SidebarFooter>
                    </SidebarFooter>
                </div>
            </div>
        </Sidebar>
    )
}