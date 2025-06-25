import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import React from 'react';
import MarkdownContentEditor from './markdown-content-editor';
import { ExpressionArg, ItemComponent, ItemGroupComponent, LocalizedString, SurveySingleItem } from 'survey-engine/data_types';
import { getItemComponentByRole } from '@/components/survey-renderer/SurveySingleItemView/utils';
import { getLocStringLocales, localisedObjectToMap } from '@/components/survey-editor/old/utils/localeUtils';
import SurveyLanguageToggle from '@/components/survey-editor/old/components/general/SurveyLanguageToggle';
import EditorWrapper from './editor-wrapper';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';

interface HelpPopupEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const HelpPopupEditor: React.FC<HelpPopupEditorProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const updateHelpGroup = (helpGroupContent?: ItemComponent): SurveySingleItem => {
        if (!helpGroupContent) {
            return {
                ...props.surveyItem,
                components: {
                    ...props.surveyItem.components,
                    items: props.surveyItem.components?.items.filter(comp => comp.role !== 'helpGroup')
                } as ItemGroupComponent
            };
        }

        const existingComponents = [];
        if (props.surveyItem.components?.items) {
            existingComponents.push(...props.surveyItem.components.items);
        }

        const newHelpGroup = {
            role: 'helpGroup',
            items: [helpGroupContent],
            order: {
                name: 'sequential'
            }
        }

        const itemIndex = existingComponents.findIndex(comp => comp.role === 'helpGroup');
        if (itemIndex !== -1) {
            existingComponents[itemIndex] = newHelpGroup;
        } else {
            existingComponents.push(newHelpGroup);
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

    const onToggleHelpGroup = (checked: boolean) => {
        if (!checked) {
            if (confirm('Are you sure you want to remove the help group? You will loose the current content.')) {
                // clear content
                props.onUpdateSurveyItem(updateHelpGroup(undefined));
            }
        } else {
            // init content
            props.onUpdateSurveyItem(updateHelpGroup(
                {
                    role: 'helpGroup',
                    items: [],
                    order: {
                        name: 'sequential'
                    }
                }
            ));
        }
    }

    // has help group
    const helpGroup = getItemComponentByRole(props.surveyItem.components?.items, 'helpGroup') as ItemGroupComponent;
    const useHelpGroup = helpGroup ? true : false;

    let content = '';
    if (useHelpGroup) {
        if (helpGroup.items?.length !== 1) {
            const newContent: Array<LocalizedString> = [];
            // has more than one item? (fallback to merging these for the content)
            helpGroup.items?.forEach((item, index) => {
                if (index > 0) {
                    content += '\n\n';
                }

                const locs = getLocStringLocales(item.content);
                console.log('locs', locs);

                locs.forEach(loc => {
                    const currentLocaleContent = localisedObjectToMap(item.content).get(loc);
                    const locIndex = newContent.findIndex(l => l.code === loc);
                    if (locIndex === -1) {
                        newContent.push({
                            code: loc,
                            parts: [currentLocaleContent ? { str: currentLocaleContent } : '']
                        });
                    } else {
                        (newContent[locIndex].parts[0] as ExpressionArg).str += '\n\n' + (currentLocaleContent ? currentLocaleContent : '');
                    }
                });
            });

            helpGroup.items = [{
                role: 'content',
                content: newContent,
                order: {
                    name: 'sequential'
                }
            }];
        }

        const currentLocaleContent = localisedObjectToMap(helpGroup.items[0].content).get(selectedLanguage);
        content = currentLocaleContent ? currentLocaleContent : '';
    }

    return (
        <EditorWrapper>
            <Label
                htmlFor='use-help-group'
                className='flex items-center gap-2'
            >
                <Switch
                    id='use-help-group'
                    checked={useHelpGroup}
                    onCheckedChange={onToggleHelpGroup}
                />
                <span>
                    Use help group
                </span>

            </Label>

            {useHelpGroup && <div className='mt-4 w-full'>
                <div
                    className='flex items-end justify-between mb-2'
                >
                    <p className='font-semibold'>
                        Content
                    </p>
                    <SurveyLanguageToggle />
                </div>

                <MarkdownContentEditor
                    content={content}
                    onUpdateContent={(content) => {
                        const updatedHelpGroupComp = helpGroup.items[0];
                        if (updatedHelpGroupComp.content === undefined) {
                            updatedHelpGroupComp.content = [];
                        }
                        const localeIndex = updatedHelpGroupComp.content.findIndex(l => l.code === selectedLanguage);
                        if (localeIndex === -1) {
                            updatedHelpGroupComp.content.push({
                                code: selectedLanguage,
                                parts: [{ str: content }]
                            });
                        } else {
                            (updatedHelpGroupComp.content[localeIndex] as LocalizedString).parts = [{ str: content }];
                        }
                        props.onUpdateSurveyItem(updateHelpGroup(updatedHelpGroupComp));
                    }}
                />
            </div>}

        </EditorWrapper>
    );
};

export default HelpPopupEditor;

