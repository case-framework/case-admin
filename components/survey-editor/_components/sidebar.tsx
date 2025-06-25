import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Plus } from "lucide-react";

const EditorSidebar: React.FC = () => {
    return <div className="flex flex-col border-r border-border bg-blue-50/50 p-2">
        <ul>
            <li>
                <Tooltip
                    delayDuration={0}
                >
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"

                        >
                            <Plus className="size-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent
                        side="right"
                        align="center"
                    >
                        <p>
                            Add a new survey
                        </p>
                    </TooltipContent>
                </Tooltip>
            </li>
        </ul>
    </div>
}

export default EditorSidebar;