'use client';

import React from 'react';
import { standaloneModes, integratedModes } from './utils';
import SurveyEditorSidebar from './SurveyEditorSidebar';
import PublishMode from './views/PublishMode';
import PreviewMode from './views/PreviewMode';
import SurveyItemsMode from './views/SurveyItemsMode';
import SurveyPropsMode from './views/SurveyPropsMode';
import FileMode from './views/FileMode';
import { SurveyEditor as EditorInstance } from 'case-editor-tools/surveys/survey-editor/survey-editor';
import { Survey } from 'survey-engine/data_types';
import { useRouter } from 'next/navigation';


interface SurveyEditorProps {
    initialSurvey?: Survey;
}


const SurveyEditor: React.FC<SurveyEditorProps> = (props) => {
    const router = useRouter();
    const editorModes = props.initialSurvey ? integratedModes : standaloneModes;
    const [mode, setMode] = React.useState(editorModes[0]);

    const [editorInstance, setEditorInstance] = React.useState<EditorInstance | undefined>(props.initialSurvey ? new EditorInstance(props.initialSurvey) : undefined);


    const onExit = () => {
        if (confirm('Unsaved, unexported or unpublished content will be lost. Are you sure you want to exit the survey editor?')) {
            router.back();
        }
    }

    let mainContent: React.ReactNode = null;
    switch (mode) {
        case 'file':
            mainContent = <FileMode
                editorInstance={editorInstance}
                onLoadNewSurvey={(survey) => {
                    setEditorInstance(new EditorInstance(survey));
                    setMode('props');
                }}
            />;
            break;
        case 'props':
            if (!editorInstance) {
                break;
            }
            mainContent = <SurveyPropsMode
                editorInstance={editorInstance}
            />;
            break;
        case 'items':
            if (!editorInstance) {
                break;
            }
            mainContent = <SurveyItemsMode
                editorInstance={editorInstance}
            />;
            break;
        case 'preview':
            if (!editorInstance) {
                break;
            }
            mainContent = <PreviewMode
                editorInstance={editorInstance}
            />;
            break;
        case 'publish':
            if (!editorInstance) {
                break;
            }
            mainContent = <PublishMode />;
            break;
        default:
            break;
    }

    return (
        <div className='bg-center bg-cover bg-[url(/images/spaceship.png)]'>
            <div className='bg-white/60 h-screen relative'>
                <SurveyEditorSidebar
                    currentMode={mode}
                    onModeChange={setMode}
                    onExit={onExit}
                    editorModes={editorModes.map(m => {
                        return {
                            mode: m,
                            isDisabled: m !== 'file' && !editorInstance,
                        }
                    })}
                />
                <div className='pl-14'>
                    {mainContent}
                </div>
            </div>
        </div>
    );
};

export default SurveyEditor;
