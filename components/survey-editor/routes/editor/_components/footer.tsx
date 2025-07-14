import { HelpCircle } from "lucide-react";
import HistoryStack from "./history-stack";
import Issues from "./issues";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


const helpLink = process.env.NEXT_PUBLIC_SURVEY_EDITOR_DOCS_URL ?? "https://case-framework.github.io/case-docs/"

const EditorFooter: React.FC = () => {
    return <footer className="h-(--footer-height) bg-(--footer-bg-color) text-(--footer-text-color)">
        <div className="flex items-center justify-between h-full text-sm ps-4 pe-4">
            <div className="flex items-center h-full">
                <HistoryStack />
                <Issues />
            </div>
            <div className="">
                <Button
                    variant="ghost"
                    className={cn(
                        "h-(--footer-height) rounded-none p-0 gap-2",
                    )}
                    asChild
                >
                    <a href={helpLink} target="_blank" rel="noopener noreferrer">
                        <HelpCircle className="size-3" />
                        <span className="text-xs">
                            Help
                        </span>
                    </a>
                </Button>
            </div>
        </div>
    </footer>
}

export default EditorFooter;
