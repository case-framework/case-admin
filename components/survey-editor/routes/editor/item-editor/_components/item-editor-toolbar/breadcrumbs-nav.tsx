import { useSurveyEditor } from "@/components/survey-editor/store/useSurveyEditor";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDownIcon, CornerLeftUpIcon, FolderTree, PlusIcon } from "lucide-react";
import { useItemNavigation } from "../../../../../store/useItemNavigation";
import { GroupItem, SurveyItemKey } from "survey-engine";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenu, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Fragment } from "react";
import { useItemEditor } from "../item-editor-context";


const BreadcrumbsNav: React.FC = () => {

    const { editor } = useSurveyEditor();
    const { selectedItemKey, navigateToItem } = useItemNavigation();
    const { openAddItemDialog } = useItemEditor();

    const getBreadcrumbItems = (itemKey: string | undefined) => {
        if (!itemKey) {
            return null;
        }

        const key = SurveyItemKey.fromFullKey(itemKey);

        const levels: string[] = [];
        key.keyParts.forEach((_, index) => {
            if (index === 0) {
                return;
            }

            const level = key.keyParts.slice(0, index + 1).join('.');
            levels.push(level);
        });

        return levels.map((level) => {
            const levelKey = SurveyItemKey.fromFullKey(level);
            const levelParentKey = levelKey.parentFullKey;

            if (!levelParentKey) {
                return null;
            }

            const siblings = (editor?.survey.surveyItems[levelParentKey] as GroupItem)?.items;
            if (!siblings) {
                return null;
            }

            const siblingKeys = siblings.map((key) => SurveyItemKey.fromFullKey(key));

            return <Fragment key={level}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>

                    <DropdownMenu>
                        <DropdownMenuTrigger
                            className="ring-offset-2 rounded-sm outline-none hover:ring-[3px] hover:ring-ring/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                        >
                            <span className="flex items-center gap-1 font-mono text-xs">
                                {levelKey.itemKey}
                                <span>
                                    <ChevronDownIcon className="size-4 text-muted-foreground" />
                                </span>
                            </span>

                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start"
                            className="border-border max-h-64 overflow-y-auto"
                        >
                            <DropdownMenuItem
                                onClick={() => navigateToItem(levelParentKey)}
                            >
                                <span className="flex items-center gap-2 text-xs">
                                    <CornerLeftUpIcon className="size-4 text-muted-foreground" />
                                    Select parent
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel className="text-xs">
                                Select sibling
                            </DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={selectedItemKey ?? undefined}
                                onValueChange={navigateToItem}>
                                {siblingKeys.map((key) => (
                                    <DropdownMenuRadioItem key={key.fullKey} value={key.fullKey}
                                        className="font-mono text-xs data-[state=checked]:bg-muted"
                                    >
                                        {key.itemKey}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>

                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => openAddItemDialog()}
                            >
                                <span className="flex items-center gap-2 text-xs">
                                    <PlusIcon className="size-4 text-muted-foreground" />
                                    Add new item
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </BreadcrumbItem>
            </Fragment>
        });
    }


    return (
        <div className="px-4 py-1.5 rounded-xl bg-white/70 backdrop-blur-xs border border-border w-fit">
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button
                                    className="ring-offset-2 rounded-sm outline-none hover:ring-[3px] hover:ring-ring/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                    onClick={() => navigateToItem(editor?.survey.surveyKey)}
                                >
                                    <span className="font-bold flex items-center gap-2 font-mono text-xs">
                                        <FolderTree className="size-4 text-muted-foreground" />
                                        {editor?.survey.surveyKey}
                                    </span>
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                Survey settings
                            </TooltipContent>
                        </Tooltip>
                    </BreadcrumbItem>
                    {getBreadcrumbItems(selectedItemKey)}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}

export default BreadcrumbsNav;
