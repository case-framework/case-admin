import React, { useContext, useEffect } from 'react';
import { SurveyEditorContext } from '../../surveyEditorContext';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Survey, SurveyContext as ContextValues, SurveySingleItemResponse } from 'survey-engine/data_types';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Eraser, Pencil } from 'lucide-react';
import SurveyLanguageToggle from './general/SurveyLanguageToggle';
import { SurveyContextTable } from './SurveyContextTable';
import { SurveyContextEditorDialog } from './simulator/SimulatorContextEditorDialog';


interface SurveyTexts {
    nextBtnText?: string;
    backBtnText?: string;
    submitBtnText?: string;
    invalidResponseText?: string;
}
export interface SimulatorConfig {
    survey?: Survey;
    texts?: SurveyTexts;
    language?: string;
    showKeys?: boolean;
    prefills?: SurveySingleItemResponse[];
    surveyContext?: ContextValues;
}

const sendSimulatorConfig = (ref: React.RefObject<HTMLIFrameElement | null>, config: SimulatorConfig) => {
    console.log('sending simulator config')
    const message = {
        type: 'simulatorConfig',
        data: JSON.stringify(config),
    };

    if (ref.current && ref.current.contentWindow) {
        ref.current.contentWindow.postMessage(message, '*');
    }
};

