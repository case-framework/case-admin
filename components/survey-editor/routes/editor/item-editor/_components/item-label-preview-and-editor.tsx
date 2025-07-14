import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import React from 'react';

interface ItemLabelPreviewAndEditorProps {
    itemLabel: string;
    onChangeItemLabel: (newLabel: string) => void;
}

const ItemLabelPreviewAndEditor: React.FC<ItemLabelPreviewAndEditorProps> = (props) => {
    const [editMode, setEditMode] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (editMode && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editMode]);

    if (!editMode) {
        return (
            <Tooltip
                delayDuration={350}
                disableHoverableContent={true}
            >
                <TooltipTrigger asChild>
                    <button
                        type='button'
                        className='font-medium text-base w-full text-center hover:underline underline-offset-4'
                        onClick={() => {
                            setEditMode(true);
                        }}
                    >
                        {props.itemLabel}
                        {props.itemLabel.length < 1 && <span className='text-muted-foreground text-xs'>
                            {'(click here to add item label)'}
                        </span>}
                    </button>
                </TooltipTrigger>
                <TooltipContent side='bottom' align='center'>
                    Click to edit
                </TooltipContent>
            </Tooltip>
        )
    }

    return (
        <input
            defaultValue={props.itemLabel}
            ref={inputRef}
            onChange={(e) => {
                const value = e.target.value;
                props.onChangeItemLabel(value);
            }}
            id='new-item-label'
            autoComplete='off'
            className={cn(
                'w-full text-center font-medium focus:border-none px-1 py-1 h-auto text-base bg-transparent border-none',
                'rounded-t-lg focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30',
                {
                    'hidden': !editMode,
                })}
            disabled={!editMode}
            placeholder='Enter item label'
            onBlur={() => {
                setEditMode(false);
            }}
            onKeyDown={(e) => {
                if (e.key === 'Escape') {
                    setEditMode(false);
                }
            }}
        />
    );
};

export default ItemLabelPreviewAndEditor;
