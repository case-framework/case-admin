import React from 'react';
import EditorWrapper from './editor-wrapper';
import { ItemComponent, SurveySingleItem } from 'survey-engine/data_types';
import { AlertCircle, AlertTriangle, Type } from 'lucide-react';
import SurveyLanguageToggle from '@/components/survey-editor/components/general/SurveyLanguageToggle';
import SortableWrapper from '@/components/survey-editor/components/general/SortableWrapper';
import AddDropdown from '@/components/survey-editor/components/general/add-dropdown';
import { filterForBodyComponents, findBottomComponents } from '@/components/survey-renderer/SurveySingleItemView/utils';
import { generateLocStrings } from 'case-editor-tools/surveys/utils/simple-generators';
import { ComponentGenerators } from 'case-editor-tools/surveys/utils/componentGenerators';
import { ContentItem } from './top-content-editor';
import { useSurveyEditorCtx } from '@/components/survey-editor/surveyEditorContext';

interface BottomContentEditorProps {
    surveyItem: SurveySingleItem;
    onUpdateSurveyItem: (item: SurveySingleItem) => void;
}


const BottomContentEditor: React.FC<BottomContentEditorProps> = (props) => {
    const [draggedId, setDraggedId] = React.useState<string | null>(null);
    const { selectedLanguage } = useSurveyEditorCtx();

    const allItemComponents = props.surveyItem.components?.items || [];
    const relevantBodyComponents = filterForBodyComponents(allItemComponents);
    const topComponents = findBottomComponents(relevantBodyComponents);

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
        existingComponents.push(newComponent);

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
                        component={draggedItem}
                        isDragged={false}
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
                                component={component}
                                isDragged={draggedId === component.key}
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
                            />
                        })}

                        <div className='flex justify-center w-full mt-4'>
                            <AddDropdown
                                options={[
                                    { key: 'simple-text', label: 'Simple text', icon: <Type className='size-4 me-2 text-muted-foreground' /> },
                                    { key: 'markdown', label: 'Markdown', icon: <Type className='size-4 me-2 text-muted-foreground' /> },
                                    { key: 'error', label: 'Error', icon: <AlertCircle className='size-4 me-2 text-muted-foreground' /> },
                                    { key: 'warning', label: 'Warning', icon: <AlertTriangle className='size-4 me-2 text-muted-foreground' /> },
                                ]}
                                onAddItem={onAddItem}
                            />
                        </div>


                    </ol>
                </div>
            </SortableWrapper>
        </EditorWrapper>
    );
};

export default BottomContentEditor;
