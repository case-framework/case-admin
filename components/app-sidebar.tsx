import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { LocaleSwitcher } from "@/components/locale-switcher"
import Image from "next/image"

export function AppSidebar() {
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
                                    <span className="truncate font-medium">CASE Admin</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent></SidebarContent>
            <SidebarFooter>
                <LocaleSwitcher />
            </SidebarFooter>
        </Sidebar>
    )
}