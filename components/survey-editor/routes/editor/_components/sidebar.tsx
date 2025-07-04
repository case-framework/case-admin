import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Airplay, FileCog, Languages, ListTree } from "lucide-react";
import { NavLink } from "react-router";

const SidebarItem: React.FC<{
    icon: React.ReactNode
    to: string
    label: string
    exact?: boolean
}> = ({ icon, label, to, exact }) => {
    return <li>
        <Tooltip
            delayDuration={0}
        >
            <TooltipTrigger asChild>
                <NavLink
                    to={to}
                    end={exact}
                    className='rounded-md h-full block'
                >
                    {({ isActive }) => (
                        <div className={cn(
                            "size-9",
                            "inline-flex rounded-md items-center justify-center gap-2 whitespace-nowrap  text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                            "hover:bg-neutral-200 hover:text-accent-foreground",
                            isActive && "bg-neutral-200")}>
                            {icon}
                        </div>
                    )}
                </NavLink>
            </TooltipTrigger>
            <TooltipContent
                side="right"
                align="center"
            >
                <p>{label}</p>
            </TooltipContent>
        </Tooltip>
    </li>
}

const EditorSidebar: React.FC = () => {
    return <div className="flex flex-col border-r border-border bg-sidebar p-1">
        <ul className="space-y-1.5">
            <SidebarItem
                to="/editor"
                icon={<FileCog className="size-6" />}
                label="Survey properties"
                exact
            />
            <SidebarItem
                to="/editor/item-editor"
                icon={<ListTree className="size-6" />}
                label="Item Editor"
            />
            <SidebarItem
                to="/editor/translation-mode"
                icon={<Languages className="size-6" />}
                label="Translation mode"
            />
            <SidebarItem
                to="/editor/simulator"
                icon={<Airplay className="size-6" />}
                label="Simulator"
            />
        </ul>
    </div>
}

export default EditorSidebar;
