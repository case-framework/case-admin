import React from 'react';
import EditorWrapper from './editor-wrapper';
import { Expression, ItemComponent, SurveySingleItem } from 'survey-engine/data_types';
import { AlertCircle, AlertTriangle, Trash, Type, TypeOutline } from 'lucide-react';
import SurveyLanguageToggle from '@/components/survey-editor/components/general/SurveyLanguageToggle';
import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import { filterForBodyComponents, findTopComponents } from '@/components/survey-renderer/SurveySingleItemView/utils';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import { ComponentGenerators } from 'case-editor-tools/surveys/utils/componentGenerators';
import { Separator } from '@/components/ui/separator';
import { localisedObjectToMap } from '@/components/survey-editor/utils/localeUtils';
import MarkdownContentEditor from './markdown-content-editor';
import { SimpleTextViewContentEditor } from './response-editors/text-view-content-editor';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';
import { PopoverKeyBadge } from '../KeyBadge';
import ComponentEditor, { ComponentEditorGenericProps } from './component-editor';
import SurveyExpressionEditor from '../survey-expression-editor';


interface TopContentEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}

const CONTENT_TYPE_OPTIONS = [
    { key: 'simple-text', role: 'text', label: 'Simple text', icon: <Type className='size-4 me-2 text-muted-foreground' /> },
    { key: 'markdown', role: 'markdown', label: 'Markdown', icon: <TypeOutline className='size-4 me-2 text-muted-foreground' /> },
    { key: 'error', role: 'error', label: 'Error', icon: <AlertCircle className='size-4 me-2 text-muted-foreground' /> },
    { key: 'warning', role: 'warning', label: 'Warning', icon: <AlertTriangle className='size-4 me-2 text-muted-foreground' /> },
];


const ContentPreview: React.FC<ComponentEditorGenericProps> = ({ component }) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const currentContent = localisedObjectToMap(component.content).get(selectedLanguage) || '';

    const renderContent = () => {
        switch (component.role) {

            case 'markdown':
                return <div className='text-xs text-muted-foreground uppercase font-mono'>
                    {currentContent ? 'Markdown content' : '- No content defined -'}
                </div>;
            case 'text':
            case 'error':
            case 'warning':
                return <div className='text-sm'>
                    {currentContent}
                    {!currentContent && <div className='text-xs text-muted-foreground uppercase font-mono'>{'- No content defined -'}</div>}
                </div>;
        }
    }

    return <div className="flex items-center gap-4">
        <span className='size-4'>
            {CONTENT_TYPE_OPTIONS.find(opt => opt.role === component.role)?.icon}
        </span>
        {renderContent()}
    </div>
}

const ContentQuickEditor: React.FC<ComponentEditorGenericProps> = (props) => {
    return <div>
        <SimpleTextViewContentEditor
            component={props.component}
            hideStyling={true}
            useTextArea={true}
            onChange={(newComp) => {
                props.onChange?.(newComp);
            }} />
    </div>
}

const getQuickEditor = (component: ItemComponent) => {
    if (component.role === 'markdown') {
        return undefined;
    }
    return ContentQuickEditor;
}

const ContentAdvancedEditor: React.FC<ComponentEditorGenericProps> = (props) => {
    const { selectedLanguage } = useSurveyEditorCtx();

    const currentContent = localisedObjectToMap(props.component.content).get(selectedLanguage) || '';

    const renderContent = () => {
        if (props.component.role === 'markdown') {
            return <div className=''>
                <div
                    data-no-dnd="true"
                >
                    <MarkdownContentEditor
                        content={currentContent}
                        onUpdateContent={(content) => {
                            const updatedPart = { ...props.component };
                            const updatedContent = localisedObjectToMap(updatedPart.content);
                            updatedContent.set(selectedLanguage, content);
                            updatedPart.content = generateLocStrings(updatedContent);
                            props.onChange?.(updatedPart);
                        }}
                    />
                </div>

            </div>
        }

        return <SimpleTextViewContentEditor
            component={props.component}
            hideStyling={false}
            useTextArea={true}
            onChange={(newComp) => {
                props.onChange?.(newComp);
            }} />
    }

    return <div className='space-y-4 pt-2 pb-8 min-w-[600px]'>
        <div className='flex justify-between'>
            <div className='min-w-14 w-fit flex justify-center'>
                <PopoverKeyBadge
                    headerText='Row Key'
                    className='w-full'
                    allOtherKeys={props.usedKeys?.filter(k => k !== props.component.key) ?? []}
                    isHighlighted={props.isSelected}
                    itemKey={props.component.key ?? ''}
                    onKeyChange={(newKey) => {
                        props.onChange?.({
                            ...props.component,
                            key: newKey
                        })
                    }} />
            </div>
            <div className='flex justify-end'>
                <SurveyLanguageToggle />
            </div>
        </div>

        {renderContent()}

        <Separator />

        <div className='space-y-2'>
            <h3 className='text-sm font-semibold'>
                Conditions
            </h3>

            <div>
                <SurveyExpressionEditor
                    label='Display condition'
                    expression={props.component.displayCondition as Expression | undefined}
                    onChange={(newExpression) => {
                        props.onChange?.({ ...props.component, displayCondition: newExpression });
                    }}
                />
            </div>
        </div>
    </div>
}

