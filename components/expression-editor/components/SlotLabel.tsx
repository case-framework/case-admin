import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@/components/ui/context-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronRight } from "lucide-react";


const SlotLabel = (props: {
    label: string, required?: boolean,
    depth?: number,
    isHidden?: boolean, toggleHide?: () => void
    contextMenuContent?: React.ReactNode;
}) => {
    const canToggleHide = props.toggleHide !== undefined;
    const hasContextMenu = props.contextMenuContent !== undefined;

    const content = <div className={cn(
        'text-[12px] relative grow font-semibold text-slate-600 flex items-center group',
        '-mb-3 pb-4 z-1 rounded-t border border-transparent ',
        {
            'cursor-pointer hover:border-slate-300': canToggleHide || hasContextMenu,
            'hover:bg-slate-50  ': (canToggleHide || hasContextMenu) && (props.depth || 0) % 2 === 0,
            'hover:bg-slate-100': (canToggleHide || hasContextMenu) && (props.depth || 0) % 2 !== 0,
        }
    )}
        onClick={() => {
            if (props.toggleHide !== undefined) {
                props.toggleHide()
            }
        }}
    >

        {props.toggleHide !== undefined && <button
            className='me-1'
            type='button'
            onClick={(event) => {
                event.stopPropagation();
                if (props.toggleHide !== undefined) {
                    props.toggleHide()
                }
            }}
        >
            {!props.isHidden ? <ChevronDown /> : <ChevronRight />}
        </button>}
        <span className=''>{props.label}</span>
        {props.required && <span className='text-red-500 ms-1'>*</span>}
        <span className="grow"></span>
        {hasContextMenu && <span className="hidden group-hover:flex text-slate-500 font-normal pe-2">(right click for options)</span>}
    </div>

    if (!hasContextMenu) {
        return content;
    }

    return <ContextMenu>
        <ContextMenuTrigger>
            {content}
        </ContextMenuTrigger>

        <ContextMenuContent>
            {props.contextMenuContent}
        </ContextMenuContent>
    </ContextMenu>

}

export default SlotLabel;
