import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider } from '@/components/ui/sidebar';
import { ArrowLeftIcon, MoreVerticalIcon, SaveIcon, UploadIcon, XIcon } from 'lucide-react';
import React from 'react';
import { useStudyExpressionEditor } from '../../study-expression-editor-context';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { toast } from 'sonner';
import LoadContextFromDisk from './load-context-from-disk';
import EditorCard from './editor-card';
import { KeyValuePairDefs, StudyContext } from '../../types';
import ItemEditor from './item-editor';


const Overview: React.FC = () => {
    const [openLoadContextDialog, setOpenLoadContextDialog] = React.useState(false);
    const { changeView, currentName, currentStudyContext, updateCurrentStudyContext } = useStudyExpressionEditor();

    const [selection, setSelection] = React.useState<{
        index: number;
        attributeKey: string;
    } | undefined>(undefined);


    const closeEditor = () => {
        setSelection(undefined);
    }

    const saveContextToFile = () => {
        if (!currentStudyContext) {
            toast.error('No context to save');
            return;
        }

        const contextStr = JSON.stringify(currentStudyContext, null, 2);
        const blob = new Blob([contextStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);

        const prefix = 'study-context';

        const fileName = `${prefix}${currentName ? ('_' + currentName) : ''}.json`;

        link.download = fileName;
        link.click();

        toast.success('Study context saved to disk', {
            description: fileName
        });
    }

    const itemEditorOpen = selection !== undefined;

    return (
        <SidebarProvider
            open={itemEditorOpen}
            onOpenChange={(open) => {
                if (!open) {
                    setSelection(undefined);
                }
            }}
            style={{
                "--sidebar-width": "25rem",
                "--sidebar-width-mobile": "20rem",
            } as React.CSSProperties}
        >
            <main className='overflow-y-scroll @container w-full p-6 pt-2'>
                <div className='flex justify-between gap-2 items-center py-2'>
                    <Button
                        variant={'ghost'}
                        onClick={() => {
                            changeView('expression-editor')
                        }}
                    >
                        <span><ArrowLeftIcon className='size-4' /></span>
                        Exit context editor
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={'outline'}
                                size={'sm'}
                            >
                                <span>Options</span>
                                <MoreVerticalIcon className='size-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end'>
                            <DropdownMenuItem
                                disabled={!currentStudyContext}
                                onClick={saveContextToFile}
                            >
                                <SaveIcon className='mr-2 size-4' />
                                Save context to file
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => setOpenLoadContextDialog(true)}
                            >
                                <UploadIcon className='mr-2 size-4' />
                                Open context from file
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>


                <div className='grid grid-cols-1 gap-4 @2xl:grid-cols-2 @6xl:grid-cols-2 pb-12'>
                    <EditorCard
                        label={'Survey keys'}
                        description={'Define which surveys are available for this study.'}
                        type={'string'}
                        data={currentStudyContext?.surveyKeys ?? []}
                        selectedIndex={selection?.attributeKey === 'surveyKeys' ? selection?.index : undefined}
                        onChange={(data) => {
                            let newStudyContext = { ...currentStudyContext };
                            if (!newStudyContext) {
                                newStudyContext = { surveyKeys: data as string[] };
                            } else {
                                newStudyContext.surveyKeys = data as string[];
                            }
                            updateCurrentStudyContext(newStudyContext);
                        }}
                        onSelectIndex={(index) => {
                            if (index === undefined) {
                                setSelection(undefined);
                                return;
                            }
                            setSelection({
                                index,
                                attributeKey: 'surveyKeys',
                            });
                        }}
                    />

                    <EditorCard
                        label={'Participant flags'}
                        description={'Define available participant flags and their possible values.'}
                        type={'key-value-pair'}
                        data={currentStudyContext?.participantFlags ?? []}
                        selectedIndex={selection?.attributeKey === 'participantFlags' ? selection?.index : undefined}
                        onChange={(data) => {
                            let newStudyContext = { ...currentStudyContext };
                            if (!newStudyContext) {
                                newStudyContext = { participantFlags: data as KeyValuePairDefs[] };
                            } else {
                                newStudyContext.participantFlags = data as KeyValuePairDefs[];
                            }
                            updateCurrentStudyContext(newStudyContext);
                        }}
                        onSelectIndex={(index) => {
                            if (index === undefined) {
                                setSelection(undefined);
                                return;
                            }

                            setSelection({
                                index,
                                attributeKey: 'participantFlags',
                            });
                        }}
                    />

                    <EditorCard
                        label={'Message keys'}
                        description={'Define which study email templates are available.'}
                        type={'string'}
                        data={currentStudyContext?.messageKeys ?? []}
                        selectedIndex={selection?.attributeKey === 'messageKeys' ? selection?.index : undefined}
                        onChange={(data) => {
                            let newStudyContext = { ...currentStudyContext };
                            if (!newStudyContext) {
                                newStudyContext = { messageKeys: data as string[] };
                            } else {
                                newStudyContext.messageKeys = data as string[];
                            }
                            updateCurrentStudyContext(newStudyContext);
                        }}
                        onSelectIndex={(index) => {
                            if (index === undefined) {
                                setSelection(undefined);
                                return;
                            }
                            setSelection({
                                index,
                                attributeKey: 'messageKeys',
                            });
                        }}
                    />

                    <EditorCard
                        label={'Reports'}
                        description={'Define reports and their possible attribute keys.'}
                        type={'key-value-pair'}
                        data={currentStudyContext?.reportKeys ?? []}
                        selectedIndex={selection?.attributeKey === 'reportKeys' ? selection?.index : undefined}
                        onChange={(data) => {
                            let newStudyContext = { ...currentStudyContext };
                            if (!newStudyContext) {
                                newStudyContext = { reportKeys: data as KeyValuePairDefs[] };
                            } else {
                                newStudyContext.reportKeys = data as KeyValuePairDefs[];
                            }
                            updateCurrentStudyContext(newStudyContext);
                        }}
                        onSelectIndex={(index) => {
                            if (index === undefined) {
                                setSelection(undefined);
                                return;
                            }

                            setSelection({
                                index,
                                attributeKey: 'reportKeys',
                            });
                        }}
                    />

                    <EditorCard
                        label={'Custom event keys'}
                        description={'Define which custom events should be handled by this study.'}
                        type={'string'}
                        data={currentStudyContext?.customEventKeys ?? []}
                        selectedIndex={selection?.attributeKey === 'customEventKeys' ? selection?.index : undefined}
                        onChange={(data) => {
                            let newStudyContext = { ...currentStudyContext };
                            if (!newStudyContext) {
                                newStudyContext = { customEventKeys: data as string[] };
                            } else {
                                newStudyContext.customEventKeys = data as string[];
                            }
                            updateCurrentStudyContext(newStudyContext);
                        }}
                        onSelectIndex={(index) => {
                            if (index === undefined) {
                                setSelection(undefined);
                                return;
                            }
                            setSelection({
                                index,
                                attributeKey: 'customEventKeys',
                            });
                        }}
                    />

                </div>
            </main>

            <LoadContextFromDisk
                open={openLoadContextDialog}
                onClose={() => setOpenLoadContextDialog(false)}
            />

            <Sidebar
                variant='sidebar'
                side='right'
                className='mt-10'

            >
                <SidebarHeader>
                    <div className='relative'>
                        <h2 className='font-bold text-lg pe-6 ps-2'>Edit entry</h2>

                        <Button variant={'ghost'} size={'icon'}
                            className='absolute -right-2 -top-2'
                            onClick={closeEditor}
                        >
                            <XIcon />
                            <span className='sr-only'>Close sidebar</span>
                        </Button>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <ItemEditor
                        key={JSON.stringify(selection)}
                        type={selection?.attributeKey as keyof StudyContext}
                        selection={selection ? currentStudyContext?.[selection.attributeKey as keyof StudyContext]?.at(selection.index) : undefined}
                        usedKeys={currentStudyContext?.[selection?.attributeKey as keyof StudyContext]?.map(e => typeof e === 'string' ? e : e.key) ?? []}
                        onChange={(item) => {
                            if (!selection) {
                                return;
                            }
                            let newStudyContext = { ...currentStudyContext };
                            const attrKey = selection.attributeKey as keyof StudyContext;
                            if (!newStudyContext) {
                                newStudyContext = { [selection.attributeKey]: [] };
                            }
                            if (!newStudyContext[attrKey]) {
                                newStudyContext[attrKey] = [];
                            }
                            newStudyContext[attrKey]![selection.index] = item;
                            updateCurrentStudyContext(newStudyContext);
                        }}
                    />
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    );
};

export default Overview;
