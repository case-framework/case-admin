import React from 'react';

import SurveyView from '@/components/survey-viewer/survey-renderer/SurveyView/SurveyView';
import { SurveyEditor } from 'case-editor-tools/surveys/survey-editor/survey-editor';
import LanguageSelector from '@/components/LanguageSelector';

interface PreviewModeProps {
    editorInstance: SurveyEditor;
}

const PreviewMode: React.FC<PreviewModeProps> = (props) => {
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');
    return (
        <div className='relative p-unit-lg bg-white'>
            <LanguageSelector
                onLanguageChange={(lang) => setSelectedLanguage(lang)}
            />
            <div className='pt-unit-lg max-w-[600px] '>
                <SurveyView
                    survey={props.editorInstance.getSurvey()}
                    backBtnText='Back'
                    invalidResponseText='Invalid response'
                    languageCode={selectedLanguage}
                    nextBtnText='Next'
                    submitBtnText='Submit'
                    onSubmit={(response) => {
                        console.log(response);

                    }}



                />
            </div>
        </div>
    );
};

export default PreviewMode;
