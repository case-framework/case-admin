import { useSurveyEditor } from "@/components/survey-editor/store/useSurveyEditor";
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ChevronDownIcon, FolderOpenIcon, FolderTree, PlusIcon } from "lucide-react";
import { useItemNavigation } from "../../../../../store/useItemNavigation";
import { GroupItem, SurveyItemKey, SurveyItemType } from "survey-engine";
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenu, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Fragment } from "react";
import { useItemEditor } from "../item-editor-context";

const BreadcrumbNavButton: React.FC<{ itemKey: string, children: React.ReactNode }> = ({ itemKey, children }) => {
    const { navigateToItem } = useItemNavigation();
    return (
        <button
            className="ring-offset-2 rounded-sm outline-none hover:ring-[3px] hover:ring-ring/50 focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
            onClick={() => navigateToItem(itemKey)}
        >
            {children}
        </button>
    );
}


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

        const levelCount = levels.length;

        return levels.map((level, index) => {
            const isLastLevel = index === levelCount - 1;
            const levelKey = SurveyItemKey.fromFullKey(level);
            const levelParentKey = levelKey.parentFullKey;

            if (!levelParentKey) {
                return null;
            }

            const siblings = (editor?.survey.surveyItems[levelParentKey] as GroupItem)?.items;
            if (!siblings) {
                return null;
            }

            const siblingKeys = siblings.map((key) => SurveyItemKey.fromFullKey(key)).filter((key) => editor?.survey.surveyItems[key.fullKey].itemType !== SurveyItemType.PageBreak);

            return <Fragment key={level}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                    {!isLastLevel ? (
                        <BreadcrumbNavButton itemKey={level}>
                            <span className="font-bold flex items-center gap-2 font-mono text-xs">
                                <FolderOpenIcon className="size-4 text-muted-foreground" />
                                {levelKey.itemKey}
                            </span>
                        </BreadcrumbNavButton>
                    ) : (

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
                                    onClick={() => openAddItemDialog(levelParentKey)}
                                >
                                    <span className="flex items-center gap-2 text-xs">
                                        <PlusIcon className="size-4 text-muted-foreground" />
                                        Add new sibling
                                    </span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
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
                                <BreadcrumbNavButton itemKey={editor?.survey.surveyKey ?? ''}>
                                    <span className="font-bold flex items-center gap-2 font-mono text-xs">
                                        <FolderTree className="size-4 text-muted-foreground" />
                                        {editor?.survey.surveyKey}
                                    </span>
                                </BreadcrumbNavButton>
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
