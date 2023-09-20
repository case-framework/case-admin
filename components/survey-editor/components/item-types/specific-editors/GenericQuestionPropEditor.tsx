import React from 'react';
import AttributeGroupsAccordion, { AttributeGroup } from './AttributeGroupsAccordion';
import { BsCheckCircle, BsChevronBarDown, BsChevronBarUp, BsEye, BsFileEarmarkCode, BsHSquare, BsInfoCircle, BsSubscript } from 'react-icons/bs';
import ItemConditionEditor from './ItemConditionEditor';
import { GenericQuestionProps } from 'case-editor-tools/surveys/types';
import ItemHeaderEditor from './ItemHeaderEditor';
import ItemHelpPopupEditor from './ItemHelpPopupEditor';
import ItemFooterEditor from './ItemFooterEditor';
import ItemComponentsEditor from './ItemComponentsEditor';
import ItemValidationEditor from './ItemValidationEditor';


interface GenericQuestionPropEditorProps {
    genericProps: GenericQuestionProps;
    specificEditGroup: AttributeGroup;
    onChange: (genericProps: GenericQuestionProps) => void;
}


const GenericQuestionPropEditor: React.FC<GenericQuestionPropEditorProps> = ({
    genericProps,
    ...props
}) => {


    return (
        <AttributeGroupsAccordion
            attributeGroups={[
                {
                    key: 'heading',
                    title: 'Header',
                    defaultOpen: true,
                    icon: <BsHSquare />,
                    content: <ItemHeaderEditor
                        genericProps={genericProps}
                        onChange={(newProps) => {
                            props.onChange(newProps);
                        }}
                    />
                },
                {
                    key: 'helpgroup',
                    title: 'Help popup',
                    icon: <BsInfoCircle />,
                    content: <ItemHelpPopupEditor
                        genericProps={genericProps}
                        onChange={(newProps) => {
                            props.onChange(newProps);
                        }}
                    />
                },
                {
                    key: 'startcontent',
                    title: 'Start content',
                    icon: <BsChevronBarUp />,
                    content: (
                        <ItemComponentsEditor
                            components={genericProps.topDisplayCompoments}
                            onChange={(components) => {
                                props.onChange({
                                    ...genericProps,
                                    topDisplayCompoments: components,
                                });
                            }}
                        />
                    )
                },
                props.specificEditGroup,
                {
                    key: 'endcontent',
                    title: 'End content',
                    icon: <BsChevronBarDown />,
                    content: (
                        <ItemComponentsEditor
                            components={genericProps.bottomDisplayCompoments}
                            onChange={(components) => {
                                props.onChange({
                                    ...genericProps,
                                    bottomDisplayCompoments: components,
                                });
                            }}
                        />
                    )
                },
                {
                    key: 'footer',
                    title: 'Footer',
                    icon: <BsSubscript />,
                    content: (
                        <ItemFooterEditor
                            genericProps={genericProps}
                            onChange={(newProps) => {
                                props.onChange(newProps);
                            }}
                        />
                    )
                },
                {
                    key: 'validations',
                    title: 'Validations',
                    icon: <BsCheckCircle />,
                    content: (
                        <ItemValidationEditor
                            genericProps={genericProps}
                            onChange={(newProps) => {
                                props.onChange(newProps);
                            }}
                        />
                    )
                },
                {
                    key: 'condition',
                    title: 'Condition',
                    icon: <BsEye />,
                    content: (
                        <ItemConditionEditor
                            condition={genericProps.condition}
                            onChange={(condition) => {
                                props.onChange({
                                    ...genericProps,
                                    condition: condition,
                                });
                            }}
                        />
                    )
                },
                {
                    key: 'advanced',
                    title: 'Advanced',
                    icon: <BsFileEarmarkCode />,
                    content: (
                        <div>
                            <p>confidential mode</p>
                            <p>metadata</p>
                        </div>
                    )
                },
            ]}
        />
    );
};

export default GenericQuestionPropEditor;