const SurveySimulator: React.FC<{ simulatorUrl: string }> = ({
    simulatorUrl,
}) => {
    const { survey, selectedLanguage } = useContext(SurveyEditorContext);
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    const [showKeys, setShowKeys] = React.useState<boolean>(false);
    const [currentResponses, setCurrentResponses] = React.useState<SurveySingleItemResponse[]>([]);
    const [surveyTexts, setSurveyTexts] = React.useState<SurveyTexts>({
        nextBtnText: 'Next',
        backBtnText: 'Back',
        submitBtnText: 'Submit',
        invalidResponseText: 'Invalid response',
    });
    const [contextValues, setContextValues] = React.useState<ContextValues>({
        isLoggedIn: false,
        participantFlags: {}
    });
    const [isContextEditorOpen, setIsContextEditorOpen] = React.useState(false);


    const currentConfig: SimulatorConfig = {
        survey,
        language: selectedLanguage,
        showKeys,
        texts: surveyTexts,
        prefills: currentResponses,
        surveyContext: contextValues,
    };


    useEffect(() => {
        const handleMessageEvent = (event: MessageEvent) => {
            if (event.origin !== window.location.origin) {
                console.log('message from unknown origin', event.origin);
                return;
            }

            if (event.source !== iframeRef.current?.contentWindow) {
                console.log('message from unknown source');
                return;
            }

            if (event.data.type === 'status' && event.data.data === 'ready') {
                console.log('SimulatorClient ready');
                sendSimulatorConfig(
                    iframeRef,
                    currentConfig
                );
                return;
            } else if (event.data.type === 'response') {
                setCurrentResponses(JSON.parse(event.data.data));
                return;
            }
        }
        window.addEventListener('message', handleMessageEvent);
        return () => {
            window.removeEventListener('message', handleMessageEvent);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        sendSimulatorConfig(
            iframeRef,
            {
                ...currentConfig,
                language: selectedLanguage
            }
        )
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedLanguage]);


    if (!survey) {
        return <div>No survey loaded</div>
    }

    return (
        <div className='bg-white flex grow overflow-hidden'>
            <ResizablePanelGroup direction='horizontal'>
                <ResizablePanel
                    minSize={20}
                    defaultSize={90}
                >
                    <iframe
                        ref={iframeRef}
                        src={simulatorUrl}
                        height={'100%'}
                        className="relative w-full bg-background"
                    />
                </ResizablePanel>
                <ResizableHandle
                    withHandle
                />
                <ResizablePanel >
                    <div className='bg-neutral-100 w-full h-full'>

                    </div>
                </ResizablePanel>


            </ResizablePanelGroup>
            <div className='border-s border-neutral-200 p-4 pb-12 space-y-4 w-96 overflow-y-scroll'>
                <h2 className='font-bold'>Simulator config</h2>
                <div>
                    <p className='text-sm font-semibold mb-1'>Language</p>
                    <SurveyLanguageToggle />
                </div>

                <div className='flex items-center gap-2'>
                    <Switch
                        id='show-keys'
                        checked={showKeys}
                        onCheckedChange={(checked) => {
                            setShowKeys(checked);
                            sendSimulatorConfig(
                                iframeRef,
                                {
                                    ...currentConfig,
                                    showKeys: checked
                                }
                            );
                        }}
                    />
                    <Label
                        htmlFor='show-keys'
                    >Show keys</Label>
                </div>

                <Separator />

                <div className='space-y-2'>
                    <h3 className='font-semibold'>Responses</h3>
                    <p>
                        {currentResponses.filter(r => r.response !== undefined).length} of {currentResponses.length} responses
                    </p>
                    <Button
                        disabled={currentResponses.length === 0}
                        variant={'outline-solid'}
                        size={'sm'}
                        onClick={() => {
                            setCurrentResponses([]);
                            sendSimulatorConfig(
                                iframeRef,
                                {
                                    ...currentConfig,
                                    prefills: [],
                                }
                            );
                        }}
                    >
                        <span>
                            <Eraser className='size-4 me-2 text-neutral-500' />
                        </span>
                        Clear responses
                    </Button>
                </div>

                <Separator />

                <div className='space-y-2'>
                    <div className='flex flex-row justify-between'>
                        <h3 className='font-semibold'>Survey context</h3>
                        <Button variant="outline" className='size-6 p-0' onClick={() => { setIsContextEditorOpen(true); }}>
                            <Pencil className="size-4" />
                        </Button>
                    </div>
                    <SurveyContextTable contextValues={contextValues} />
                    <SurveyContextEditorDialog
                        contextValues={contextValues}
                        onContextChange={(context) => {
                            setContextValues(context);
                            sendSimulatorConfig(
                                iframeRef,
                                {
                                    ...currentConfig,
                                    surveyContext: context,
                                }
                            );
                        }}
                        onClose={() => {
                            setIsContextEditorOpen(false);
                        }}
                        isOpen={isContextEditorOpen}
                    />

                </div>

                <Separator />

                <div className='space-y-2'>
                    <h3 className='font-semibold'>Customise labels</h3>

                    <div className='space-y-1'>
                        <Label htmlFor='next-btn-text'>Next button text</Label>
                        <Input
                            id='next-btn-text'
                            type='text'
                            className='w-full'
                            value={surveyTexts.nextBtnText || ''}
                            onChange={(e) => {
                                setSurveyTexts({
                                    ...surveyTexts,
                                    nextBtnText: e.target.value
                                });
                                sendSimulatorConfig(
                                    iframeRef,
                                    {
                                        language: selectedLanguage,
                                        showKeys,
                                        prefills: currentResponses,
                                        survey,
                                        texts: {
                                            ...surveyTexts,
                                            nextBtnText: e.target.value
                                        }
                                    }
                                );

                            }}
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label htmlFor='back-btn-text'>Back button text</Label>
                        <Input
                            id='back-btn-text'
                            type='text'
                            className='w-full'
                            value={surveyTexts.backBtnText || ''}
                            onChange={(e) => {
                                setSurveyTexts({
                                    ...surveyTexts,
                                    backBtnText: e.target.value
                                });

                                sendSimulatorConfig(
                                    iframeRef,
                                    {
                                        ...currentConfig,
                                        texts: {
                                            ...surveyTexts,
                                            backBtnText: e.target.value
                                        }
                                    }
                                );
                            }}
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label htmlFor='submit-btn-text'>Submit button text</Label>
                        <Input
                            id='submit-btn-text'
                            type='text'
                            className='w-full'
                            value={surveyTexts.submitBtnText || ''}
                            onChange={(e) => {
                                setSurveyTexts({
                                    ...surveyTexts,
                                    submitBtnText: e.target.value
                                });

                                sendSimulatorConfig(
                                    iframeRef,
                                    {
                                        ...currentConfig,
                                        texts: {
                                            ...surveyTexts,
                                            submitBtnText: e.target.value
                                        }
                                    }
                                );
                            }}
                        />
                    </div>

                    <div className='space-y-1'>
                        <Label htmlFor='invalid-response-text'>Invalid response text</Label>
                        <Input
                            id='invalid-response-text'
                            type='text'
                            className='w-full'
                            value={surveyTexts.invalidResponseText || ''}
                            onChange={(e) => {
                                setSurveyTexts({
                                    ...surveyTexts,
                                    invalidResponseText: e.target.value
                                });

                                sendSimulatorConfig(
                                    iframeRef,
                                    {
                                        ...currentConfig,
                                        texts: {
                                            ...surveyTexts,
                                            invalidResponseText: e.target.value
                                        }
                                    }
                                );
                            }}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SurveySimulator;
