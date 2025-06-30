import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Airplay, FileCog, ListTree } from "lucide-react";

const SidebarItem: React.FC<{
    icon: React.ReactNode
    label: string
    isActive: boolean
    onClick: () => void
}> = ({ icon, label, isActive, onClick }) => {
    return <li>
        <Tooltip
            delayDuration={0}
        >
            <TooltipTrigger asChild>
                <Button
                    variant={isActive ? "secondary" : "ghost"}
                    size="icon"
                    onClick={onClick}
                    className={cn('hover:bg-neutral-200', isActive && "bg-neutral-200 ")}
                >
                    {icon}
                </Button>
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
                icon={<FileCog className="size-6" />}
                label="Survey properties"
                onClick={() => { }}
                isActive={false}
            />
            <SidebarItem
                icon={<ListTree className="size-6" />}
                label="Item Editor"
                onClick={() => { }}
                isActive={true}
            />
            <SidebarItem
                icon={<Airplay className="size-6" />}
                label="Simulator"
                onClick={() => { }}
                isActive={false}
            />


        </ul>
    </div>
}

export default EditorSidebar;