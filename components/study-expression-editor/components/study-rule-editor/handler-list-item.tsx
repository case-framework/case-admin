import { ExpressionArg } from '@/components/expression-editor/utils';
import { Button } from '@/components/ui/button';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from '@/components/ui/context-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { BracketsIcon, ChevronRight, FileMinus2Icon, FilePlus2Icon, FlagIcon, GlobeIcon, LinkIcon, MailIcon, NotebookTextIcon, ShieldIcon } from 'lucide-react';
import React from 'react';

interface HandlerListItemProps {
    label?: string;
    actions?: ExpressionArg[];
    onSelect: () => void;
    onRemove: () => void;
}

const IconWithTooltip: React.FC<{ icon: React.ReactNode, tooltip: string, show: boolean }> = (props) => {
    if (!props.show) {
        return null;
    }
    return (
        <Tooltip>
            <TooltipTrigger className='px-1'>
                {props.icon}
            </TooltipTrigger>
            <TooltipContent align='center' side='top' sideOffset={-20}>
                {props.tooltip}
            </TooltipContent>
        </Tooltip>
    );
}

const checkIfActionsIncludeAny = (actions: undefined | ExpressionArg[], includes: string[]) => {
    if (actions === undefined || actions.length === 0) {
        return false;
    }
    const actionStr = JSON.stringify(actions);
    return includes.some(i => actionStr.includes(i));
}


const HandlerListItem: React.FC<HandlerListItemProps> = (props) => {
    return (
        <TooltipProvider>
            <ContextMenu>
                <ContextMenuTrigger asChild>

                    <Button
                        className='w-full h-auto min-h-12 rounded-none focus-visible:ring-0 focus-visible:bg-secondary justify-between'
                        variant={'ghost'}
                    >
                        <div>
                            <div className='font-mono text-xs font-bold text-start'>
                                {props.label}
                            </div>
                            <div className='flex items-center mt-1 ps-2'>
                                <IconWithTooltip
                                    icon={<BracketsIcon className='size-4 text-muted-foreground' />}
                                    tooltip='Empty handler'
                                    show={props.actions === undefined || props.actions.length === 0}
                                />
                                <IconWithTooltip
                                    icon={<MailIcon className='size-4 text-muted-foreground' />}
                                    tooltip='Logic for participant messages'
                                    show={checkIfActionsIncludeAny(props.actions, [
                                        'ADD_MESSAGE',
                                        'REMOVE_ALL_MESSAGES',
                                        'REMOVE_MESSAGES_BY_TYPE',
                                        'NOTIFY_RESEARCHER'
                                    ])}
                                />
                                <IconWithTooltip
                                    icon={<FilePlus2Icon className='size-4 text-muted-foreground' />}
                                    tooltip='Add new survey'
                                    show={checkIfActionsIncludeAny(props.actions, [
                                        'ADD_NEW_SURVEY'
                                    ])}
                                />
                                <IconWithTooltip
                                    icon={<FileMinus2Icon className='size-4 text-muted-foreground' />}
                                    tooltip='Remove survey'
                                    show={checkIfActionsIncludeAny(props.actions, [
                                        'REMOVE_ALL_SURVEYS',
                                        'REMOVE_SURVEYS_BY_KEY'
                                    ])}
                                />
                                <IconWithTooltip
                                    icon={<NotebookTextIcon className='size-4 text-muted-foreground' />}
                                    tooltip='Report handling'
                                    show={checkIfActionsIncludeAny(props.actions, [
                                        'INIT_REPORT',
                                        'CANCEL_REPORT',
                                        'UPDATE_REPORT_DATA',
                                        'REMOVE_REPORT_DATA'
                                    ])}
                                />
                                <IconWithTooltip
                                    icon={<FlagIcon className='size-4 text-muted-foreground' />}
                                    tooltip='Participant flags'
                                    show={checkIfActionsIncludeAny(props.actions, [
                                        'UPDATE_FLAG',
                                        'REMOVE_FLAG',
                                    ])}
                                />
                                <IconWithTooltip
                                    icon={<ShieldIcon className='size-4 text-muted-foreground' />}
                                    tooltip='Handling of confidential data'
                                    show={checkIfActionsIncludeAny(props.actions, [
                                        'REMOVE_CONFIDENTIAL_RESPONSE_BY_KEY',
                                        'REMOVE_ALL_CONFIDENTIAL_RESPONSES',
                                    ])}
                                />
                                <IconWithTooltip
                                    icon={<LinkIcon className='size-4 text-muted-foreground' />}
                                    tooltip='Linking codes / study codes'
                                    show={checkIfActionsIncludeAny(props.actions, [
                                        'SET_LINKING_CODE',
                                        'DELETE_LINKING_CODE',
                                        'DRAW_STUDY_CODE_AS_LINKING_CODE',
                                        'REMOVE_STUDY_CODE'
                                    ])}
                                />
                                <IconWithTooltip
                                    icon={<GlobeIcon className='size-4 text-muted-foreground' />}
                                    tooltip='External handlers'
                                    show={checkIfActionsIncludeAny(props.actions, [
                                        'EXTERNAL_EVENT_HANDLER',
                                    ])}
                                />
                            </div>
                        </div>
                        <div>
                            <ChevronRight className='size-4 text-muted-foreground' />
                        </div>
                    </Button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuItem onClick={props.onSelect}>
                        Open
                    </ContextMenuItem>
                    <ContextMenuItem onClick={props.onRemove}>
                        Remove
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </TooltipProvider >
    );
};

export default HandlerListItem;
