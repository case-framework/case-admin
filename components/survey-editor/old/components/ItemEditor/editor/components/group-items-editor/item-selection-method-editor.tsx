import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import React from 'react';
import { SurveyGroupItem, SurveyItem } from 'survey-engine/data_types';

interface ItemSelectionMethodEditorProps {
    surveyItem: SurveyItem;
    onUpdateSurveyItem: (item: SurveyItem) => void;
}

const ItemSelectionMethodEditor: React.FC<ItemSelectionMethodEditorProps> = (props) => {
    const groupItem = props.surveyItem as SurveyGroupItem;

    const useSequentialOrder = groupItem.selectionMethod !== undefined && groupItem.selectionMethod.name === 'sequential';

    return (
        <div className='flex-1'>
            <h3 className='font-semibold text-base'>Item ordering</h3>
            <p className='text-sm text-neutral-600'>Define if the items should be order as they are in the list or shuffled randomly when the survey is run.</p>

            <Label
                htmlFor='use-random-order'
                className='flex items-center gap-2 mt-4'
            >
                <Switch
                    id='use-random-order'
                    checked={!useSequentialOrder}
                    onCheckedChange={(checked) => {
                        if (checked) {
                            groupItem.selectionMethod = undefined;
                        } else {
                            groupItem.selectionMethod = {
                                name: 'sequential'
                            };
                        }
                        props.onUpdateSurveyItem(groupItem);
                    }}
                />

                <span>Use random item ordering</span>
            </Label>
        </div>
    );
};

export default ItemSelectionMethodEditor;
