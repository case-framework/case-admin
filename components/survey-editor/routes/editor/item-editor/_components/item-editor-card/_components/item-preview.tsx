import { GroupItem, Survey, SurveyEngineCore, SurveyItem, SurveyItemType } from "survey-engine";
import { useRef, useEffect, useState, useCallback } from "react";
import html2canvas from 'html2canvas-pro';
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle, Loader, Edit3, Copy, CircleEllipsis } from "lucide-react";
import { cn } from "@/lib/utils";
import { SurveyContextProvider } from "@/components/survey-renderer/survey-context";
import SurveyItemRenderer from "@/components/survey-renderer/SurveySingleItemView/survey-item";
import { useSurveyEditor } from "@/components/survey-editor/store/useSurveyEditor";
import { useItemNavigation } from "@/components/survey-editor/store/useItemNavigation";
import ItemTypeIconWithTooltip from "./item-type-icon-with-tooltip";
import { getItemColor } from "@/components/survey-editor/utils/item-type-infos";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { DeleteItemDropdownMenuItem } from "./delete-item-dropdown-menu";
import { toast } from "sonner";

interface ItemPreviewProps {
    item: SurveyItem | undefined;
}


const ItemPreview = ({ item }: ItemPreviewProps) => {
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const rendererRef = useRef<HTMLDivElement>(null);
    const isMountedRef = useRef(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
    const { editor } = useSurveyEditor();
    const { navigateToItem } = useItemNavigation();

    const [surveyEngine] = useState<SurveyEngineCore>(new SurveyEngineCore(
        editor?.survey ?? new Survey(),
        undefined,
        []
    ));

    // Cleanup on unmount
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);

    const generateImage = useCallback(async () => {
        if (!rendererRef.current || !item || !isMountedRef.current) {
            return;
        }

        // Cancel any existing operation
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller for this operation
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        if (!isMountedRef.current) return;
        setIsGenerating(true);
        setError(null);

        try {
            // Check if operation was aborted
            if (signal.aborted) return;

            // Make the element temporarily visible for capture
            const element = rendererRef.current;
            if (!element || !isMountedRef.current) return;

            const originalStyle = {
                position: element.style.position,
                left: element.style.left,
                top: element.style.top,
                opacity: element.style.opacity,
                pointerEvents: element.style.pointerEvents,
            };

            // Move to visible area temporarily
            element.style.position = 'fixed';
            element.style.left = '0px';
            element.style.top = '0px';
            element.style.opacity = '1';
            element.style.pointerEvents = 'none';
            element.style.zIndex = '9999';

            // Wait for render with abort check
            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    if (signal.aborted) {
                        reject(new Error('Operation aborted'));
                    } else {
                        resolve();
                    }
                }, 300);

                signal.addEventListener('abort', () => {
                    clearTimeout(timeout);
                    reject(new Error('Operation aborted'));
                });
            });

            // Check if still mounted and not aborted
            if (!isMountedRef.current || signal.aborted) {
                // Restore styles before returning
                element.style.position = originalStyle.position;
                element.style.left = originalStyle.left;
                element.style.top = originalStyle.top;
                element.style.opacity = originalStyle.opacity;
                element.style.pointerEvents = originalStyle.pointerEvents;
                element.style.zIndex = '';
                return;
            }

            const canvas = await html2canvas(element, {
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#ffffff',
                scale: 1,
            });

            // Restore original styles
            element.style.position = originalStyle.position;
            element.style.left = originalStyle.left;
            element.style.top = originalStyle.top;
            element.style.opacity = originalStyle.opacity;
            element.style.pointerEvents = originalStyle.pointerEvents;
            element.style.zIndex = '';

            // Check if still mounted before setting state
            if (!isMountedRef.current || signal.aborted) return;

            const imageUrl = canvas.toDataURL('image/png');
            setGeneratedImageUrl(imageUrl);
        } catch (err) {
            // Don't log errors if operation was aborted or component unmounted
            if (!signal.aborted && isMountedRef.current) {
                console.error('Error generating image:', err);
                setError('Failed to generate image preview');
            }
        } finally {
            // Only update state if component is still mounted
            if (isMountedRef.current && !signal.aborted) {
                setIsGenerating(false);
            }
        }
    }, [item]);

    // Auto-generate image when item changes
    useEffect(() => {
        // Cancel any ongoing generation when item changes
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        if (item && isMountedRef.current) {
            // Small delay to ensure component is mounted
            const timer = setTimeout(() => {
                if (isMountedRef.current) {
                    generateImage();
                }
            }, 200);
            return () => clearTimeout(timer);
        } else {
            if (isMountedRef.current) {
                setGeneratedImageUrl(null);
                setError(null);
            }
        }
    }, [item, generateImage]);

    const title = (
        <h3 className="text-sm font-medium">Item Preview</h3>
    )

    if (!item) {
        return (
            <div>
                {title}
                <div className="flex items-center justify-center h-32 text-center text-muted-foreground">
                    <p className="text-sm">No item selected</p>
                </div>
            </div>
        );
    }

    const itemInfos = (
        <div className="text-sm text-muted-foreground flex items-center gap-2">
            <ItemTypeIconWithTooltip item={item} iconClassName="size-5" />
            <p className="font-mono grow"
                style={{
                    color: getItemColor(item)
                }}
            >{item.key.fullKey}</p>

            <p className="text-muted-foreground font-medium">
                {item.metadata?.itemLabel}
            </p>
        </div>
    )

    if (item.itemType === SurveyItemType.PageBreak) {
        return (
            <div className="space-y-4">
                {title}
                {itemInfos}
            </div>
        )
    }

    const itemRenderer = () => {
        if (item.itemType === SurveyItemType.Group) {
            return (
                <div className="flex grow justify-center items-center text-center text-white text-6xl px-12 py-24 rounded-3xl"
                    style={{
                        backgroundColor: getItemColor(item)
                    }}
                >
                    <div>
                        Group with {(item as GroupItem).items?.length || 0} items.
                    </div>
                </div>
            )
        }

        return (<div className='max-w-[832px] w-full mx-auto space-y-6 survey'>
            <SurveyContextProvider
                survey={surveyEngine.survey}
                onRunExternalHandler={undefined}
                locale={selectedLanguage}
                surveyEngine={surveyEngine}
            >
                <SurveyItemRenderer
                    item={surveyEngine.getRenderedSurveyItem(item.key.fullKey)!}
                />
            </SurveyContextProvider>
        </div>)
    }


    return (
        <div className="space-y-4 relative">
            {title}
            {itemInfos}

            {/* Hidden renderer for image generation */}
            <div
                ref={rendererRef}
                className="absolute !-left-[9999px] !-top-[9999px] pointer-events-none w-[1000px]"
            >
                {itemRenderer()}
            </div>

            {/* Generated image display - Square container */}
            <div className="border border-border shadow-sm rounded-lg overflow-y-auto bg-white max-w-[300px] mx-auto aspect-square flex flex-col justify-center">
                <div className="">
                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-red-600 bg-red-50">
                            <AlertCircle className="h-4 w-4 mb-2" />
                            <p className="text-sm">{error}</p>
                        </div>
                    )}

                    {isGenerating && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Loader className="size-5 animate-spin mb-2" />
                            <p className="text-sm text-muted-foreground">Generating preview...</p>
                        </div>
                    )}

                    {generatedImageUrl && !isGenerating && (
                        <div className="w-full h-full overflow-y-auto p-2">
                            <img
                                src={generatedImageUrl}
                                alt={`Preview of ${item.key.fullKey}`}
                                className="w-full h-auto rounded"
                            />
                        </div>
                    )}

                    {!generatedImageUrl && !isGenerating && !error && (
                        <div className="flex flex-col items-center justify-center text-muted-foreground">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={generateImage}
                                disabled={isGenerating}
                            >
                                <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
                                {isGenerating ? "Generating..." : "Regenerate"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-4 w-fit mx-auto">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        if (item) {
                            navigateToItem(item.key.fullKey);
                        }
                    }}
                    className="flex flex-col gap-1 h-auto py-2"
                >
                    <Edit3 className="size-4" />
                    <span className="text-xs">Open item</span>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex flex-col gap-1 h-auto py-2"
                        >
                            <CircleEllipsis className="size-4" />
                            <span className="text-xs">More</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border-border">
                        <DropdownMenuItem
                            onClick={() => {
                                if (item && editor) {
                                    const copiedItem = editor.copyItem(item.key.fullKey);

                                    console.log(copiedItem);

                                    navigator.clipboard.writeText(JSON.stringify(copiedItem, null, 2))
                                        .then(() => {
                                            toast.success("Item copied to clipboard");
                                        })
                                        .catch(() => {
                                            toast.error("Failed to copy item");
                                        });
                                }
                            }}
                        >
                            <Copy className="size-4 mr-2" />
                            Copy
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DeleteItemDropdownMenuItem overrideItemKey={item.key.fullKey} />
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>


        </div>
    );
}

export default ItemPreview;
