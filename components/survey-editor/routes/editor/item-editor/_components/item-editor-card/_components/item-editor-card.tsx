import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LucideIcon, MoreHorizontal, Palette } from "lucide-react";
import { useState } from "react";
import { useWindowSize } from "usehooks-ts";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ItemLabelPreviewAndEditor from "@/components/survey-editor/routes/editor/item-editor/_components/item-editor-card/_components/item-label-preview-and-editor";
import { getItemColor, getItemTypeInfos, builtInItemColors } from "@/components/survey-editor/utils/item-type-infos";
import { useSurveyEditor } from "@/components/survey-editor/store/useSurveyEditor";
import { useItemNavigation } from "@/components/survey-editor/store/useItemNavigation";
import { GenericSurveyItemEditor } from "survey-engine/editor";
import ItemKeyEditor from "./item-key-editor";
import { toast } from "sonner";
import { SurveyItem } from "survey-engine";
import { DeleteItemDropdownMenuItem } from "./delete-item-dropdown-menu";
import ItemTypeIconWithTooltip from "./item-type-icon-with-tooltip";


export interface CommonItemEditorCardProps {
    item: SurveyItem;
}

interface NavItem {
    id: string;
    label: string;
    icon: LucideIcon;
}

interface ItemEditorCardProps {
    surveyItem: SurveyItem;
    menu: {
        hideColorSelector?: boolean;
        items: React.ReactNode[];
        hideDeleteItem?: boolean;
    }
    navItems: NavItem[];
    children: React.ReactNode;
}

