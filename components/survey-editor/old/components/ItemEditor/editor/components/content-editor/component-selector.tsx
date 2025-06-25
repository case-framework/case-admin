import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ChevronRight, CircleHelp, Heading1, Heading2, MessageSquareReply, PanelBottom, PanelTop, Subscript } from 'lucide-react';
import React from 'react';
import TitleEditor from './title-editor';
import { SurveyItem } from 'survey-engine/data_types';
import SubtitleEditor from './subtitle-editor';
import HelpPopupEditor from './help-popup-editor';
import TopContentEditor from './top-content-editor';
import ResponseGroupEditor from './response-editors/response-group-editor';
import BottomContentEditor from './bottom-content-editor';
import FootnoteEditor from './footnote-editor';


interface ComponentSelectorProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}

const headerComponents = [
    {
        key: 'title',
        label: 'Title',
        icon: <Heading1 className='size-4 text-muted-foreground-600' />,
    },
    {
        key: 'subtitle',
        label: 'Subtitle',
        icon: <Heading2 className='size-4 text-muted-foreground-600' />,
    },
    {
        key: 'help-popup',
        label: 'Help/Info popup',
        icon: <CircleHelp className='size-4 text-muted-foreground-600' />,
    },
];

const bodyComponents = [
    {
        key: 'top-contents',
        label: 'Top content (before response)',
        icon: <PanelTop className='size-4 text-muted-foreground-600' />,
    },
    {
        key: 'response',
        label: 'Response options',
        icon: <MessageSquareReply className='size-4 text-muted-foreground-600' />,
    },
    {
        key: 'bottom-contents',
        label: 'Bottom content (after response)',
        icon: <PanelBottom className='size-4 text-muted-foreground-600' />,
    },
];


const ComponentSelector: React.FC<ComponentSelectorProps> = (props) => {
    const [selectedComponent, setSelectedComponent] = React.useState<string | undefined>(undefined);

    const renderHeader = () => {
        if (!selectedComponent) {
            return null;
        }

        return (<div className=''>
            <Button className='text-xs px-1' variant={'ghost'}
                onClick={() => setSelectedComponent(undefined)}
            >
                <span><ArrowLeft className='size-4 me-2'></ArrowLeft></span>
                Back to components
            </Button>
            <Separator />
            <h4 className='font-semibold mt-2 mb-4'>
                {selectedComponent.toUpperCase()}
            </h4>
        </div>
        );
    }



    switch (selectedComponent) {
        case 'title':
            return (
                <div className=''>
                    {renderHeader()}
                    <TitleEditor
                        surveyItem={props.surveyItem}
                        onUpdateSurveyItem={props.onUpdateSurveyItem}
                    />
                </div>
            );
        case 'subtitle':
            return (
                <div className=''>
                    {renderHeader()}
                    <SubtitleEditor
                        surveyItem={props.surveyItem}
                        onUpdateSurveyItem={props.onUpdateSurveyItem}
                    />
                </div>
            );
        case 'help-popup':
            return (
                <div className=''>
                    {renderHeader()}
                    <HelpPopupEditor
                        surveyItem={props.surveyItem}
                        onUpdateSurveyItem={props.onUpdateSurveyItem}
                    />
                </div>
            );
        case 'top-contents':
            return (
                <div className=''>
                    {renderHeader()}
                    <TopContentEditor
                        surveyItem={props.surveyItem}
                        onUpdateSurveyItem={props.onUpdateSurveyItem}
                    />
                </div>
            );
        case 'response':
            return (
                <div>
                    {renderHeader()}
                    <ResponseGroupEditor
                        surveyItem={props.surveyItem}
                        onUpdateSurveyItem={props.onUpdateSurveyItem}
                    />
                </div>
            )
        case 'bottom-contents':
            return (
                <div>
                    {renderHeader()}
                    <BottomContentEditor
                        surveyItem={props.surveyItem}
                        onUpdateSurveyItem={props.onUpdateSurveyItem}
                    />
                </div>
            )
        case 'footnote':
            return (
                <div>
                    {renderHeader()}
                    <FootnoteEditor
                        surveyItem={props.surveyItem}
                        onUpdateSurveyItem={props.onUpdateSurveyItem}
                    />
                </div>
            );
        default:
            return (
                <div>
                    <h3 className='font-semibold text-base'>Edit content</h3>
                    <p className='text-sm text-neutral-600'>Select the area you want to edit</p>
                    <div className='mt-4 mb-6 p-4 rounded-md border border-l-4  border-l-border'>

                        <h4 className='text-xs tracking-widest font-semibold'>
                            Header
                        </h4>
                        <ul className='divide-y'>
                            {headerComponents.map((comp, index) => (
                                <li className='py-1' key={comp.key + index.toFixed()}>
                                    <Button
                                        className='w-full flex justify-start gap-2 items-center'
                                        variant={'ghost'}
                                        onClick={() => setSelectedComponent(comp.key)}
                                    >
                                        {comp.icon}
                                        <span className='grow text-start'>{comp.label}</span>
                                        <span><ChevronRight
                                            className='size-4 text-muted-foreground'
                                        ></ChevronRight></span>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='mb-6 p-2 rounded-md border border-l-4  border-border'>
                        <h4 className='text-xs tracking-widest font-semibold'>
                            Body
                        </h4>
                        <ul className='divide-y'>
                            {bodyComponents.map((comp, index) => (
                                <li className='py-1' key={comp.key + index.toFixed()}>
                                    <Button
                                        className='w-full flex justify-start gap-2 items-center'
                                        variant={'ghost'}
                                        onClick={() => setSelectedComponent(comp.key)}
                                    >
                                        {comp.icon}
                                        <span className='grow text-start'>{comp.label}</span>
                                        <span><ChevronRight
                                            className='size-4 text-muted-foreground'
                                        ></ChevronRight></span>
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className='p-2 border-l-4 rounded-md border border-neutral-100'>
                        <Button
                            className='w-full flex justify-start gap-2 items-center'
                            variant={'ghost'}
                            onClick={() => setSelectedComponent('footnote')}
                        >
                            <Subscript className='size-4 text-muted-foreground' />
                            <span className='grow text-start'>Footnote</span>
                            <span><ChevronRight
                                className='size-4 text-muted-foreground'
                            ></ChevronRight></span>
                        </Button>
                    </div>
                </div>
            );
    }

};

export default ComponentSelector;
