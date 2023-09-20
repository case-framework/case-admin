import LanguageSelector from '@/components/LanguageSelector';
import { Button, Input, Switch, Textarea } from '@nextui-org/react';
import React from 'react';
import { GenericQuestionProps } from 'case-editor-tools/surveys/types';

interface ItemHelpPopupEditorProps {
    genericProps: GenericQuestionProps;
    onChange: (genericProps: GenericQuestionProps) => void;
}

const HelpGroupEditor: React.FC<{
    helpGroupContent: Array<{
        content: Map<string, string>;
        style?: Array<{ key: string, value: string }>;
    }>
    selectedLanguage?: string;
    onChange: (newContent: Array<{
        content: Map<string, string>;
        style?: Array<{ key: string, value: string }>;
    }>) => void;
}> = (props) => {
    return (
        <div className='bg-content2 p-3 rounded-small space-y-unit-sm divide-y divide-default-400'>
            {props.helpGroupContent.map((h, i) => {
                const content = h.content.get(props.selectedLanguage || '') || '';
                const className = h.style?.find(s => s.key === 'className')?.value;
                return (
                    <div key={i} className='flex flex-col pt-unit-sm'>
                        <Textarea
                            id={'help-item-content' + i}
                            autoComplete='off'
                            label='Content'
                            variant='bordered'
                            classNames={{
                                inputWrapper: 'bg-white'
                            }}
                            value={content}
                            onValueChange={(value) => {
                                const newContent = [...props.helpGroupContent];
                                const newHelpItem = {
                                    ...newContent[i],
                                    content: new Map(newContent[i].content),
                                };
                                newHelpItem.content.set(props.selectedLanguage || '', value);
                                newContent[i] = newHelpItem;
                                props.onChange(newContent);
                            }}
                        />
                        <Input
                            id={'help-item-class-name' + i}
                            autoComplete='off'
                            label='Class name'
                            placeholder='Enter class name here to style the help item'
                            variant='bordered'
                            classNames={{
                                inputWrapper: 'bg-white'
                            }}
                            size='sm'
                            value={className || ''}
                            onValueChange={(value) => {
                                const newContent = [...props.helpGroupContent];
                                const newHelpItem = {
                                    ...newContent[i],
                                    style: newContent[i].style || [],
                                };
                                const styleIndex = newHelpItem.style.findIndex(s => s.key === 'className');
                                if (styleIndex > -1) {
                                    newHelpItem.style[styleIndex] = {
                                        key: 'className',
                                        value: value,
                                    }
                                } else {
                                    newHelpItem.style.push({
                                        key: 'className',
                                        value: value,
                                    })
                                }
                                newContent[i] = newHelpItem;
                                props.onChange(newContent);
                            }}
                        />
                        <Button
                            onPress={() => {
                                if (confirm('Are you sure you want to delete this help item?')) {
                                    const newContent = [...props.helpGroupContent];
                                    newContent.splice(i, 1);
                                    props.onChange(newContent);
                                }
                            }}
                            color='danger'
                            className='mt-1'
                            variant='light'
                        >
                            Delete
                        </Button>
                    </div>
                )
            })}
            <div className='flex flex-col pt-unit-sm'>
                <Button
                    onPress={() => {
                        const newContent = [...props.helpGroupContent];
                        newContent.push({
                            content: new Map([]),
                        });
                        props.onChange(newContent);
                    }}
                >
                    Add new help item
                </Button>
            </div>
        </div>
    )
}

const ItemHelpPopupEditor: React.FC<ItemHelpPopupEditorProps> = (props) => {
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');


    return (
        <div className='flex flex-col gap-unit-md'>



            <Switch size='sm'
                isSelected={
                    props.genericProps.helpGroupContent !== undefined
                }
                onValueChange={(v) => {
                    if (v) {
                        props.onChange({
                            ...props.genericProps,
                            helpGroupContent: [],
                        })
                    } else {
                        if (confirm('Are you sure you want to delete the help group?')) {
                            props.onChange({
                                ...props.genericProps,
                                helpGroupContent: undefined,
                            })
                        }
                    }
                }}
            >
                Use help popup
            </Switch>
            {
                props.genericProps.helpGroupContent !== undefined && <><div className='flex justify-end'>
                    <LanguageSelector
                        onLanguageChange={(lang) => setSelectedLanguage(lang)}
                    />
                </div><HelpGroupEditor
                        helpGroupContent={props.genericProps.helpGroupContent}
                        selectedLanguage={selectedLanguage}
                        onChange={(newContent) => {
                            props.onChange({
                                ...props.genericProps,
                                helpGroupContent: newContent,
                            })
                        }}
                    />
                </>
            }

        </div>
    );
};

export default ItemHelpPopupEditor;
