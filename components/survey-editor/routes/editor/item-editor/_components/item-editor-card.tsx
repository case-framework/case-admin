import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Edit3, Eye, Filter, MoreHorizontal, Palette } from "lucide-react";
import { Database } from "lucide-react";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useWindowSize } from "usehooks-ts";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import ItemLabelPreviewAndEditor from "@/components/survey-editor/routes/editor/item-editor/_components/item-label-preview-and-editor";
import { getItemColor, getItemTypeInfos } from "@/components/survey-editor/utils/item-type-infos";
import { useSurveyEditor } from "@/components/survey-editor/store/useSurveyEditor";
import { useItemNavigation } from "@/components/survey-editor/store/useItemNavigation";
import { GenericSurveyItemEditor } from "survey-engine/editor";
import ItemKeyEditor from "./item-key-editor";
import { toast } from "sonner";


const editorModes = [
    {
        id: "structure",
        label: "Structure",
        icon: Edit3,
        hasIndicator: false,
    },
    {
        id: "preview",
        label: "Preview",
        icon: Eye,
        hasIndicator: false,
    },
    {
        id: "conditions",
        label: "Conditions",
        icon: Filter,
        hasIndicator: true,
        indicatorCount: 3,
    },
    {
        id: "styling",
        label: "Styling",
        icon: Palette,
        hasIndicator: false,
    },
    {
        id: "data",
        label: "Data",
        icon: Database,
        hasIndicator: true,
        indicatorCount: 1,
    },
    {
        id: "settings",
        label: "Settings",
        icon: Settings,
        hasIndicator: false,
    },
]

