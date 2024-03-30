import React, { useContext, useEffect } from 'react';
import { SurveyContext } from '../surveyContext';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Survey, SurveyContext as ContextValues, SurveySingleItemResponse } from 'survey-engine/data_types';
import LanguageSelector from '@/components/LanguageSelector';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Eraser, Pencil } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';


interface SurveySimulatorProps {
}

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

const sendSimulatorConfig = (ref: React.RefObject<HTMLIFrameElement>, config: SimulatorConfig) => {
    console.log('sending simulator config')
    const message = {
        type: 'simulatorConfig',
        data: JSON.stringify(config),
    };

    if (ref.current && ref.current.contentWindow) {
        ref.current.contentWindow.postMessage(message, '*');
    }
};

const SurveyContextEditorDialog: React.FC<{
    contextValues: ContextValues;
    onContextChange: (context: ContextValues) => void;
    onClose: () => void;
    isOpen: boolean;
}> = (props) => {
    const [contextValues, setContextValues] = React.useState<ContextValues>(props.contextValues);

    const [newFlagPair, setNewFlagPair] = React.useState<{ key: string, value: string }>({ key: '', value: '' });

    useEffect(() => {
        setContextValues(props.contextValues);
    }, [props.contextValues]);



    return (<Dialog
        open={props.isOpen}
        onOpenChange={props.onClose}
    >
        <DialogContent>
            <DialogHeader>
                <DialogTitle>
                    Edit survey context
                </DialogTitle>
            </DialogHeader>

            <div className='space-y-4 w-full overflow-hidden p-1'>
                <Label htmlFor='isLoggedin'
                    className='flex items-center gap-2'
                >
                    <Switch id='isLoggedin' checked={contextValues.isLoggedIn} onCheckedChange={(checked) => {
                        setContextValues({
                            ...contextValues,
                            isLoggedIn: checked
                        });
                    }} />
                    Is logged in
                </Label>

                <div className=''>

                    <h3 className='font-bold mb-2'>
                        Participant flags
                    </h3>
                    <ul className='my-2 divide-y pe-1'>
                        {Object.keys(contextValues.participantFlags).length === 0 ? <p className='text-neutral-600 text-center text-sm'>No participant flags</p> : null}
                        {Object.keys(contextValues.participantFlags).map((key) => {
                            return (
                                <div key={key} className='flex items-center gap-2 py-1 max-w-full'>
                                    <Label
                                        className='text-base font-mono grow truncate w-1/2'
                                        htmlFor={`flag-${key}`}>{key}</Label>
                                    <Input
                                        id={`flag-${key}`}
                                        type='text'
                                        className='h-9 w-1/2'
                                        value={contextValues.participantFlags[key]}
                                        onChange={(e) => {
                                            setContextValues({
                                                ...contextValues,
                                                participantFlags: {
                                                    ...contextValues.participantFlags,
                                                    [key]: e.target.value
                                                }
                                            });
                                        }}
                                    />
                                    <Button
                                        variant='outline'
                                        size='sm'
                                        onClick={() => {
                                            const newFlags = { ...contextValues.participantFlags };
                                            delete newFlags[key];
                                            setContextValues({
                                                ...contextValues,
                                                participantFlags: newFlags
                                            });
                                        }}
                                    >
                                        <Eraser className='size-4 text-neutral-500' />
                                    </Button>
                                </div>
                            )
                        })
                        }
                    </ul>

                    <Separator />

                    <div className='flex items-center gap-2 mt-2'>
                        <Input
                            id='new-flag-key'
                            className='h-9'
                            type='text'
                            placeholder='Flag key...'
                            value={newFlagPair.key}
                            onChange={(e) => {
                                setNewFlagPair({
                                    ...newFlagPair,
                                    key: e.target.value
                                });
                            }}
                        />
                        <Input
                            id='new-flag-value'
                            className='h-9'
                            type='text'
                            placeholder='Flag value...'
                            value={newFlagPair.value}
                            onChange={(e) => {
                                setNewFlagPair({
                                    ...newFlagPair,
                                    value: e.target.value
                                });
                            }}
                        />
                        <Button
                            size={'sm'}
                            variant={'outline'}
                            disabled={newFlagPair.key.length === 0}
                            onClick={() => {
                                setContextValues({
                                    ...contextValues,
                                    participantFlags: {
                                        ...contextValues.participantFlags,
                                        [newFlagPair.key]: newFlagPair.value
                                    }
                                });
                                setNewFlagPair({
                                    key: '',
                                    value: ''
                                });
                            }}
                        >
                            Add flag
                        </Button>
                    </div>
                </div>

            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant='outline'>Cancel</Button>
                </DialogClose>
                <Button
                    onClick={() => {
                        props.onContextChange(contextValues);
                        props.onClose();
                    }}
                >
                    Apply
                </Button>
            </DialogFooter>

        </DialogContent>
    </Dialog>)
}


const SurveySimulator: React.FC<SurveySimulatorProps> = (props) => {
    const { survey } = useContext(SurveyContext);
    const iframeRef = React.useRef<HTMLIFrameElement>(null);

    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');
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
        participantFlags: {},

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


    if (!survey) {
        return <div>No survey loaded</div>
    }

    return (
        <div className='bg-white -m-6 flex grow overflow-hidden'>
            <ResizablePanelGroup direction='horizontal'>
                <ResizablePanel
                    minSize={20}
                    defaultSize={90}
                >
                    <iframe
                        ref={iframeRef}
                        src={`/tools/survey-simulator`}
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
                    <LanguageSelector
                        onLanguageChange={(lang) => {
                            if (lang !== selectedLanguage) {
                                setSelectedLanguage(lang);
                                sendSimulatorConfig(
                                    iframeRef,
                                    {
                                        ...currentConfig,
                                        language: lang
                                    }
                                )
                            }
                        }} />
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
                        variant={'outline'}
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
                    <h3 className='font-semibold'>Survey context</h3>
                    <pre className='text-xs max-w-full overflow-x-scroll'>
                        {contextValues ? (JSON.stringify(contextValues, undefined, 2)) : <p className='text-neutral-600'>No context values</p>}
                    </pre>
                    <Button
                        variant={'outline'}
                        size={'sm'}
                        onClick={() => {
                            setIsContextEditorOpen(true);
                        }}
                    >
                        <span>
                            <Pencil className='size-4 me-2 text-neutral-500' />
                        </span>
                        Edit context
                    </Button>
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
