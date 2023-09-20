import { Dropdown, DropdownMenu, DropdownItem, Button, DropdownTrigger, Input, Textarea, Switch } from '@nextui-org/react';
import React from 'react';
import { BsChevronDown, BsExclamationDiamond, BsFonts, BsMarkdown, BsPlusCircleDotted, BsTrash } from 'react-icons/bs';
import { Expression, ItemComponent, ItemGroupComponent } from 'survey-engine/data_types';
import { ComponentGenerators } from 'case-editor-tools/surveys/utils/componentGenerators';
import MonacoExpressionEditor from './MonacoExpressionEditor';
import LanguageSelector from '@/components/LanguageSelector';
import { localisedStringToMap } from '../utils';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import AdvancedContentMonacoEditor from './AdvancedContentMonacoEditor';
import { DateDisplayComponentProp, ExpressionDisplayProp, StyledTextComponentProp } from 'case-editor-tools/surveys/types';
import { parseAdvancedContentProps } from '../utils';


interface ItemComponentsEditorProps {
    components?: ItemComponent[];
    onChange: (components: ItemComponent[] | undefined) => void;
}

interface CompEditorProps {
    component: ItemComponent;
    onChange: (component: ItemComponent) => void;
    onDelete: () => void;
    currentLang: string;
}

const MarkdownComponentEditor: React.FC<CompEditorProps> = ({
    currentLang,
    component,
    onChange,
    onDelete,
}) => {
    const className = component.style?.find(s => s.key === 'className')?.value;

    const contentMap = localisedStringToMap(component.content as any);
    const content = contentMap?.get(currentLang) || '';

    return <div className='border border-default-400 rounded-small px-unit-4 py-unit-2'>
        <div className='flex items-center'>
            <span className='text-default-400 grow'>
                <BsMarkdown />
            </span>
            <Button
                isIconOnly
                size='sm'
                variant='light'
                color='danger'
                onPress={() => {
                    if (confirm('Are you sure you want to remove this component?')) {
                        onDelete();
                    }
                }}
            >
                <BsTrash />
            </Button>
        </div>
        <div className='space-y-unit-sm'>
            <Input
                label='Key'
                autoComplete='off'
                labelPlacement='outside-left'
                placeholder='Enter key here'
                variant='bordered'
                size='sm'
                className='w-40'
                classNames={{
                    inputWrapper: 'bg-white'
                }}
                value={component.key}
                onValueChange={(value) => {
                    onChange({
                        ...component,
                        key: value,
                    })
                }}
            />
            <Textarea
                autoComplete='off'
                label='Content'
                placeholder='Markdown content'
                variant='bordered'
                size='sm'
                classNames={{
                    inputWrapper: 'bg-white'
                }}
                className='font-mono'
                value={content || ''}
                onValueChange={(value) => {
                    const newContent = new Map(contentMap);
                    newContent.set(currentLang, value);
                    onChange({
                        ...component,
                        content: generateLocStrings(newContent),
                    })
                }}
            />

            <Input
                label='Class name'
                placeholder='CSS class name'
                variant='bordered'
                size='sm'
                classNames={{
                    inputWrapper: 'bg-white'
                }}
                value={className || ''}
                onValueChange={(value) => {
                    const newStyle = component.style?.filter(s => s.key !== 'className') || [];
                    newStyle.push({
                        key: 'className',
                        value: value,
                    })
                    onChange({
                        ...component,
                        style: newStyle,
                    })
                }}
            />
            <Switch
                isSelected={component.displayCondition !== undefined}
                size='sm'
                onValueChange={(v) => {
                    if (v) {
                        onChange({
                            ...component,
                            displayCondition: {
                                name: 'todo',
                            },
                        })
                    } else {
                        if (confirm('Are you sure you want to remove the condition?')) {
                            onChange({
                                ...component,
                                displayCondition: undefined,
                            })
                        }
                    }
                }}
            >
                Use condition when to show
            </Switch>
            {component.displayCondition !== undefined &&
                <MonacoExpressionEditor
                    expression={component.displayCondition as (Expression | undefined)}
                    onChange={(exp) => {
                        onChange({
                            ...component,
                            displayCondition: exp,
                        })
                    }}
                />}
        </div>
    </div>
}

