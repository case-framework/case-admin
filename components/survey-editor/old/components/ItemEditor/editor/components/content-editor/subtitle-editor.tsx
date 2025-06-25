import React from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import EditorWrapper from './editor-wrapper';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { localisedObjectToMap } from '@/components/survey-editor/old/utils/localeUtils';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import SurveyLanguageToggle from '@/components/survey-editor/old/components/general/SurveyLanguageToggle';
import { Textarea } from '@/components/ui/textarea';
import FormattedTextListEditor from './formatted-text-list-editor';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';

interface SubtitleEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const SimpleSubtitleEditor: React.FC<SubtitleEditorProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    let subtitleComponentIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'subtitle');
    if (subtitleComponentIndex === undefined || subtitleComponentIndex === -1) {
        if (!props.surveyItem.components?.items) {
            props.surveyItem.components = {
                role: 'root',
                items: [],
            };
        }
        props.surveyItem.components?.items.push({
            role: 'subtitle',
            content: generateLocStrings(new Map([[selectedLanguage, '']]))
        });
        subtitleComponentIndex = props.surveyItem.components?.items.length - 1;
    }

    const subtitleComponent = props.surveyItem.components?.items[subtitleComponentIndex];
    if (!subtitleComponent) {
        return null;
    }

    const titleMap = localisedObjectToMap(subtitleComponent.content);

    const onUpdateContent = (content: string) => {
        titleMap.set(selectedLanguage, content);

        const existingComponents = props.surveyItem.components?.items || [];
        existingComponents[subtitleComponentIndex].content = generateLocStrings(titleMap);
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                ...props.surveyItem.components,
                role: 'root',
                items: existingComponents,
            }
        })
    }

    return (
        <div className='mt-4 space-y-4'>
            <div className='space-y-1.5'>
                <Label
                    htmlFor='subtitle-input'
                >
                    Subtitle
                </Label>
                <Textarea
                    id='subtitle-input'
                    value={titleMap.get(selectedLanguage) || ''}
                    onChange={(e) => {
                        onUpdateContent(e.target.value);
                    }}
                    placeholder='Enter subtitle here for the selected language...'
                />
            </div>
        </div>
    );
}

const AdvancedSubtitleEditor: React.FC<SubtitleEditorProps> = (props) => {
    const subtitleComponentIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'subtitle');
    if (subtitleComponentIndex === undefined || subtitleComponentIndex === -1) {
        return null;
    }

    const subtitleComponent = props.surveyItem.components?.items[subtitleComponentIndex];
    if (!subtitleComponent) {
        return null;
    }

    const subtitleParts = (subtitleComponent as ItemGroupComponent).items || [];

    const onPartsChange = (newParts: ItemComponent[]) => {
        (subtitleComponent as ItemGroupComponent).items = newParts;

        const existingComponents = props.surveyItem.components?.items || [];
        existingComponents[subtitleComponentIndex] = subtitleComponent;
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                ...props.surveyItem.components,
                role: 'root',
                items: existingComponents,
            }
        })
    }



    return (
        <div className='mt-6 space-y-4'>
            <div>
                <FormattedTextListEditor
                    sortableID='subtitle-parts-list'
                    parts={subtitleParts}
                    onChange={onPartsChange}
                />
            </div>
        </div>
    );

}

const determineAdvancedMode = (item: SurveySingleItem) => {
    const componentIndex = item.components?.items.findIndex(comp => comp.role === 'subtitle');
    if (componentIndex === undefined || componentIndex === -1) {
        return false;
    }

    const component = item.components?.items[componentIndex];
    if (!component) {
        return false;
    }

    return (component as ItemGroupComponent).items !== undefined && (component as ItemGroupComponent).content === undefined;
}


const SubtitleEditor: React.FC<SubtitleEditorProps> = (props) => {
    const isAdvancedMode = determineAdvancedMode(props.surveyItem);


    const onToggleAdvanceMode = (checked: boolean) => {
        if (!confirm('Are you sure you want to switch the editor mode? You will loose the current content.')) {
            return
        }

        const newSubtitleComp: ItemComponent = {
            role: 'subtitle',
            items: undefined,
        };
        if (checked) {
            (newSubtitleComp as ItemGroupComponent).items = [];
        }


        const subtitleComponentIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'subtitle');
        const existingComponents = props.surveyItem.components?.items || [];
        if (subtitleComponentIndex === undefined || subtitleComponentIndex === -1) {
            // add a new title component
            existingComponents.push(newSubtitleComp);
        } else {
            // update the existing title component
            existingComponents[subtitleComponentIndex] = newSubtitleComp;
        }
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                ...props.surveyItem.components,
                role: 'root',
                items: existingComponents,
            }
        });

    }

    return (
        <EditorWrapper>
            <div className='mb-4 flex justify-between'>
                <SurveyLanguageToggle />
                <Label
                    htmlFor="subtitle-advanced-mode-switch"
                    className='flex items-center gap-2'
                >
                    <Switch
                        id="subtitle-advanced-mode-switch"
                        checked={isAdvancedMode}
                        onCheckedChange={onToggleAdvanceMode}
                    />
                    <span>
                        Use advanced mode
                    </span>
                </Label>
            </div>
            <Separator />

            {isAdvancedMode ? <AdvancedSubtitleEditor {...props} /> : <SimpleSubtitleEditor {...props} />}
        </EditorWrapper>
    );
};

export default SubtitleEditor;
