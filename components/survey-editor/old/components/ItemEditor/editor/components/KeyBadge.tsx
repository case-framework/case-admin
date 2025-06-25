import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { PopoverClose } from "@radix-ui/react-popover";
import { Check, RotateCcw, X } from "lucide-react";
import React, { useEffect } from "react";
import { MouseEventHandler } from "react";

export const KeyBadge = (props: { itemKey: string, isHighlighted: boolean, highlightColor?: string, onClick?: MouseEventHandler<HTMLDivElement> | undefined }) => {
    return (
        <Badge
            onClick={props.onClick}
            variant={props.isHighlighted ? 'default' : 'outline'}
            className={cn("h-auto border-2 py-0 w-full flex justify-center", {
                "hover:opacity-80": props.isHighlighted,
            })}
            style={{ backgroundColor: props.highlightColor }}
        >
            {props.itemKey}
        </Badge>
    );
}

export const KeyBadgeAndType = (props: { compKey?: string, type: string }) => {
    return <div className='text-xs font-semibold flex justify-between w-full'>
        <KeyBadge itemKey={props.compKey ?? ''} isHighlighted={false} />
        <span className='text-muted-foreground'>
            {props.type}
        </span>
    </div>
}

export const PopoverKeyBadge: React.FC<{
    allOtherKeys: string[],
    itemKey: string,
    isHighlighted?: boolean,
    highlightColor?: string,
    headerText?: string,
    className?: string,
    onClick?: MouseEventHandler<HTMLDivElement> | undefined,
    onKeyChange?: (newKey: string) => void,
}> = (props) => {
    const popoverCloseRef = React.useRef<HTMLButtonElement>(null);
    const [currentKey, setCurrentKey] = React.useState<string>(props.itemKey);
    const [error, setError] = React.useState<string | null>(null);
    const isValidKey = error === null;
    const hasChanges = currentKey !== props.itemKey;
    const headerText = props.headerText ?? 'Item Key';

    const [isOpen, setIsOpen] = React.useState(false);

    useEffect(() => {
        if (currentKey.length <= 0) {
            setError("Key must not be empty.");
            return;
        } else if (props.allOtherKeys.includes(currentKey)) {
            setError("Key already exists.");
            return;
        } else if (currentKey.includes('.')) {
            setError("Key must not contain a dot.");
            return;
        } else {
            setError(null);
            return;
        }
    }, [currentKey, props.allOtherKeys]);

    const handleKeyChange = (e: React.MouseEvent | React.KeyboardEvent) => {
        if (!isValidKey) return;
        e.stopPropagation();
        e.preventDefault();
        if (currentKey !== props.itemKey && props.onKeyChange) props.onKeyChange(currentKey);
        popoverCloseRef.current?.click();
    }

    return <Popover
        open={isOpen}
        onOpenChange={(open) => {
            setIsOpen(open);
            if (open) {
                setCurrentKey(props.itemKey)
            }
        }}
    >
        <PopoverTrigger className={cn("flex items-center justify-center", props.className)}
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsOpen(prev => !prev);
            }}
        >
            <KeyBadge itemKey={props.itemKey}
                isHighlighted={props.isHighlighted || isOpen}
                highlightColor={props.highlightColor}
                onClick={(e) => {
                    if (props.onClick != undefined) {
                        props.onClick(e);
                    }
                }} />
        </PopoverTrigger>
        <PopoverContent className="max-w-80 relative"
            side='right'
            align="start"
            alignOffset={12}
            data-no-dnd="true"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
            }}
        >
            <div className="flex flex-col gap-2 w-full">

                <PopoverClose
                    ref={popoverCloseRef}
                    className='absolute top-2 right-2 rounded-full p-1 hover:bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background'
                >
                    <X className='size-4' />
                </PopoverClose>

                <div className="flex flex-row gap-2 items-end">
                    <Label htmlFor="keyInput" className='text-sm font-semibold space-y-2'>
                        <span className="mb-1.5">
                            {headerText}
                        </span>
                        <Input
                            id="keyInput"
                            className='w-full select-text'
                            value={currentKey}
                            placeholder="Enter a key..."
                            autoFocus
                            autoComplete="off"
                            onChange={(e) => {
                                setCurrentKey(e.target.value.trim());
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleKeyChange(e);
                                }
                            }}
                        />
                    </Label>
                    <Button
                        disabled={!hasChanges}
                        className="shrink-0"
                        size={'icon'}
                        variant={'outline'}
                        onClick={() => {
                            setCurrentKey(props.itemKey)
                        }}
                    >
                        <RotateCcw className='size-4 text-muted-foreground' />
                    </Button>
                    <Button
                        className="shrink-0"
                        size={'icon'}
                        variant={'outline'}
                        disabled={!isValidKey || !hasChanges}
                        onClick={handleKeyChange}
                    >
                        <Check className='size-4 text-muted-foreground' color="green" />
                    </Button>
                </div>
                {error && <span className='text-xs grow text-red-800'>{error}</span>}
            </div>
        </PopoverContent>
    </Popover>;
}
