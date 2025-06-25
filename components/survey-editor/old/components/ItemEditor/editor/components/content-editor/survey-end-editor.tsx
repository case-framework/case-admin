import SurveyLanguageToggle from '@/components/survey-editor/old/components/general/SurveyLanguageToggle';
import { checkMissingTranslations } from '@/components/survey-editor/old/utils/localeUtils';
import React from 'react';
import { SurveyItem, SurveySingleItem } from 'survey-engine/data_types';
import EditorWrapper from './editor-wrapper';
import { SimpleTextViewContentEditor } from './response-editors/text-view-content-editor';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';
import { initNewTextComponent } from '@/components/survey-editor/old/utils/new-component-init';
import LocalizedContentEditor from './localized-content-editor';


interface SurveyEndEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}

const SurveyEndEditor: React.FC<SurveyEndEditorProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();


    let itemComponents = (props.surveyItem as SurveySingleItem).components?.items;

    if (!itemComponents || itemComponents.length === 0) {
        itemComponents = [
            initNewTextComponent(
                undefined,
                'title',
                [{ type: 'plain', key: 'content' }],
            ),
        ];
    }

    if (itemComponents.length > 1) {
        console.warn('Too many components in survey end item. Only the first one will be displayed.');
    }

    const surveyEndContent = itemComponents[0];

    return (
        <EditorWrapper>
            <div className='flex justify-end'>
                <SurveyLanguageToggle
                    showBadgeForLanguages={checkMissingTranslations(surveyEndContent)}
                />
            </div>

            <LocalizedContentEditor
                component={surveyEndContent}
                contentKey='content'
                label='End content'
                useTextArea={true}
                onChange={(newComp) => {
                    const updatedItem = {
                        ...props.surveyItem,
                        components: {
                            ...props.surveyItem.components,
                            items: [newComp],
                        }
                    } as SurveySingleItem;
                    props.onUpdateSurveyItem(updatedItem);
                }}
            />


        </EditorWrapper>
    );
};

export default SurveyEndEditor;
