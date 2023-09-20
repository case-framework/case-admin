import LanguageSelector from '@/components/LanguageSelector';
import { Switch, Input } from '@nextui-org/react';
import { GenericQuestionProps } from 'case-editor-tools/surveys/types';
import React from 'react';

interface ItemFooterEditorProps {
    genericProps: GenericQuestionProps;
    onChange: (genericProps: GenericQuestionProps) => void;
}

const ItemFooterEditor: React.FC<ItemFooterEditorProps> = (props) => {
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');

    const hasFooter = props.genericProps.footnoteText !== undefined;

    return (
        <div>
            <Switch
                size='sm'
                isSelected={hasFooter}
                onValueChange={(v) => {
                    if (v) {
                        props.onChange({
                            ...props.genericProps,
                            footnoteText: new Map<string, string>(),
                        })
                    } else {
                        if (confirm('Are you sure you want to delete the footer?')) {
                            props.onChange({
                                ...props.genericProps,
                                footnoteText: undefined,
                            })
                        }
                    }
                }}
            >
                Use footer
            </Switch>
            {hasFooter && <div>
                <div className='flex justify-end mb-unit-sm'>
                    <LanguageSelector
                        onLanguageChange={(lang) => setSelectedLanguage(lang)}
                    />
                </div>
                <Input
                    id='item-footer'
                    label='Footer content'
                    variant='bordered'
                    placeholder='Enter footer content here'
                    autoComplete='off'
                    classNames={{
                        inputWrapper: 'bg-white'
                    }}
                    value={props.genericProps.footnoteText?.get(selectedLanguage) || ''}
                    onValueChange={(value) => {
                        const newContent: Map<string, string> = props.genericProps.footnoteText !== undefined ? props.genericProps.footnoteText : new Map([]);
                        newContent.set(selectedLanguage, value);
                        props.onChange({
                            ...props.genericProps,
                            footnoteText: newContent,
                        });
                    }}
                />
            </div>}
        </div>
    );
};

export default ItemFooterEditor;