const ItemEditorCard: React.FC = () => {
    const [activeMode, setActiveMode] = useState<string>("structure");
    const { width } = useWindowSize();
    const isMobile = width < 768;

    const { editor } = useSurveyEditor();
    const { navigateToItem } = useItemNavigation();
    let { selectedItemKey } = useItemNavigation();
    if (!selectedItemKey) {
        selectedItemKey = editor?.survey.surveyKey;
    }

    if (!editor || !selectedItemKey) {
        return null;
    }

    const surveyItem = editor?.survey.surveyItems[selectedItemKey];
    if (!surveyItem) {
        return <ItemEditorCardSkeleton />;
    }

    const itemInfos = {
        typeInfos: getItemTypeInfos(surveyItem),
        color: getItemColor(surveyItem)
    }

    return <div className="w-full flex flex-col md:flex-row gap-4 items-start relative">

        {/* Main Card */}
        <div className="w-full md:w-auto flex-1 border-border order-2 md:order-1 bg-background rounded-xl border border-border">

            {/* Header */}
            <div className="py-2 border-b border-border h-[37px] flex items-center">
                <div className="flex items-center justify-between relative w-full">
                    <div className="absolute px-4 rounded-s-lg left-0 top-0 bottom-0 flex items-center gap-2 justify-center bg-white">
                        <Tooltip
                            delayDuration={0}
                        >
                            <TooltipTrigger>
                                <div
                                    className={itemInfos.typeInfos.defaultItemClassName}
                                    style={{
                                        color: itemInfos.color
                                    }}>
                                    <itemInfos.typeInfos.icon
                                        className='size-5'
                                    />
                                </div>
                            </TooltipTrigger>
                            <TooltipContent align='start' side='bottom'

                            >
                                {itemInfos.typeInfos.label}
                            </TooltipContent>
                        </Tooltip>

                        <ItemKeyEditor
                            key={surveyItem.key.fullKey}
                            currentItemKey={surveyItem.key}
                            siblingKeys={new GenericSurveyItemEditor(editor!, selectedItemKey, surveyItem.itemType).getSiblingKeys()}
                            color={itemInfos.color ?? ''}
                            onChangeItemKey={(newKey) => {
                                const genericItemEditor = new GenericSurveyItemEditor(editor!, selectedItemKey, surveyItem.itemType)
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
                                const genericItemEditor = new GenericSurveyItemEditor(editor!, selectedItemKey, surveyItem.itemType)
                                genericItemEditor.updateItemMetadata(newMetadata)
                            }}
                        />
                    </div>
                </div>
            </div>



            <CardContent className="p-0 m-0">
                <Tabs value={activeMode} onValueChange={setActiveMode} className="w-full">
                    <div className="min-h-[400px]">
                        {/* All TabsContent sections remain exactly the same */}
                        <TabsContent value="structure" className="space-y-4">
                            todo: structure tab
                        </TabsContent>

                        <TabsContent value="preview" className="space-y-4">
                            <div className="border rounded-lg p-6 bg-background">
                                todo: preview tab
                            </div>
                        </TabsContent>

                        <TabsContent value="conditions" className="space-y-4">
                            todo: conditions tab
                        </TabsContent>

                        <TabsContent value="styling" className="space-y-4">
                            todo: styling tab
                        </TabsContent>

                        <TabsContent value="data" className="space-y-4">
                            todo: data tab
                        </TabsContent>

                        <TabsContent value="settings" className="space-y-4">
                            todo: settings tab
                        </TabsContent>
                    </div>
                </Tabs>
            </CardContent>
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
                                {editorModes.map((mode) => (
                                    <DropdownMenuItem key={mode.id}>{mode.label}</DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>

                    <Tabs
                        value={activeMode}
                        onValueChange={setActiveMode}
                        orientation={isMobile ? "horizontal" : "vertical"}
                    >
                        <TabsList className="flex rounded-s-none md:rounded-s-lg md:rounded-t-none  flex-row md:flex-col h-auto w-full bg-transparent p-0 md:space-y-1 space-x-1 md:space-x-0 focus-within:outline-none focus-within:ring-4 focus-within:ring-ring/30 overflow-hidden">

                            {editorModes.map((mode) => (
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

// Loading skeleton component that matches the ItemEditorCard structure
const ItemEditorCardSkeleton: React.FC = () => {
    return (
        <div className="w-full flex flex-col md:flex-row gap-4 items-start relative">
            {/* Main Card Skeleton */}
            <div className="w-full md:w-auto flex-1 border-border order-2 md:order-1 bg-background rounded-xl border border-border">

                {/* Header Skeleton */}
                <div className="py-2 border-b border-border h-[37px] flex items-center">
                    <div className="flex items-center justify-between relative w-full">
                        <div className="absolute px-4 rounded-s-lg left-0 top-0 bottom-0 flex items-center gap-2 justify-center bg-white">
                            {/* Icon skeleton */}
                            <Skeleton className="size-5 rounded-full" />
                            {/* Key badge skeleton */}
                            <Skeleton className="h-6 w-16 rounded-lg" />
                        </div>

                        {/* Label skeleton in center */}
                        <div className="text-center grow px-20">
                            <Skeleton className="h-4 w-32 mx-auto" />
                        </div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <CardContent className="p-0 m-0">
                    <div className="w-full">
                        <div className="min-h-[400px] p-6 space-y-6">
                            {/* Content area with multiple skeleton elements */}
                            <div className="space-y-4">
                                <Skeleton className="h-6 w-48" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Skeleton className="h-6 w-36" />
                                <div className="grid grid-cols-2 gap-4">
                                    <Skeleton className="h-20 w-full rounded-lg" />
                                    <Skeleton className="h-20 w-full rounded-lg" />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Skeleton className="h-6 w-24" />
                                <Skeleton className="h-32 w-full rounded-lg" />
                            </div>
                        </div>
                    </div>
                </CardContent>
            </div>

            {/* Floating Sidebar Skeleton */}
            <div className="relative md:sticky top-0 order-1 md:order-2 w-full md:w-fit flex justify-end">
                <Card className="shadow-none w-fit border-border p-0">
                    <CardContent className="p-0 flex flex-row md:flex-col">
                        {/* Menu button skeleton */}
                        <div className="border-r border-border md:border-b md:border-r-0">
                            <Skeleton className="size-9 rounded-s-xl md:rounded-s-none md:rounded-t-xl" />
                        </div>

                        {/* Tab buttons skeleton */}
                        <div className="flex flex-row md:flex-col">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className={cn(
                                        "size-9",
                                        i === 5 ? "rounded-e-xl md:rounded-e-none md:rounded-b-xl" : "rounded-none"
                                    )}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ItemEditorCard;
