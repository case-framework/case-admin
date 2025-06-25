import { localisedObjectToMap } from '@/components/survey-editor/old/utils/localeUtils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import React from 'react';
import { ItemComponent, ItemGroupComponent, SurveySingleItem } from 'survey-engine/data_types';
import MarkdownContentEditor from '../markdown-content-editor';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';

interface ConsentProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const Consent: React.FC<ConsentProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const rgIndex = props.surveyItem.components?.items.findIndex(comp => comp.role === 'responseGroup');
    if (rgIndex === undefined || rgIndex === -1) {
        return <p>Response group not found</p>;
    }
    const rg = props.surveyItem.components?.items[rgIndex] as ItemGroupComponent;
    if (!rg || !rg.items) {
        return <p>Response group not found</p>;
    }

    const consentCompIndex = rg.items.findIndex(comp => comp.role === 'consent');
    if (consentCompIndex === undefined || consentCompIndex === -1) {
        return <p>Consent not found</p>;
    }

    const consentComp = rg.items[consentCompIndex] as ItemGroupComponent;
    if (!consentComp) {
        return <p>Consent not found</p>;
    }

    const labelComp = consentComp.items.find(item => item.role === 'label');
    const titleComp = consentComp.items.find(item => item.role === 'title');
    const descriptionComp = consentComp.items.find(item => item.role === 'description');
    const contentComp = consentComp.items.find(item => item.role === 'content')

    const acceptBtn = consentComp.items.find(item => item.role === 'acceptBtn');
    const rejectBtn = consentComp.items.find(item => item.role === 'rejectBtn');

    const onChange = (newComp: ItemComponent) => {
        if (consentComp.items.findIndex(item => item.role === newComp.role) === -1) {
            consentComp.items.push(newComp);
        }
        consentComp.items = consentComp.items.map(item => {
            if (item.role === newComp.role) {
                return newComp;
            }
            return item;
        });
        const existingComponents = props.surveyItem.components?.items || [];
        (existingComponents[rgIndex] as ItemGroupComponent).items[consentCompIndex] = consentComp;
        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                role: props.surveyItem.components!.role,
                ...props.surveyItem.components,
                items: existingComponents,
            }
        });

    };

    return (
        <div className='space-y-4'>
            <div className='space-y-1.5'>
                <Label
                    htmlFor='consent-label'
                >
                    Label
                </Label>
                <Input
                    id='consent-label'
                    value={localisedObjectToMap(labelComp?.content).get(selectedLanguage) || ''}
                    onChange={(e) => {
                        const updatedComponent = { ...labelComp } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        onChange(updatedComponent);
                    }}
                    placeholder='Enter label for selected language...'
                />
            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor='consent-title'
                >
                    Dialog title
                </Label>
                <Input
                    id='consent-title'
                    value={localisedObjectToMap(titleComp?.content).get(selectedLanguage) || ''}
                    onChange={(e) => {
                        const updatedComponent = { ...titleComp } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        onChange(updatedComponent);
                    }}
                    placeholder='Enter title for selected language...'
                />
            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor='consent-description'
                >
                    Dialog description
                </Label>
                <Input
                    id='consent-description'
                    value={localisedObjectToMap(descriptionComp?.content).get(selectedLanguage) || ''}
                    onChange={(e) => {
                        const updatedComponent = { key: 'description', role: 'description', ...descriptionComp } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        onChange(updatedComponent);
                    }}
                    placeholder='E.g. instructions for the consent dialog...'
                />
            </div>

            <div><div
                className='flex items-end justify-between mb-2'
            >
                <p className='font-semibold'>
                    Content
                </p>
            </div>

                <MarkdownContentEditor
                    content={localisedObjectToMap(contentComp?.content).get(selectedLanguage) || ''}
                    onUpdateContent={(content) => {
                        const updatedComponent = { ...contentComp } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, content);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        onChange(updatedComponent);
                    }}
                />
            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor='consent-accept-btn'
                >
                    Accept button
                </Label>
                <Input
                    id='consent-accept-btn'
                    value={localisedObjectToMap(acceptBtn?.content).get(selectedLanguage) || ''}
                    onChange={(e) => {
                        const updatedComponent = { ...acceptBtn } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        onChange(updatedComponent);
                    }}
                    placeholder='Enter accept button for selected language...'
                />
            </div>

            <div className='space-y-1.5'>
                <Label
                    htmlFor='consent-reject-btn'
                >
                    Reject button
                </Label>
                <Input
                    id='consent-reject-btn'
                    value={localisedObjectToMap(rejectBtn?.content).get(selectedLanguage) || ''}
                    onChange={(e) => {
                        const updatedComponent = { ...rejectBtn } as ItemComponent;
                        const updatedContent = localisedObjectToMap(updatedComponent.content);
                        updatedContent.set(selectedLanguage, e.target.value);
                        updatedComponent.content = generateLocStrings(updatedContent);
                        onChange(updatedComponent);
                    }}
                    placeholder='Enter reject button for selected language...'
                />
            </div>
        </div>
    );
};

export default Consent;
