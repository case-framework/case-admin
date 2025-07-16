import { cn } from "@/lib/utils";
import { SurveyItemKey } from "survey-engine";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CheckIcon, X } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ItemKeyEditorProps {
    currentItemKey: SurveyItemKey;
    color: string;
    siblingKeys: SurveyItemKey[];
    onChangeItemKey: (newKey: SurveyItemKey) => void;
}

const ItemKeyEditor: React.FC<ItemKeyEditorProps> = (props) => {
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [tempKey, setTempKey] = useState(props.currentItemKey.itemKey);
    const [showValidationMessage, setShowValidationMessage] = useState(false);

    useEffect(() => {
        if (isPopoverOpen) {
            setShowValidationMessage(false);
        }
    }, [isPopoverOpen]);

    const handleSaveKey = () => {
        const newKey = tempKey.trim().replace(/\s+/g, '');
        if (newKey && newKey !== props.currentItemKey.itemKey) {
            const newKeyObj = new SurveyItemKey(
                newKey,
                props.currentItemKey.parentFullKey,
            )
            props.onChangeItemKey(newKeyObj);
        }
        setIsPopoverOpen(false);
    };

    const handleCancelEdit = () => {
        setTempKey(props.currentItemKey.itemKey);
        setIsPopoverOpen(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        setShowValidationMessage(true);
        if (e.key === 'Enter') {
            handleSaveKey();
        } else if (e.key === 'Escape') {
            handleCancelEdit();
        }
    };

    const validationMessage = () => {
        if (tempKey === props.currentItemKey.itemKey) {
            return 'Key is the same as the current key';
        }
        if (props.siblingKeys.some(key => key.itemKey === tempKey)) {
            return 'Key already exists in the group, cannot use duplicate keys.';
        }
        if (tempKey.includes('.')) {
            return 'Key cannot contain dots';
        }
        if (tempKey.includes(' ')) {
            return 'Key cannot contain spaces';
        }
        if (tempKey.length === 0) {
            return 'Key cannot be empty';
        }
        return null;
    }

    return (
        <div>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <PopoverTrigger asChild>
                            <button
                                className={cn("h-auto text-white rounded-lg text-sm px-3 border-2 w-full flex justify-center cursor-pointer hover:opacity-80 transition-opacity")}
                                style={{ backgroundColor: props.color }}
                            >
                                {props.currentItemKey.itemKey}
                            </button>
                        </PopoverTrigger>
                    </TooltipTrigger>
                    <TooltipContent side='bottom'>
                        <div className="text-xs">
                            <p>
                                Full item key: <span className="font-mono">{props.currentItemKey.keyParts.join('.')}</span>
                            </p>
                            <p>
                                (click to edit)
                            </p>
                        </div>
                    </TooltipContent>
                </Tooltip>
                <PopoverContent className="w-80 border-border"
                    side='bottom'
                    align='start'
                >

                    <Button
                        variant='ghost'
                        size='icon'
                        className='absolute top-2 right-2 rounded-full p-1 hover:bg-muted/50 focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background'
                        onClick={handleCancelEdit}
                    >
                        <X className='size-4' />
                    </Button>

                    <div className="">

                        {
                            props.currentItemKey.isRoot ? (
                                <p className="text-xs text-muted-foreground">
                                    Survey root item
                                </p>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    Parent full key: <span className="font-mono">{props.currentItemKey.parentFullKey}</span>
                                </p>
                            )
                        }

                        <div className="flex gap-2 items-end mt-2 mb-1">
                            <div className="flex flex-col gap-2 w-full">
                                <Label
                                    htmlFor="keyInput"
                                    className='text-sm font-semibold space-y-2'
                                >
                                    <span>
                                        Edit item key
                                    </span>
                                </Label>
                                <Input
                                    id="keyInput"
                                    value={tempKey}
                                    onChange={(e) => setTempKey(e.target.value)}
                                    onKeyDown={handleKeyPress}
                                    placeholder="Enter new key"
                                    autoFocus
                                />
                            </div>

                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleSaveKey}
                                disabled={validationMessage() !== null}
                            >
                                <CheckIcon className="size-5 text-green-600" />
                            </Button>

                        </div>
                        {
                            (showValidationMessage && validationMessage()) && (
                                <p className="text-xs text-red-600 font-medium">{validationMessage()}</p>
                            )
                        }
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default ItemKeyEditor;