export const ContentItem = (props: {
    index: number, component: ItemComponent,
    isDragged: boolean,
    onUpdateComponent: (component: ItemComponent) => void,
    onDeleteComponent: () => void
    allOtherKeys?: string[]
}) => {
    return (<ComponentEditor
        isSortable={true}
        isDragged={props.isDragged}
        component={props.component}
        onChange={(newComp) => {
            props.onUpdateComponent(newComp);
        }}
        usedKeys={props.allOtherKeys}
        previewContent={ContentPreview}
        quickEditorContent={getQuickEditor(props.component)}
        advancedEditorContent={ContentAdvancedEditor}
        contextMenuItems={[
            {
                type: 'item',
                label: 'Delete',
                icon: <Trash className='size-4' />,
                onClick: () => {
                    props.onDeleteComponent();
                }
            }
        ]}
    />)
}

const TopContentEditor: React.FC<TopContentEditorProps> = (props) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);
    const { selectedLanguage } = useSurveyEditorCtx();

    const allItemComponents = props.surveyItem.components?.items || [];
    const relevantBodyComponents = filterForBodyComponents(allItemComponents);
    const topComponents = findTopComponents(relevantBodyComponents);

    const allUsedKeys = topComponents.map(comp => comp.key ?? "");

    const draggedItem = topComponents.find(comp => comp.key === draggedId);

    const onAddItem = (type: string) => {
        const randomKey = Math.random().toString(36).substring(7);
        let newComponent: ItemComponent | undefined = undefined;

        switch (type) {
            case 'simple-text':
                newComponent = {
                    key: randomKey,
                    role: 'text',
                    content: generateLocStrings(new Map([[selectedLanguage, '']])),
                    style: [],
                }
                break;
            case 'markdown':
                newComponent = ComponentGenerators.markdown({
                    key: randomKey,
                    content: new Map([[selectedLanguage, '']]),
                });
                break;
            case 'error':
                newComponent = {
                    key: randomKey,
                    role: 'error',
                    content: generateLocStrings(new Map([[selectedLanguage, '']])),
                    style: [],
                }
                break;
            case 'warning':
                newComponent = {
                    key: randomKey,
                    role: 'warning',
                    content: generateLocStrings(new Map([[selectedLanguage, '']])),
                    style: [],
                }
                break;
        }
        if (!newComponent) {
            console.warn('Unknown component type:', type);
            return;
        }

        const existingComponents = props.surveyItem.components?.items || [];
        const firstRgIndex = existingComponents.findIndex(comp => comp.role === 'responseGroup');
        if (firstRgIndex < 0) {
            existingComponents.push(newComponent);
        } else {
            existingComponents.splice(firstRgIndex, 0, newComponent);
        }

        props.onUpdateSurveyItem({
            ...props.surveyItem,
            components: {
                ...props.surveyItem.components as ItemComponent,
                items: [
                    ...existingComponents,
                ]
            }
        });
    }

    return (
        <EditorWrapper>
            <div className='flex justify-end'>
                <SurveyLanguageToggle />
            </div>

            <SortableWrapper
                sortableID={'top-content-editor'}
                direction='vertical'
                items={topComponents.map((component, index) => {
                    return {
                        id: component.key || index.toString(),
                    }
                })}
                onDraggedIdChange={(id) => {
                    setDraggedId(id);
                }}
                onReorder={(activeIndex, overIndex) => {
                    const globalActiveIndex = allItemComponents.findIndex(comp => comp.key === topComponents[activeIndex].key);
                    const globalOverIndex = allItemComponents.findIndex(comp => comp.key === topComponents[overIndex].key);

                    const newItems = [...allItemComponents];
                    newItems.splice(globalOverIndex, 0, newItems.splice(globalActiveIndex, 1)[0]);

                    const newSurveyItem = {
                        ...props.surveyItem,
                        components: {
                            ...props.surveyItem.components as ItemComponent,
                            items: newItems,
                        }
                    }
                    props.onUpdateSurveyItem(newSurveyItem);
                }}
                dragOverlayItem={(draggedId && draggedItem) ?
                    <ContentItem
                        index={-1}
                        isDragged={false}
                        component={draggedItem}
                        onDeleteComponent={() => { }}
                        onUpdateComponent={() => { }}
                    />
                    : null}
            >

                <div className='my-2 max-w-full'>
                    <ol className='flex flex-col gap-1 min-w-full'>
                        {topComponents.map((component, index) => {
                            return <ContentItem
                                key={component.key || index}
                                index={index}
                                isDragged={draggedId === component.key}
                                component={component}
                                onDeleteComponent={() => {
                                    const newItems = allItemComponents.filter(comp => comp.key !== component.key);
                                    const newSurveyItem = {
                                        ...props.surveyItem,
                                        components: {
                                            ...props.surveyItem.components as ItemComponent,
                                            items: newItems,
                                        }
                                    }
                                    props.onUpdateSurveyItem(newSurveyItem);
                                }}
                                onUpdateComponent={(updatedItem) => {
                                    const newItems = allItemComponents.map(comp => {
                                        if (comp.key === component.key) {
                                            return updatedItem;
                                        }
                                        return comp;
                                    });
                                    const newSurveyItem = {
                                        ...props.surveyItem,
                                        components: {
                                            ...props.surveyItem.components as ItemComponent,
                                            items: newItems,
                                        }
                                    }
                                    props.onUpdateSurveyItem(newSurveyItem);
                                }}
                                allOtherKeys={allUsedKeys.filter(key => key !== component.key)}
                            />
                        })}

                        <div className='flex justify-center w-full mt-4'>
                            <AddDropdown
                                options={CONTENT_TYPE_OPTIONS}
                                onAddItem={onAddItem}
                            />
                        </div>


                    </ol>
                </div>
            </SortableWrapper>
        </EditorWrapper>
    );
};

export default TopContentEditor;