const TextComponentEditor: React.FC<CompEditorProps> = ({
    currentLang,
    component,
    onChange,
    onDelete,
}) => {
    const className = component.style?.find(s => s.key === 'className')?.value;

    console.log(component)

    const isSimpleText = component.content !== undefined && (component as ItemGroupComponent).items === undefined;


    const contentMap = localisedStringToMap(component.content as any);
    const content = contentMap?.get(currentLang) || '';

    return <div className='border border-default-400 rounded-small px-unit-4 py-unit-2'>
        <div className='flex items-center'>
            <span className='text-default-400 grow'>
                <BsFonts />
            </span>
            <Button
                isIconOnly
                size='sm'
                variant='light'
                color='danger'
                onPress={() => {
                    if (confirm('Are you sure you want to remove this component?')) {
                        onDelete();
                    }
                }}
            >
                <BsTrash />
            </Button>
        </div>
        <div className='space-y-unit-sm'>
            <Input
                label='Key'
                autoComplete='off'
                labelPlacement='outside-left'
                placeholder='Enter key here'
                variant='bordered'
                size='sm'
                className='w-40'
                classNames={{
                    inputWrapper: 'bg-white'
                }}
                value={component.key}
                onValueChange={(value) => {
                    onChange({
                        ...component,
                        key: value,
                    })
                }}
            />
            {isSimpleText ? <>
                <Input
                    autoComplete='off'
                    label='Content'
                    placeholder='Content of the text component'
                    variant='bordered'
                    size='sm'
                    classNames={{
                        inputWrapper: 'bg-white'
                    }}
                    className='font-mono'
                    value={content || ''}
                    onValueChange={(value) => {
                        const newContent = new Map(contentMap);
                        newContent.set(currentLang, value);
                        onChange({
                            ...component,
                            content: generateLocStrings(newContent),
                        })
                    }}
                />
                <Input
                    label='Class name'
                    placeholder='CSS class name'
                    variant='bordered'
                    size='sm'
                    classNames={{
                        inputWrapper: 'bg-white'
                    }}
                    value={className || ''}
                    onValueChange={(value) => {
                        const newStyle = component.style?.filter(s => s.key !== 'className') || [];
                        newStyle.push({
                            key: 'className',
                            value: value,
                        })
                        onChange({
                            ...component,
                            style: newStyle,
                        })
                    }}
                />
            </> :
                <>
                    <AdvancedContentMonacoEditor
                        label='Content (advanced)'
                        advancedContent={parseAdvancedContentProps((component as ItemGroupComponent).items) || []}
                        onChange={(v) => {
                            const newComp = ComponentGenerators.text({
                                key: component.key,
                                content: v as (StyledTextComponentProp | DateDisplayComponentProp | ExpressionDisplayProp)[],
                            }) as ItemGroupComponent;
                            onChange({
                                ...component,
                                items: newComp.items,
                            })
                        }}
                    />
                </>
            }

            <Switch
                size='sm'
                isSelected={!isSimpleText}
                onValueChange={(v) => {
                    if (v) {
                        onChange({
                            ...component,
                            items: [],
                            content: undefined,
                        })
                    } else {
                        if (confirm('This will clear the content, are you sure you want to proceed?')) {
                            onChange({
                                ...component,
                                items: undefined,
                                content: generateLocStrings(new Map([])),
                            })
                        }
                    }
                }}
            >
                Use advanced content
            </Switch>

            <Switch
                isSelected={component.displayCondition !== undefined}
                size='sm'
                onValueChange={(v) => {
                    if (v) {
                        onChange({
                            ...component,
                            displayCondition: {
                                name: 'todo',
                            },
                        })
                    } else {
                        if (confirm('Are you sure you want to remove the condition?')) {
                            onChange({
                                ...component,
                                displayCondition: undefined,
                            })
                        }
                    }
                }}
            >
                Use condition when to show
            </Switch>
            {component.displayCondition !== undefined &&
                <MonacoExpressionEditor
                    expression={component.displayCondition as (Expression | undefined)}
                    onChange={(exp) => {
                        onChange({
                            ...component,
                            displayCondition: exp,
                        })
                    }}
                />}
        </div>
    </div>
}

const ErrorComponentEditor: React.FC<CompEditorProps> = ({
    currentLang,
    component,
    onChange,
    onDelete,
}) => {
    const contentMap = localisedStringToMap(component.content as any);
    const content = contentMap?.get(currentLang) || '';

    return <div className='border border-default-400 rounded-small px-unit-4 py-unit-2'>
        <div className='flex items-center'>
            <span className='text-default-400 grow'>
                <BsExclamationDiamond />
            </span>
            <Button
                isIconOnly
                size='sm'
                variant='light'
                color='danger'
                onPress={() => {
                    if (confirm('Are you sure you want to remove this component?')) {
                        onDelete();
                    }
                }}
            >
                <BsTrash />
            </Button>
        </div>
        <div className='space-y-unit-sm'>
            <Input
                label='Key'
                autoComplete='off'
                labelPlacement='outside-left'
                placeholder='Enter key here'
                variant='bordered'
                size='sm'
                className='w-40'
                classNames={{
                    inputWrapper: 'bg-white'
                }}
                value={component.key}
                onValueChange={(value) => {
                    onChange({
                        ...component,
                        key: value,
                    })
                }}
            />
            <Input
                autoComplete='off'
                label='Error message'
                placeholder='Error content'
                variant='bordered'
                size='sm'
                classNames={{
                    inputWrapper: 'bg-white'
                }}
                value={content || ''}
                onValueChange={(value) => {
                    const newContent = new Map(contentMap);
                    newContent.set(currentLang, value);
                    onChange({
                        ...component,
                        content: generateLocStrings(newContent),
                    })
                }}
            />

            <Switch
                isSelected={component.displayCondition !== undefined}
                size='sm'
                onValueChange={(v) => {
                    if (v) {
                        onChange({
                            ...component,
                            displayCondition: {
                                name: 'todo',
                            },
                        })
                    } else {
                        if (confirm('Are you sure you want to remove the condition?')) {
                            onChange({
                                ...component,
                                displayCondition: undefined,
                            })
                        }
                    }
                }}
            >
                Use condition when to show
            </Switch>
            {component.displayCondition !== undefined &&
                <MonacoExpressionEditor
                    expression={component.displayCondition as (Expression | undefined)}
                    onChange={(exp) => {
                        onChange({
                            ...component,
                            displayCondition: exp,
                        })
                    }}
                />}
        </div>
    </div>
}

