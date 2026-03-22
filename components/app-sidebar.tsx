import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import Image from "next/image"
import { useTranslations } from "next-intl";

export function AppSidebar() {
    const t = useTranslations('Common');

    return (
        <Sidebar
            side="left"
            variant="sidebar"
            collapsible="icon"
        >
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center">
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
        </Sidebar>
    )
}