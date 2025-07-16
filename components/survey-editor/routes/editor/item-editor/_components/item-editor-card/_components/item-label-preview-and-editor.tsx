import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import React from 'react';

interface ItemLabelPreviewAndEditorProps {
    itemLabel: string;
    onChangeItemLabel: (newLabel: string) => void;
}

const ItemLabelPreviewAndEditor: React.FC<ItemLabelPreviewAndEditorProps> = (props) => {
    const [editMode, setEditMode] = React.useState(false);
    const [currentLabel, setCurrentLabel] = React.useState(props.itemLabel);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
        if (editMode && inputRef.current) {
            inputRef.current.focus();
        } else if (!editMode && buttonRef.current) {
            buttonRef.current.focus();
        }
    }, [editMode]);

    React.useEffect(() => {
        setCurrentLabel(props.itemLabel);
    }, [props.itemLabel]);

    const onChangeItemLabel = (newLabel: string) => {
        if (newLabel === props.itemLabel) {
            return;
        }
        props.onChangeItemLabel(newLabel);
    }

    if (!editMode) {
        return (
            <Tooltip
                delayDuration={350}
                disableHoverableContent={true}
            >
                <TooltipTrigger asChild>
                    <button
                        ref={buttonRef}
                        type='button'
                        className='font-medium text-base w-full text-center hover:underline underline-offset-4'
                        onClick={() => {
                            setEditMode(true);
                        }}
                    >
                        {currentLabel}
                        {currentLabel.length < 1 && <span className='text-muted-foreground text-xs'>
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
            defaultValue={currentLabel}
            ref={inputRef}
            onChange={(e) => {
                const value = e.target.value;
                setCurrentLabel(value);
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
                onChangeItemLabel(currentLabel);
            }}
            onKeyDown={(e) => {
                if (e.key === 'Escape') {
                    e.preventDefault();
                    setCurrentLabel(props.itemLabel);
                    setEditMode(false);
                }
                if (e.key === 'Enter') {
                    e.preventDefault();
                    onChangeItemLabel(currentLabel);
                    setEditMode(false);
                }
            }}
        />
    );
};

export default ItemLabelPreviewAndEditor;
