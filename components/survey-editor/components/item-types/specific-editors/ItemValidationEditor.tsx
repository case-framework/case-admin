import { Switch } from '@nextui-org/react';
import { GenericQuestionProps } from 'case-editor-tools/surveys/types';
import React from 'react';
import MonacoValidationEditor from './MonacoValidationEditor';

interface ItemValidationEditorProps {
    genericProps: GenericQuestionProps;
    onChange: (genericProps: GenericQuestionProps) => void;
}

const ItemValidationEditor: React.FC<ItemValidationEditorProps> = (props) => {
    return (
        <div>
            <Switch
                isSelected={props.genericProps.isRequired}
                onValueChange={(value) => {
                    props.onChange({
                        ...props.genericProps,
                        isRequired: value,
                    });
                }}
            >
                {'Use simple "has response" validation'}
            </Switch>

            <div className='pt-unit-md'>
                <p>Optionally, you can define custom validations here:</p>
                <MonacoValidationEditor
                    validations={props.genericProps.customValidations}
                    onChange={(validations) => {
                        props.onChange({
                            ...props.genericProps,
                            customValidations: validations,
                        });
                    }}
                />
            </div>
        </div>
    );
};

export default ItemValidationEditor;
