import { Button } from "@/components/ui/button";
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuShortcut, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuPortal, DropdownMenuSubContent } from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Airplay, FileCog, Languages, ListTree, Menu, Redo, Undo } from "lucide-react";
import { NavLink } from "react-router";

interface SidebarMenuProps {
    onSave?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
}

const SidebarNavItem: React.FC<{
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
                            "hover:bg-gray-200",
                            isActive && "bg-gray-200 hover:bg-gray-200")}>
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

const SidebarMenu: React.FC<SidebarMenuProps> = ({ onSave, onUndo, onRedo }) => {
    return <li className="space-y-1.5">
        <DropdownMenu>
            <Tooltip
                delayDuration={0}
            >
                <DropdownMenuTrigger asChild>

                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="size-6" />
                        </Button>
                    </TooltipTrigger>
                </DropdownMenuTrigger>
                <TooltipContent
                    side="right"
                    align="center"
                >
                    <p>Menu</p>
                </TooltipContent>

            </Tooltip>

            <DropdownMenuContent className="w-56 border-border" align="start"
                side="right"
                sideOffset={10}
            >
                <DropdownMenuLabel className="text-xs font-bold">File</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        Start new survey...
                    </DropdownMenuItem>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Legacy survey</DropdownMenuSubTrigger>
                        <DropdownMenuPortal>
                            <DropdownMenuSubContent className="border-border">
                                <DropdownMenuItem>Import from JSON</DropdownMenuItem>
                                <DropdownMenuItem>Export as legacy survey</DropdownMenuItem>
                            </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                    </DropdownMenuSub>
                    <DropdownMenuItem onClick={onSave}>
                        Save to disk
                        <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuGroup>
                    <DropdownMenuLabel className="text-xs font-bold">Edit</DropdownMenuLabel>
                    <DropdownMenuItem onClick={onUndo}>
                        <Undo className="size-4" />
                        Undo
                        <DropdownMenuShortcut>⌘Z</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onRedo}>
                        <Redo className="size-4" />
                        Redo
                        <DropdownMenuShortcut>⇧⌘Z</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Exit</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </li>
}

interface EditorSidebarProps {
    onSave?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({ onSave, onUndo, onRedo }) => {
    return <div className="flex flex-col border-r border-border bg-white p-1">
        <ul className="space-y-1.5">
            <SidebarMenu onSave={onSave} onUndo={onUndo} onRedo={onRedo} />

            <Separator className="my-1" />

            <SidebarNavItem
                to="/editor"
                icon={<FileCog className="size-6" />}
                label="Survey properties"
                exact
            />
            <SidebarNavItem
                to="/editor/item-editor"
                icon={<ListTree className="size-6" />}
                label="Item Editor"
            />
            <SidebarNavItem
                to="/editor/translation-mode"
                icon={<Languages className="size-6" />}
                label="Translation mode"
            />
            <SidebarNavItem
                to="/editor/simulator"
                icon={<Airplay className="size-6" />}
                label="Simulator"
            />
        </ul>
    </div>
}

export default EditorSidebar;
