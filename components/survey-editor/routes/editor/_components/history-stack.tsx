import { useSurveyEditor } from "@/components/survey-editor/store/useSurveyEditor";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { History } from "lucide-react";
import { useState } from "react";

const HistoryStack: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { editor } = useSurveyEditor();

    const historyInstance = editor?.undoRedo;

    const lastHistoryEntry = historyInstance?.getHistory().at(historyInstance.getCurrentIndex());


    return <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
            <Button
                variant="ghost"
                className="h-(--footer-height) rounded-none p-0 gap-2">
                <span className="space-x-1">

                    <span className="text-xs font-light">
                        Last modified:
                    </span>
                    <span className="text-xs font-medium">
                        {formatDistanceToNow(new Date(lastHistoryEntry?.timestamp ?? 0), { addSuffix: true })}
                    </span>
                </span>
                <History className="size-3.5" />
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 border-border" align="start" side="top">
            <div className="p-3 border-b border-border">
                <h4 className="font-medium text-sm">Recent changes</h4>
                <p className="text-xs text-muted-foreground">Click a state to jump to roll back to that point</p>
            </div>
            <ScrollArea className="h-64">
                <ol className="divide-y divide-border">
                    {historyInstance?.getHistory().sort((a, b) => b.timestamp - a.timestamp).map((entry) => (
                        <li key={entry.index}>
                            <button
                                disabled={entry.index === historyInstance.getCurrentIndex()}
                                className={cn(
                                    "text-sm px-3 py-1 flex items-center justify-between w-full",
                                    "hover:bg-accent transition-colors focus:bg-accent focus:outline-none",
                                    entry.index === historyInstance.getCurrentIndex() && "bg-primary text-primary-foreground hover:bg-primary focus:bg-primary"
                                )}
                                onClick={() => editor?.jumpToIndex(entry.index)}
                            >
                                <p className="truncate text-sm font-medium">
                                    {entry.description}
                                </p>
                                <p className={cn(
                                    "text-xs text-muted-foreground",
                                    entry.index === historyInstance.getCurrentIndex() && "text-primary-foreground/80"
                                )}>{formatDistanceToNow(new Date(entry.timestamp), { addSuffix: true })}</p>
                            </button>
                        </li>
                    ))}
                </ol>
            </ScrollArea>
        </PopoverContent>
    </Popover>
}

export default HistoryStack;