const ItemComponentsEditor: React.FC<ItemComponentsEditorProps> = ({
    onChange,
    components,
}) => {
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');

    const addNewComponentMenu = React.useMemo(() => {
        return <Dropdown>
            <div className='flex justify-center mt-unit-md'>
                <DropdownTrigger>

                    <Button
                        startContent={<BsPlusCircleDotted />}
                        variant="bordered"
                        color='secondary'
                        endContent={<BsChevronDown />}
                    >
                        Add
                    </Button>

                </DropdownTrigger>
            </div>
            <DropdownMenu aria-label="add new component menu"
                onAction={(key) => {
                    switch (key) {
                        case 'markdown':
                            const newcomp = ComponentGenerators.markdown({
                                key: 'newmarkdown' + (components?.length || 0),
                                content: new Map(),
                            });
                            onChange([...components || [], newcomp]);
                            break;
                        case 'text':
                            const newComp = ComponentGenerators.text({
                                key: 'newtext' + (components?.length || 0),
                                content: new Map(),
                            });
                            onChange([...components || [], newComp]);
                            break;
                        case 'error':
                            const newErrorComp: ItemComponent = {
                                key: 'newerror' + (components?.length || 0),
                                content: [],
                                role: 'error',
                            };
                            onChange([...components || [], newErrorComp]);
                            break;
                        default:
                            break;
                    }
                }}
            >
                <DropdownItem key="markdown"
                    startContent={<span className='text-default-400'>
                        <BsMarkdown />
                    </span>}
                >
                    Markdown
                </DropdownItem>
                <DropdownItem key="text"
                    startContent={<span className='text-default-400'>
                        <BsFonts />
                    </span>}
                >
                    Text
                </DropdownItem>
                <DropdownItem key="error"
                    startContent={<span className='text-danger-400'>
                        <BsExclamationDiamond />
                    </span>}
                >
                    Error
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    }, [onChange, components]);

    const componentEditors = React.useMemo(() => {
        if (!components) { return null; }

        return <>
            <div className='flex justify-end'>
                <LanguageSelector
                    onLanguageChange={(lang) => setSelectedLanguage(lang)}
                />
            </div>
            {components.map((c, i) => {
                switch (c.role) {
                    case 'markdown':
                        return <MarkdownComponentEditor
                            currentLang={selectedLanguage}
                            key={i.toFixed()}
                            component={c}
                            onChange={(newComp) => {
                                const newComps = [...components];
                                newComps[i] = newComp;
                                onChange(newComps);
                            }}
                            onDelete={() => {
                                const newComps = [...components];
                                newComps.splice(i, 1);
                                onChange(newComps);
                            }}
                        />
                    case 'text':
                        return <TextComponentEditor
                            currentLang={selectedLanguage}
                            key={i.toFixed()}
                            component={c}
                            onChange={(newComp) => {
                                const newComps = [...components];
                                newComps[i] = newComp;
                                onChange(newComps);
                            }}
                            onDelete={() => {
                                const newComps = [...components];
                                newComps.splice(i, 1);
                                onChange(newComps);
                            }}
                        />
                    case 'error':
                        return <ErrorComponentEditor
                            currentLang={selectedLanguage}
                            key={i.toFixed()}
                            component={c}
                            onChange={(newComp) => {
                                const newComps = [...components];
                                newComps[i] = newComp;
                                onChange(newComps);
                            }}
                            onDelete={() => {
                                const newComps = [...components];
                                newComps.splice(i, 1);
                                onChange(newComps);
                            }}
                        />
                    default:
                        return <div key={c.key}>todo</div>
                }
            })}
        </>
    }, [components, selectedLanguage, onChange]);

    return (
        <div className='space-y-unit-md'>
            {!components && <div className='text-center text-default-600'>
                No components
            </div>}
            {components && componentEditors}
            {addNewComponentMenu}
        </div>
    );
};

export default ItemComponentsEditor;
