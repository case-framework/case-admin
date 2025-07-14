import { useSurveyEditor } from "@/components/survey-editor/store/useSurveyEditor";
import { useItemNavigation } from "@/components/survey-editor/store/useItemNavigation";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { AlertTriangle } from "lucide-react";
import { useState, useMemo } from "react";


interface InvalidItem {
    key: string;
    issues: string[];
}


const Issues: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { editor } = useSurveyEditor();
    const { navigateToItem } = useItemNavigation();

    const invalidReferenceUsages = editor?.survey.findInvalidReferenceUsages();


    const invalidItems = useMemo((): InvalidItem[] => {
        if (!invalidReferenceUsages) {
            return [];
        }

        const items: InvalidItem[] = [];
        for (const usage of invalidReferenceUsages) {
            const issue = `Invalid reference in ${usage.usageType} ${usage.fullComponentKey && ' for ' + usage.fullComponentKey} to ${usage.valueReference.toString()}`;
            items.push({
                key: usage.fullItemKey,

                issues: [issue]
            });
        }

        return items;
    }, [invalidReferenceUsages]);

    const issueCount = invalidItems.length;

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    className={cn(
                        "h-(--footer-height) rounded-none p-0 gap-2",
                    )}
                >
                    <span className="space-x-1">
                        <span className="text-xs font-light">
                            Issues:
                        </span>
                        <span className="text-xs font-medium">
                            {issueCount}
                        </span>
                    </span>
                    <AlertTriangle className="size-3.5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0 border-border" align="start" side="top">
                <div className="p-3 border-b border-border">
                    <h4 className="font-medium text-sm">Survey Issues</h4>
                    <p className="text-xs text-muted-foreground">
                        Click an item to navigate to it and fix the issues
                    </p>
                </div>
                {issueCount === 0 ? (
                    <div className="p-3 text-center">
                        <p className="text-sm text-muted-foreground">No issues found</p>
                    </div>
                ) : (
                    <ScrollArea className="h-64">
                        <ol className="divide-y divide-border">
                            {invalidItems.map((item) => (
                                <li key={item.key}>
                                    <button
                                        className="text-xs px-3 py-1 flex flex-col items-start w-full hover:bg-accent transition-colors focus:bg-accent focus:outline-none"
                                        onClick={() => {
                                            navigateToItem(item.key);
                                            setIsOpen(false);
                                        }}
                                    >
                                        <p className="truncate text-xs font-medium font-mono">
                                            {item.key}
                                        </p>
                                        <ul className="text-xs text-muted-foreground">
                                            {item.issues.map((issue, index) => (
                                                <li key={index} className="text-xs text-destructive">
                                                    • {issue}
                                                </li>
                                            ))}
                                        </ul>
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </ScrollArea>
                )}
            </PopoverContent>
        </Popover>
    );
};

export default Issues;
