import React from 'react';
import EditorWrapper from './editor-wrapper';
import SurveyLanguageToggle from '@/components/survey-editor/old/components/general/SurveyLanguageToggle';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { getItemComponentByRole } from '@/components/survey-renderer/SurveySingleItemView/utils';
import { SimpleTextViewContentEditor } from './response-editors/text-view-content-editor';

interface FootnoteEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const FootnoteEditor: React.FC<FootnoteEditorProps> = (props) => {
    const updateFootnote = (newFootnote?: ItemComponent): SurveySingleItem => {
        if (!newFootnote) {
            return {
                ...props.surveyItem,
                components: {
                    ...props.surveyItem.components,
                    items: props.surveyItem.components?.items.filter(comp => comp.role !== 'footnote')
                } as ItemGroupComponent
            };
        }

        const existingComponents = [];
        if (props.surveyItem.components?.items) {
            existingComponents.push(...props.surveyItem.components.items);
        }

        const itemIndex = existingComponents.findIndex(comp => comp.role === 'footnote');
        if (itemIndex !== -1) {
            existingComponents[itemIndex] = newFootnote;
        } else {
            existingComponents.push(newFootnote);
        }

        return {
            ...props.surveyItem,
            components: {
                ...props.surveyItem.components,
                items: [
                    ...existingComponents,
                ]
            } as ItemGroupComponent
        };
    }

    const onToggleFootnote = (checked: boolean) => {
        if (!checked) {
            if (confirm('Are you sure you want to remove the footnote? You will loose the current content.')) {
                // clear content
                props.onUpdateSurveyItem(updateFootnote(undefined));
            }
        } else {
            // init content
            props.onUpdateSurveyItem(updateFootnote(
                {
                    role: 'footnote',
                }
            ));
        }
    }

    const footnote = getItemComponentByRole(props.surveyItem.components?.items, 'footnote') as ItemGroupComponent;

    const useFootnote = footnote ? true : false;

    return (
        <EditorWrapper>
            <Label
                htmlFor='use-footnote'
                className='flex items-center gap-2'
            >
                <Switch
                    id='use-footnote'
                    checked={useFootnote}
                    onCheckedChange={onToggleFootnote}
                />
                <span>
                    Use footnote
                </span>
            </Label>

            {useFootnote && (
                <div className='mt-2 space-y-2'>
                    <div className='flex justify-end'>
                        <SurveyLanguageToggle />
                    </div>

                    <SimpleTextViewContentEditor
                        component={footnote}
                        onChange={(newComp) => {
                            props.onUpdateSurveyItem(updateFootnote(newComp));
                        }}
                        hideStyling={true}
                        label={'Footnote'}
                        useTextArea={true}
                    />

                </div>
            )}
        </EditorWrapper>
    );
};

export default FootnoteEditor;