const ItemEditorCard: React.FC<ItemEditorCardProps> = ({
    surveyItem,
    ...props
}) => {
    const [activeMode, setActiveMode] = useState<string>("");
    const { width } = useWindowSize();
    const isMobile = width < 768;

    const { editor } = useSurveyEditor();
    const { navigateToItem } = useItemNavigation();

    if (!editor) {
        return null;
    }

    if (props.navItems.length > 0) {
        if (!props.navItems.some(item => item.id === activeMode)) {
            setActiveMode(props.navItems[0].id);
        }
    }

    const itemInfos = {
        typeInfos: getItemTypeInfos(surveyItem),
        color: getItemColor(surveyItem)
    }

    return <div className="w-full flex flex-col md:flex-row gap-4 items-start relative">

        {/* Main Card */}
        <div className="w-full md:w-auto flex-1 order-2 md:order-1 bg-background rounded-xl border border-border">

            {/* Header */}
            <div className="py-2 border-b border-border h-[37px] flex items-center">
                <div className="flex items-center justify-between relative w-full">
                    <div className="absolute px-4 rounded-s-lg left-0 top-0 bottom-0 flex items-center gap-2 justify-center bg-white">
                        <ItemTypeIconWithTooltip item={surveyItem} iconClassName="size-5" />

                        <ItemKeyEditor
                            key={surveyItem.key.fullKey}
                            currentItemKey={surveyItem.key}
                            siblingKeys={new GenericSurveyItemEditor(editor!, surveyItem.key.fullKey, surveyItem.itemType).getSiblingKeys()}
                            color={itemInfos.color ?? ''}
                            onChangeItemKey={(newKey) => {
                                const genericItemEditor = new GenericSurveyItemEditor(editor!, surveyItem.key.fullKey, surveyItem.itemType)
                                genericItemEditor.changeItemKey(newKey.itemKey);
                                navigateToItem(newKey.fullKey);
                                toast.success('Key and its references updated.');
                            }}
                        />
                    </div>

                    <div className="text-center grow">
                        <ItemLabelPreviewAndEditor
                            key={surveyItem.key.fullKey}
                            itemLabel={surveyItem.metadata?.itemLabel ?? ''}
                            onChangeItemLabel={(newLabel: string) => {
                                const newMetadata = {
                                    ...surveyItem.metadata,
                                    itemLabel: newLabel
                                }
                                const genericItemEditor = new GenericSurveyItemEditor(editor!, surveyItem.key.fullKey, surveyItem.itemType)
                                genericItemEditor.updateItemMetadata(newMetadata)
                            }}
                        />
                    </div>
                </div>
            </div>


            <Tabs value={activeMode} onValueChange={setActiveMode} className="min-h-[400px] grow flex flex-col w-full">
                {props.children}
            </Tabs>
        </div>


        {/* Floating Responsive Tab Sidebar */}
        <div className="relative md:sticky top-0 order-1 md:order-2 w-full md:w-fit flex justify-end">
            <Card className="shadow-none w-fit border-border p-0">
                <CardContent className="p-0 flex flex-row md:flex-col">
                    <div className="border-r border-border md:border-b md:border-r-0">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost"
                                    className="rounded-none size-9 rounded-s-xl md:rounded-s-none md:rounded-t-xl">
                                    <MoreHorizontal className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="left" align="start"
                                className="border-border"
                            >
                                {!props.menu.hideColorSelector && (
                                    <>
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger>
                                                <Palette className="mr-2 h-4 w-4" />
                                                <span>Item color (editor only)</span>
                                            </DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent className="border-border">
                                                <ItemColorSelector
                                                    currentColor={itemInfos.color || '#404040'}
                                                    onColorChange={(color) => {
                                                        const genericItemEditor = new GenericSurveyItemEditor(editor!, surveyItem.key.fullKey, surveyItem.itemType)
                                                        genericItemEditor.updateItemMetadata({
                                                            ...surveyItem.metadata,
                                                            editorItemColor: color
                                                        })
                                                        toast.success('Item color updated.');
                                                    }}
                                                />
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>

                                        <DropdownMenuSeparator />
                                    </>
                                )}



                                {...props.menu.items}

                                {!props.menu.hideDeleteItem && (
                                    <>
                                        {props.menu.items.length > 0 && (
                                            <DropdownMenuSeparator />
                                        )}
                                        <DeleteItemDropdownMenuItem />
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>

                    <Tabs
                        value={activeMode}
                        onValueChange={setActiveMode}
                        orientation={isMobile ? "horizontal" : "vertical"}
                    >
                        <TabsList className="flex rounded-s-none md:rounded-s-lg md:rounded-t-none  flex-row md:flex-col h-auto w-full bg-transparent p-0 md:space-y-1 space-x-1 md:space-x-0 focus-within:outline-none focus-within:ring-4 focus-within:ring-ring/30 overflow-hidden">

                            {props.navItems.map((mode) => (
                                <Tooltip key={mode.id}>
                                    <TooltipTrigger asChild>
                                        <TabsTrigger
                                            key={mode.id}
                                            value={mode.id}
                                            className={cn(
                                                "relative rounded-none min-h-9 w-9 p-0 flex flex-col items-center justify-center hover:bg-muted/50 transition-colors focus:outline-none focus-visible:outline-none",
                                                {
                                                    "bg-primary text-primary-foreground hover:bg-primary/90": activeMode === mode.id,
                                                }
                                            )}
                                            title={mode.label}
                                        >
                                            <mode.icon className="size-4" />
                                        </TabsTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent align="center" side={isMobile ? "bottom" : "left"}>
                                        {mode.label}
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                        </TabsList>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    </div>
}



// Color Selector Component
const ItemColorSelector: React.FC<{ currentColor: string; onColorChange: (color: string) => void }> = ({ currentColor, onColorChange }) => {
    return (
        <div className="grid grid-cols-4 gap-2 p-2">
            {builtInItemColors.map((color) => (
                <Button
                    key={color}
                    variant="ghost"
                    size="sm"
                    className={cn(
                        "w-8 h-8 p-0 rounded-md border-2 hover:scale-110 transition-all",
                        currentColor === color
                            ? "border-foreground ring-2 ring-foreground ring-offset-1"
                            : "border-transparent hover:border-muted-foreground"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => onColorChange(color)}
                    title={`Color: ${color}`}
                />
            ))}
        </div>
    );
};

export default ItemEditorCard;
