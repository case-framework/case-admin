import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar"
import { LocaleSwitcher } from "@/components/locale-switcher"

export function AppSidebar() {
    return (
        <Sidebar
            side="left"
            variant="sidebar"
            collapsible="icon"
        >
            <SidebarHeader></SidebarHeader>
            <SidebarContent></SidebarContent>
            <SidebarFooter>
                <LocaleSwitcher />
            </SidebarFooter>
        </Sidebar>
    )
}