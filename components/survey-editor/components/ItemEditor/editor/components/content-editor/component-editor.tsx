import SortableItem from "@/components/survey-editor/components/general/SortableItem";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowLeftIcon, EllipsisVertical, GripVertical, Maximize2Icon, Minimize2Icon, SettingsIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { ItemComponent } from "survey-engine/data_types";

export interface ComponentEditorGenericProps {
    component: ItemComponent;
    isSelected?: boolean;
    usedKeys?: string[];
    onChange?: (comp: ItemComponent) => void;
}

interface ComponentEditorProps extends ComponentEditorGenericProps {
    isSortable?: boolean;
    isDragged?: boolean;
    previewContent: React.ComponentType<ComponentEditorGenericProps>;
    quickEditorContent?: React.ComponentType<ComponentEditorGenericProps>;
    advancedEditorContent?: React.ComponentType<ComponentEditorGenericProps>;
    contextMenuItems?: Array<{
        type: 'item';
        label: string;
        icon: React.ReactNode;
        disabled?: boolean;
        onClick: (item?: ItemComponent) => void;
    } | {
        type: 'separator';
    }>;
}

const ComponentEditor: React.FC<ComponentEditorProps> = (props) => {
    const [editorMode, setEditorMode] = useState<'quick' | 'advanced'>('quick');

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);
    const [isPreviewMenuOpen, setIsPreviewMenuOpen] = useState(false);
    const onDialogOpenChange = (open: boolean) => {
        setIsDialogOpen(open);
        if (open) {
            setIsPopoverOpen(false);
        }
    }

    const contentMenuContent = <DropdownMenuContent align='end'>
        {props.contextMenuItems?.map((item, index) => {
            if (item.type === 'separator') {
                return <DropdownMenuSeparator key={index} />
            }
            return <DropdownMenuItem key={index}
                disabled={item.disabled}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setIsPreviewMenuOpen(false);
                    item.onClick(props.component);
                    setIsPopoverOpen(false);
                    setIsDialogOpen(false);
                }}>
                {item.icon && <span className="text-muted-foreground mr-2 size-4" >
                    {item.icon}
                </span>}
                {item.label}
            </DropdownMenuItem>
        })}
    </DropdownMenuContent>

    const hasNoQuickEditor = props.quickEditorContent === undefined;

    let preview: React.ReactNode = <PopoverTrigger asChild>
        <button className={cn("relative w-full bg-background border border-border rounded-md px-3 py-2 group focus:outline focus:outline-2 focus:outline-primary/50 hover:outline hover:outline-2 hover:outline-primary/30", {
            "outline outline-2 outline-primary/50": isPopoverOpen || isPreviewMenuOpen
        })}
            onContextMenu={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (props.contextMenuItems) {
                    setIsPopoverOpen(false);
                    setIsPreviewMenuOpen(true);
                }
            }}
        >
            {(props.isSortable || props.isDragged) && <span className='absolute -left-4 top-0 hidden group-hover:flex items-center h-full'>
                <GripVertical className='size-4 text-muted-foreground' />
            </span>}

            {props.previewContent && <props.previewContent {...props} isSelected={props.isSelected || isPopoverOpen || isPreviewMenuOpen} />}

            {props.contextMenuItems && <DropdownMenu open={isPreviewMenuOpen && !props.isDragged && !isPopoverOpen} onOpenChange={setIsPreviewMenuOpen}>
                <DropdownMenuTrigger asChild>
                    <div className='absolute right-0 bottom-0 opacity-0'>
                    </div>
                </DropdownMenuTrigger>
                {contentMenuContent}
            </DropdownMenu>}
        </button>
    </PopoverTrigger>

    if (props.isSortable) {
        preview = <SortableItem
            id={props.component.key!}
            className={props.isDragged ? 'invisible' : ''}
        >
            {preview}
        </SortableItem>
    }

    const popoverOpenChange = (open: boolean) => {
        const hasNoAdvancedEditor = props.advancedEditorContent === undefined;
        const noPopoverContent = hasNoQuickEditor && hasNoAdvancedEditor;
        if (noPopoverContent) {
            setIsPopoverOpen(false);
            return;
        }
        if (open && hasNoQuickEditor) {
            setEditorMode('advanced');
        }
        setIsPopoverOpen(open);
    }

    const content = <div className="w-full">
        <Popover open={isPopoverOpen && !props.isDragged} onOpenChange={popoverOpenChange}>
            {preview}

            <PopoverContent
                className={cn("p-2", editorMode === 'advanced' && "w-fit max-w-[95vw] max-h-96 overflow-auto")}
                side="bottom"
                align="center"
            >
                {editorMode === 'quick' && <div className="space-y-1">
                    {props.contextMenuItems && <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <div className="bg-white rounded-md p-0 absolute -right-9 top-0 border border-border">
                                <Button variant="ghost" size="icon"
                                    className="h-8 w-7"
                                >
                                    <EllipsisVertical className="size-4" />
                                </Button>
                            </div>
                        </DropdownMenuTrigger>
                        {contentMenuContent}
                    </DropdownMenu>}
                    {props.quickEditorContent && <props.quickEditorContent {...props} />}

                    {props.advancedEditorContent &&
                        <Button
                            variant="ghost"
                            onClick={() => {
                                setEditorMode('advanced');
                            }}
                            className="text-xs w-full h-fit"
                        >
                            <span className="text-muted-foreground mr-1">
                                <SettingsIcon className="!size-3" />
                            </span> Show more settings...
                        </Button>
                    }
                </div>}
                {editorMode === 'advanced' && <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        {hasNoQuickEditor ? <span></span> : <Button
                            variant="ghost"
                            onClick={() => {
                                setEditorMode('quick');
                            }}
                        >
                            <span className="text-muted-foreground mr-1">
                                <ArrowLeftIcon className="!size-3" />
                            </span>
                            Back to quick editor
                        </Button>}
                        <div className="flex items-center">
                            {props.contextMenuItems && <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <EllipsisVertical className="size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                {contentMenuContent}
                            </DropdownMenu>}
                            <Button
                                variant="ghost"
                                onClick={() => {
                                    onDialogOpenChange(true);
                                }}
                            >
                                <Maximize2Icon className="size-4" />
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    {props.advancedEditorContent && <props.advancedEditorContent {...props} />}
                </div>}
            </PopoverContent>
        </Popover>

    </div>

    const dialog = <Dialog
        open={isDialogOpen && !props.isDragged} onOpenChange={onDialogOpenChange}
    >
        <DialogContent
            className="max-w-full w-[calc(100%-1rem)] h-[calc(100%-1rem)]"
            hideCloseBtn={true}
        >
            <DialogHeader>
                <DialogTitle className="flex justify-between items-center">
                    <span>
                        Component Editor
                    </span>
                    <div className="flex items-center">
                        {props.contextMenuItems && <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <EllipsisVertical className="size-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            {contentMenuContent}
                        </DropdownMenu>}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                                setIsDialogOpen(false);
                                setIsPopoverOpen(true);
                            }}
                        >
                            <Minimize2Icon className="size-4" />
                        </Button>
                        <DialogClose asChild>
                            <Button
                                variant="ghost"
                                size="icon"

                            >
                                <XIcon className="size-4" />
                            </Button>
                        </DialogClose>
                    </div>
                </DialogTitle>
                <Separator />
                <div className="grow">
                    {props.advancedEditorContent && <props.advancedEditorContent {...props} />}
                    {!props.advancedEditorContent && <div className="flex h-full py-8 justify-center items-center">
                        <p className="text-muted-foreground">No advanced editor content</p>
                    </div>}
                </div>
            </DialogHeader>
        </DialogContent>
    </Dialog>


    if (props.isSortable) {
        return <>
            {content}
            {dialog}
        </>
    }

    return <>
        {content}
        {dialog}
    </>
};
export default ComponentEditor;
