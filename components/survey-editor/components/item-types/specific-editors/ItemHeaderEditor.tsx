import LanguageSelector from '@/components/LanguageSelector';
import { Divider, Input, Switch } from '@nextui-org/react';
import React from 'react';
import AdvancedContentMonacoEditor from './AdvancedContentMonacoEditor';
import { DateDisplayComponentProp, ExpressionDisplayProp, GenericQuestionProps, StyledTextComponentProp } from 'case-editor-tools/surveys/types';

interface ItemHeaderEditorProps {
    genericProps: GenericQuestionProps;
    onChange: (genericProps: GenericQuestionProps) => void;
}


const ItemHeaderEditor: React.FC<ItemHeaderEditorProps> = (props) => {
    const isSimpleTitle = !Array.isArray(props.genericProps.questionText);

    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');

    const currentTitle = isSimpleTitle ? (props.genericProps.questionText as Map<string, string>).get(selectedLanguage) : '';

    return (
        <div className='flex flex-col gap-unit-md'>
            <div className='flex justify-end'>
                <LanguageSelector
                    onLanguageChange={(lang) => setSelectedLanguage(lang)}
                />
            </div>

            {isSimpleTitle && <Input
                id='item-title'
                label="Title"
                variant='bordered'
                placeholder="Enter title here"
                autoComplete='off'
                classNames={{
                    inputWrapper: 'bg-white'
                }}
                value={currentTitle || ''}
                onValueChange={(value) => {
                    if (isSimpleTitle) {
                        const newContent = new Map(props.genericProps.questionText as Map<string, string>);
                        newContent.set(selectedLanguage, value);
                        props.onChange({
                            ...props.genericProps,
                            questionText: newContent,
                        });
                    }
                }}
            />}
            {!isSimpleTitle &&
                <AdvancedContentMonacoEditor
                    label='Title (advanced)'
                    advancedContent={props.genericProps.questionText as (StyledTextComponentProp | DateDisplayComponentProp | ExpressionDisplayProp)[]}
                    onChange={(v) => {
                        if (!isSimpleTitle) {
                            props.onChange({
                                ...props.genericProps,
                                questionText: v as (StyledTextComponentProp | DateDisplayComponentProp | ExpressionDisplayProp)[],
                            })
                        }
                    }}
                />}
            <Switch size='sm'
                isSelected={!isSimpleTitle}
                onValueChange={(v) => {
                    if (confirm(`When switching to ${isSimpleTitle ? 'advanced' : 'simple'} mode, the ${isSimpleTitle ? 'simple' : 'advanced'} content will be lost. Do you want to continue?`)) {
                        if (v) {
                            props.onChange({
                                ...props.genericProps,
                                questionText: [],
                            })
                        } else {
                            props.onChange({
                                ...props.genericProps,
                                questionText: new Map([]),
                            })
                        }
                    }
                }}
            >
                Use advanced title
            </Switch>

            <Divider />

            <Input
                id='item-subtitle'
                label="Subtitle"
                variant='bordered'
                autoComplete='off'
                classNames={{
                    inputWrapper: 'bg-white'
                }}
                placeholder="Enter subtitle here"
                description="This text will be displayed below the title with a smaller font size."
                value={props.genericProps.questionSubText?.get(selectedLanguage) || ''}
                onValueChange={(value) => {
                    const newContent = new Map(props.genericProps.questionSubText);
                    newContent.set(selectedLanguage, value);
                    props.onChange({
                        ...props.genericProps,
                        questionSubText: newContent,
                    });
                }}
            />


            <Switch size='sm'
                isSelected={
                    props.genericProps.titleClassName === 'sticky-top'
                }
                onValueChange={(v) => {
                    if (v) {
                        props.onChange({
                            ...props.genericProps,
                            titleClassName: 'sticky-top',
                        })
                    } else {
                        props.onChange({
                            ...props.genericProps,
                            titleClassName: undefined,
                        })
                    }
                }}
            >
                Sticky header
            </Switch>
        </div>
    );
};

export default ItemHeaderEditor;
