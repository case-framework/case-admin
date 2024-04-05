
import React, { useEffect } from 'react';
import { SurveyItem } from 'survey-engine/data_types';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import ItemPreview from './ItemPreview';
import { useDebounceCallback } from 'usehooks-ts';
import ItemTypeEditorSelector from './ItemTypeEditorSelector';
import { Eye, Info, Pencil } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ContentEditorProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}


const ContentEditor: React.FC<ContentEditorProps> = (props) => {
    const [currentSurveyItem, setCurrentSurveyItem] = React.useState(props.surveyItem);
    const [editorCollapsed, setEditorCollapsed] = React.useState(false);
    const [previewCollapsed, setPreviewCollapsed] = React.useState(false);

    const debouncedUpdate = useDebounceCallback(props.onUpdateSurveyItem, 700)

    useEffect(() => {
        if (currentSurveyItem !== props.surveyItem) {
            debouncedUpdate(currentSurveyItem);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentSurveyItem]);



    return (


        <div className='grow h-full'>
            <ResizablePanelGroup direction='horizontal' >
                <ResizablePanel
                    collapsible={true}
                    collapsedSize={1}
                    defaultSize={50}
                    minSize={30}
                    className='min-w-[56px]'
                    onCollapse={() => {
                        setEditorCollapsed(true);
                    }}
                    onExpand={() => {
                        setEditorCollapsed(false);
                    }}
                >
                    {
                        editorCollapsed ? <div className='flex flex-col gap-4 justify-start items-center py-6 bg-neutral-50 h-full'>
                            <p className=''
                                style={{
                                    writingMode: 'vertical-rl',
                                }}
                            >
                                Editor
                            </p>
                            <span>
                                <Pencil className='size-4 text-neutral-500' />
                            </span>
                        </div> : <div className='p-4'>
                            <h3 className='font-semibold text-base'>Edit content</h3>
                            <ItemTypeEditorSelector
                                surveyItem={props.surveyItem}
                                onUpdateSurveyItem={setCurrentSurveyItem}
                            />
                        </div>
                    }

                </ResizablePanel>
                <ResizableHandle
                    withHandle
                />
                <ResizablePanel
                    collapsible={true}
                    collapsedSize={1}
                    defaultSize={50}
                    minSize={30}
                    className='min-w-[56px]'
                    onCollapse={() => {
                        setPreviewCollapsed(true);
                    }}
                    onExpand={() => {
                        setPreviewCollapsed(false);
                    }}
                >
                    {
                        previewCollapsed ? <div className='flex flex-col gap-4 justify-start items-center py-6 bg-neutral-50 h-full'>
                            <p className=''
                                style={{
                                    writingMode: 'vertical-rl',
                                }}
                            >
                                Preview
                            </p>
                            <span>
                                <Eye className='size-4 text-neutral-500' />
                            </span>
                        </div> : <div className='p-4'>
                            <TooltipProvider>
                                <Tooltip delayDuration={500}>
                                    <TooltipTrigger asChild>
                                        <h3 className='font-semibold text-base flex items-center gap-2'>
                                            <span
                                                className='grow'
                                            >Preview</span>
                                            <span>
                                                <Info className='size-4 text-neutral-500' />
                                            </span>
                                        </h3>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        className='w-96'
                                        //side='right'
                                        align='end'
                                    >
                                        <p>
                                            Hint: The preview ignores conditions, disabling and validation rules. Expression values are replaced with a placeholder.
                                        </p>
                                        <p>
                                            Use the simulator to test the item with all rules applied.
                                        </p>
                                    </TooltipContent>
                                </Tooltip>
                                <ItemPreview
                                    surveyItem={props.surveyItem}
                                />
                            </TooltipProvider>
                        </div>
                    }
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default ContentEditor;
