import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Edit3, Eye, Filter, MoreHorizontal, Palette } from "lucide-react";
import { Database } from "lucide-react";
import { Settings } from "lucide-react";
import { useState } from "react";
import { useWindowSize } from "usehooks-ts";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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

    return <div className="w-full max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-start relative">

        {/* Main Card */}
        <Card className="w-full md:w-auto flex-1 border-border order-2 md:order-1">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold">Home Page</h3>
                        <p className="text-sm text-muted-foreground">Edit your page structure and content</p>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        <div className="size-2 rounded-full bg-green-500 mr-1" />
                        Published
                    </Badge>
                </div>
            </CardHeader>

            <CardContent>
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
        </Card>


        {/* Floating Responsive Tab Sidebar */}
        <div className="relative md:sticky top-0 order-1 md:order-2 w-full md:w-fit flex justify-end">
            <Card className="shadow-sm w-fit border-border p-0">
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

export default ItemEditorCard;
