import LanguageSelector from '@/components/LanguageSelector';
import NotImplemented from '@/components/NotImplemented';
import { Accordion, AccordionItem, Divider, Textarea } from '@nextui-org/react';
import React from 'react';
import { BsBraces, BsBracesAsterisk, BsCardText, BsEye, BsTextarea } from 'react-icons/bs';
import { Expression } from 'survey-engine/data_types';
import AttributeGroupsAccordion from './specific-editors/AttributeGroupsAccordion';
import ItemConditionEditor from './specific-editors/ItemConditionEditor';

export interface SurveyEndAttributes {
    key: string;
    content: Map<string, string>;
    condition?: Expression;
}

interface SurveyEndAttributeEditorProps {
    attributes: SurveyEndAttributes;
    onChange: (attributes: SurveyEndAttributes) => void;
}

const SurveyEndAttributeEditor: React.FC<SurveyEndAttributeEditorProps> = (props) => {
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');

    const currentContent = props.attributes.content.get(selectedLanguage) || '';

    return (
        <AttributeGroupsAccordion
            attributeGroups={[
                {
                    key: 'content',
                    title: 'Content',
                    icon: <BsBraces />,
                    content: (
                        <div className='space-y-unit-sm'>
                            <div className='flex justify-start'>
                                <LanguageSelector
                                    onLanguageChange={(lang) => setSelectedLanguage(lang)}
                                />
                            </div>

                            <Textarea
                                label='Content'
                                // labelPlacement='outside'
                                variant='bordered'
                                value={currentContent}
                                placeholder='Enter content here'
                                description='This text will be displayed next to the submit button'
                                onValueChange={(value) => {
                                    const newContent = new Map(props.attributes.content);
                                    newContent.set(selectedLanguage, value);
                                    props.onChange({
                                        ...props.attributes,
                                        content: newContent,
                                    });
                                }}
                            />
                        </div>
                    )
                },
                {
                    key: 'condition',
                    title: 'Condition',
                    icon: <BsEye />,
                    content: (
                        <ItemConditionEditor
                            condition={props.attributes.condition}
                            onChange={(condition) => {
                                props.onChange({
                                    ...props.attributes,
                                    condition: condition,
                                });
                            }}
                        />
                    )
                }
            ]}
        />
    );
};

export default SurveyEndAttributeEditor;
