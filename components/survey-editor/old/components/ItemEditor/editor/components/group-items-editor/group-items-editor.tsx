import React from 'react';
import { SurveyItem } from 'survey-engine/data_types';
import ItemSelectionMethodEditor from './item-selection-method-editor';
import ItemListEditor from './item-list-editor';

interface GroupItemsEditorProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
    onDeleteItem: (itemKey: string) => void;
}

const GroupItemsEditor: React.FC<GroupItemsEditorProps> = (props) => {
    return (
        <div className='px-4 py-2'>
            <div className='flex gap-4'>
                <ItemListEditor
                    surveyItem={props.surveyItem}
                    onUpdateSurveyItem={props.onUpdateSurveyItem}
                    onDeleteItem={props.onDeleteItem}
                />

                <ItemSelectionMethodEditor
                    surveyItem={props.surveyItem}
                    onUpdateSurveyItem={props.onUpdateSurveyItem}
                />
            </div>
        </div>
    );
};

export default GroupItemsEditor;
