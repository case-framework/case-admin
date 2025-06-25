import React from 'react';
import EditorWrapper from './editor-wrapper';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import SurveyLanguageToggle from '@/components/survey-editor/old/components/general/SurveyLanguageToggle';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import { localisedObjectToMap } from '@/components/survey-editor/old/utils/localeUtils';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import FormattedTextListEditor from './formatted-text-list-editor';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';


interface TitleEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}


const SimpleTitleEditor: React.FC<TitleEditorProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const titleComponentIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'title');
    if (titleComponentIndex === undefined || titleComponentIndex === -1) {
        return null;
    }

    const titleComponent = props.surveyItem.components?.items[titleComponentIndex];
    if (!titleComponent) {
        return null;
    }

    const titleMap = localisedObjectToMap(titleComponent.content);

    const classNameIndex = titleComponent.style?.findIndex(style => style.key === 'className');
    let hasStickyHeader = false;
    if (classNameIndex !== undefined && classNameIndex !== -1) {
        hasStickyHeader = titleComponent.style![classNameIndex].value.includes('sticky-top');
    }

    const onToggleStickyHeader = (checked: boolean) => {
        const existingComponents = props.surveyItem.components?.items || [];
        if (checked) {
            if (classNameIndex === undefined) {
                existingComponents[titleComponentIndex].style = [
                    {
                        key: 'className',
                        value: 'sticky-top',
                    }
                ]
            } else if (classNameIndex === -1) {
                existingComponents[titleComponentIndex].style?.push({
                    key: 'className',
                    value: 'sticky-top',
                });
            } else {
                existingComponents[titleComponentIndex].style![classNameIndex].value = 'sticky-top';
            }
        } else {
            if (classNameIndex !== undefined && classNameIndex !== -1) {
                existingComponents[titleComponentIndex].style?.splice(classNameIndex, 1);
            }
        }

        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                ...props.surveyItem.components,
                role: 'root',
                items: existingComponents,
            }
        })
    }

    const onUpdateContent = (content: string) => {
        titleMap.set(selectedLanguage, content);

        const existingComponents = props.surveyItem.components?.items || [];
        existingComponents[titleComponentIndex].content = generateLocStrings(titleMap);
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
                    htmlFor='title-input'
                >
                    Title
                </Label>
                <Textarea
                    id='title-input'
                    value={titleMap.get(selectedLanguage) || ''}
                    onChange={(e) => {
                        onUpdateContent(e.target.value);
                    }}
                    placeholder='Enter title here for the selected language...'
                />
            </div>

            <Label
                htmlFor='sticky-header-switch'
                className='flex items-center gap-2'
            >
                <Switch
                    id='sticky-header-switch'
                    checked={hasStickyHeader}
                    onCheckedChange={onToggleStickyHeader}
                />
                <span>
                    Sticky header
                </span>

            </Label>
        </div>
    );
}



const AdvancedTitleEditor: React.FC<TitleEditorProps> = (props) => {
    const titleComponentIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'title');
    if (titleComponentIndex === undefined || titleComponentIndex === -1) {
        return null;
    }

    const titleComponent = props.surveyItem.components?.items[titleComponentIndex];
    if (!titleComponent) {
        return null;
    }

    const titleParts = (titleComponent as ItemGroupComponent).items || [];

    const onPartsChange = (newParts: ItemComponent[]) => {
        (titleComponent as ItemGroupComponent).items = newParts;

        const existingComponents = props.surveyItem.components?.items || [];
        existingComponents[titleComponentIndex] = titleComponent;
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
                    sortableID='title-parts-list'
                    parts={titleParts}
                    onChange={onPartsChange}
                />
            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor='global-header-class-name'
                >
                    Item header CSS classes
                </Label>
                <Input
                    id='global-header-class-name'
                    placeholder='Enter optional CSS classes for the item header...'
                    value={titleComponent.style?.find(style => style.key === 'className')?.value || ''}
                    onChange={(e) => {
                        const existingComponents = props.surveyItem.components?.items || [];
                        const classNameIndex = titleComponent.style?.findIndex(style => style.key === 'className');
                        if (classNameIndex === undefined || classNameIndex === -1) {
                            existingComponents[titleComponentIndex].style = [
                                {
                                    key: 'className',
                                    value: e.target.value,
                                }
                            ]
                        } else {
                            existingComponents[titleComponentIndex].style![classNameIndex].value = e.target.value;
                        }

                        props.onUpdateSurveyItem({
                            ...props.surveyItem,
                            components: {
                                ...props.surveyItem.components,
                                role: 'root',
                                items: existingComponents,
                            }
                        })
                    }}
                />
            </div>

        </div>
    );
}

const determineAdvancedMode = (item: SurveySingleItem) => {
    const titleComponentIndex = item.components?.items.findIndex(comp => comp.role === 'title');
    if (titleComponentIndex === undefined || titleComponentIndex === -1) {
        return false;
    }

    const titleComponent = item.components?.items[titleComponentIndex];
    if (!titleComponent) {
        return false;
    }

    return (titleComponent as ItemGroupComponent).items !== undefined && (titleComponent as ItemGroupComponent).content === undefined;
}

const TitleEditor: React.FC<TitleEditorProps> = (props) => {
    const isAdvancedMode = determineAdvancedMode(props.surveyItem);

    const onToggleAdvanceMode = (checked: boolean) => {
        if (!confirm('Are you sure you want to switch the editor mode? You will loose the current content.')) {
            return
        }

        const newTitleComp: ItemComponent = {
            role: 'title',
            items: undefined,
        };
        if (checked) {
            (newTitleComp as ItemGroupComponent).items = [];
        }


        const titleComponentIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'title');
        const existingComponents = props.surveyItem.components?.items || [];
        if (titleComponentIndex === undefined || titleComponentIndex === -1) {
            // add a new title component
            existingComponents.push(newTitleComp);
        } else {
            // update the existing title component
            existingComponents[titleComponentIndex] = newTitleComp;
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
                    htmlFor="advanced-mode-switch"
                    className='flex items-center gap-2'
                >
                    <Switch
                        id="advanced-mode-switch"
                        checked={isAdvancedMode}
                        onCheckedChange={onToggleAdvanceMode}
                    />
                    <span>
                        Use advanced mode
                    </span>
                </Label>
            </div>
            <Separator />
            {isAdvancedMode ? <AdvancedTitleEditor {...props} /> : <SimpleTitleEditor {...props} />}
        </EditorWrapper>
    );
};

export default TitleEditor;
