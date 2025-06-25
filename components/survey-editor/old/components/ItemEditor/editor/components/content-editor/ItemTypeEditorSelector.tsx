import { getItemTypeInfos } from '@/components/survey-editor/old/utils/utils';
import React from 'react';
import { SurveyItem } from 'survey-engine/data_types';
import SurveyEndEditor from './survey-end-editor';
import '@mdxeditor/editor/style.css'
import TopContentEditor from './top-content-editor';
import ComponentSelector from './component-selector';

interface ItemTypeEditorSelectorProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}

const ItemTypeEditorSelector: React.FC<ItemTypeEditorSelectorProps> = (props) => {
    const typeInfos = getItemTypeInfos(props.surveyItem);

    if (typeInfos.key === 'surveyEnd') {
        return (
            <div className='py-4'>
                <SurveyEndEditor
                    surveyItem={props.surveyItem}
                    onUpdateSurveyItem={props.onUpdateSurveyItem}
                />
            </div>
        );
    } else if (typeInfos.key === 'display') {
        return (
            <div className='mt-4'>
                <TopContentEditor
                    surveyItem={props.surveyItem}
                    onUpdateSurveyItem={props.onUpdateSurveyItem}
                />
            </div>
        );
    }

    return (
        <div>
            <div className='mx-auto mt-4'>
                <ComponentSelector
                    surveyItem={props.surveyItem}
                    onUpdateSurveyItem={props.onUpdateSurveyItem}
                />
            </div>
        </div >
    );
};

export default ItemTypeEditorSelector;
