import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { cn } from '@/lib/utils';
import React, { useContext } from 'react';
import { Survey, SurveyGroupItem, SurveyItem } from 'survey-engine/data_types';
import { SurveyEditor as EditorInstance } from 'case-editor-tools/surveys/survey-editor/survey-editor';
import CompactExplorer from './explorer/CompactExplorer';
import ExplorerColumn from './explorer/ExplorerColumn';
import EditorView from './editor/EditorView';
import { ItemTypeKey, getParentKeyFromFullKey, getSurveyItemsAsFlatList, isValidSurveyItemGroup } from '../../utils/utils';
import { toast } from 'sonner';
import { generateNewItemForType } from '../../utils/new-item-init';
import { SurveyEditorContext } from '../../surveyEditorContext';
import { ItemEditorContextProvider } from './item-editor-context';

interface ItemEditorProps {
    className?: string;

}

const ItemEditor: React.FC<ItemEditorProps> = (props) => {
    const {
        survey,
        setSurvey,
    } = useContext(SurveyEditorContext);
    const [isCollapsed, setIsCollapsed] = React.useState(true);
    const [editorInstance, setEditorInstance] = React.useState<EditorInstance | undefined>(survey ? new EditorInstance(survey) : undefined);
    const [selectedItemKey, setSelectedItemKey] = React.useState<string | null>(survey?.surveyDefinition.key || null);
    const [currentPath, setCurrentPath] = React.useState<string | null>(null);
    //const [counter, setCounter] = React.useState(0);

    React.useEffect(() => {
        if (survey) {
            const newEditorInstance = new EditorInstance(survey);
            setEditorInstance(newEditorInstance);

            if (currentPath) {
                const parentItem = newEditorInstance.findSurveyItem(currentPath);
                if (!parentItem || parentItem.key !== currentPath) {
                    setCurrentPath(survey.surveyDefinition.key);
                    return;
                }
            } else {
                setCurrentPath(survey.surveyDefinition.key);
            }
        }
    }, [survey, currentPath]);

    if (!editorInstance) {
        return <div>load survey first...</div>
    }

    const onAddNewSurveyItem = (newItemInfos: { itemType: string; parentKey: string; }) => {
        const parentItem = editorInstance.findSurveyItem(newItemInfos.parentKey);
        if (!parentItem || !isValidSurveyItemGroup(parentItem)) {
            console.warn('Parent not found or not a group: ', newItemInfos.parentKey);
            return;
        }

        const newSurveyItem = generateNewItemForType({
            itemType: newItemInfos.itemType as ItemTypeKey,
            parentKey: parentItem.key,
            otherKeys: parentItem.items?.map(item => item.key) ?? [],
        });

        if (newSurveyItem) {
            const createdItem = editorInstance.addExistingSurveyItem(newSurveyItem, newItemInfos.parentKey);
            if (createdItem) {
                setSelectedItemKey(createdItem.key);
            }
        }
        toast.success('New item added');
        setSurvey(editorInstance.getSurvey());
    }

    const onInsertFromClipboard = async (parentKey: string) => {
        try {
            const clipboardContent = await navigator.clipboard.readText();
            const content = JSON.parse(clipboardContent);

            if (!content || !content.key || content.key === '') {
                toast.error('Clipboard content is not valid');
                return;
            }

            const oldKey = content.key as string;
            if (oldKey === parentKey) {
                toast.error("Can't insert item into itself");
                return;
            }

            let copiedItemKey = oldKey.split('.').pop();
            if (copiedItemKey === undefined) {
                toast.error('Clipboard content is not valid');
                return;
            }

            const parentItem = editorInstance.findSurveyItem(parentKey);
            if (!parentItem || !isValidSurveyItemGroup(parentItem)) {
                console.warn('Parent not found or not a group: ', parentKey);
                toast.error('Parent not found or not a group');
                return;
            }

            // check if item already exists
            const existingItem = parentItem.items?.find(item => {
                const itemKey = item.key.split('.').pop();
                return itemKey === copiedItemKey;
            })
            if (existingItem) {
                copiedItemKey = copiedItemKey + '_copy';
            }

            const newKey = parentKey + '.' + copiedItemKey;
            let newClipboardContent = clipboardContent.replaceAll(`"${oldKey}"`, `"${newKey}"`);
            newClipboardContent = newClipboardContent.replaceAll(`"${oldKey}.`, `"${newKey}.`);
            const contentToInsert = JSON.parse(newClipboardContent);

            const createdItem = editorInstance.addExistingSurveyItem(contentToInsert, parentKey);
            if (createdItem) {
                setSelectedItemKey(createdItem.key);
            } else {
                toast.error('Failed to insert item');
            }
        } catch (error) {
            toast.error('Error reading clipboard content');
            console.error(error);
        }

    }

    return (
        <ItemEditorContextProvider
            selectedItemKey={selectedItemKey}
            setSelectedItemKey={setSelectedItemKey}
            currentPath={currentPath}
            setCurrentPath={setCurrentPath}
        >
            <div
                className={cn('overflow-hidden', props.className)}
            >
                <ResizablePanelGroup direction="horizontal">
                    <ResizablePanel
                        minSize={15}
                        maxSize={60}
                        defaultSize={1}
                        collapsedSize={1}
                        collapsible={true}
                        className='min-w-[56px]'
                        onCollapse={() => {
                            setIsCollapsed(true);
                        }}
                        onExpand={() => {
                            setIsCollapsed(false);
                        }}
                    >
                        <div className='w-full bg-black/10 overflow-auto overscroll-contain h-full'
                        >
                            {
                                isCollapsed && <CompactExplorer
                                    root={{ ...editorInstance.getSurvey().surveyDefinition }}
                                    selectedItemId={selectedItemKey}
                                    currentPath={currentPath}
                                    onSelectItem={(itemKey) => {
                                        setSelectedItemKey(itemKey);
                                    }}
                                    onChangePath={(newPath) => {
                                        setCurrentPath(newPath);
                                    }}
                                    onAddItem={onAddNewSurveyItem}
                                    onInsertFromClipboard={onInsertFromClipboard}
                                    onItemsReorder={(newGroup) => {
                                        editorInstance.updateSurveyItem(newGroup);
                                        setSurvey(editorInstance.getSurvey());
                                    }}
                                />
                            }

                            {
                                !isCollapsed && <ExplorerColumn
                                    root={{ ...editorInstance.getSurvey().surveyDefinition }}
                                    selectedItemId={selectedItemKey}
                                    currentPath={currentPath}
                                    onSelectItem={(itemKey) => {
                                        setSelectedItemKey(itemKey);
                                    }}
                                    onChangePath={(newPath) => {
                                        setCurrentPath(newPath);
                                    }}
                                    onAddItem={onAddNewSurveyItem}
                                    onInsertFromClipboard={onInsertFromClipboard}
                                    onItemsReorder={(newGroup) => {
                                        editorInstance.updateSurveyItem(newGroup);
                                        setSurvey(editorInstance.getSurvey());
                                    }}
                                />
                            }
                        </div>
                    </ResizablePanel>

                    <ResizableHandle withHandle
                        className='bg-neutral-300 cursor-col-resize'
                    />

                    <ResizablePanel
                        defaultSize={67}
                    >
                        <div className='w-full overflow-auto h-full'
                        >
                            <EditorView
                                surveyItem={selectedItemKey ? editorInstance.findSurveyItem(selectedItemKey) : undefined}
                                surveyItemList={getSurveyItemsAsFlatList(editorInstance.getSurvey().surveyDefinition)}

                                onChangeItemColor={(newColor) => {
                                    if (selectedItemKey) {
                                        const item = editorInstance.findSurveyItem(selectedItemKey);
                                        if (item) {
                                            if (!item.metadata) {
                                                item.metadata = {};
                                            }
                                            item.metadata.editorItemColor = newColor;
                                            editorInstance.updateSurveyItem(item);
                                            setSurvey(editorInstance.getSurvey());
                                        }
                                    }
                                }}
                                onDeleteItem={(itemKey) => {
                                    const parentKey = getParentKeyFromFullKey(itemKey);
                                    const parentItem = editorInstance.findSurveyItem(parentKey);
                                    if (!parentItem || !isValidSurveyItemGroup(parentItem)) {
                                        console.warn('Parent not found or not a group: ', itemKey);
                                        return;
                                    }
                                    (parentItem as SurveyGroupItem).items = (parentItem as SurveyGroupItem).items.filter(item => item.key !== itemKey);
                                    editorInstance.updateSurveyItem(parentItem);
                                    if (selectedItemKey === itemKey) {
                                        setSelectedItemKey(parentItem.key);
                                    }
                                    const updatedSurvey = editorInstance.getSurvey();
                                    updatedSurvey.prefillRules = updatedSurvey.prefillRules?.filter(rule => {
                                        if (!rule.data || rule.data.length < 1) {
                                            return false;
                                        }
                                        return rule.data[0].str !== itemKey;
                                    })
                                    setSurvey(updatedSurvey);
                                    toast(`Item "${itemKey}" deleted`);
                                }}
                                onMoveItem={(newParentKey, oldItemKey) => {
                                    const oldParentKey = getParentKeyFromFullKey(oldItemKey);

                                    const parentItem = editorInstance.findSurveyItem(oldParentKey);
                                    if (!parentItem) {
                                        alert('parent item not found');
                                        return;
                                    };

                                    const itemToMove = editorInstance.findSurveyItem(oldItemKey);
                                    if (!itemToMove) {
                                        alert('item to move not found');
                                        return;
                                    }
                                    const newItemKey = itemToMove.key.replace(oldParentKey, newParentKey);


                                    const existingItemWithSameKey = editorInstance.findSurveyItem(newItemKey);
                                    if (existingItemWithSameKey) {
                                        alert('item with same key already exists, rename the item first');
                                        return;
                                    }

                                    editorInstance.changeItemKey(oldItemKey, newItemKey);

                                    const tempItem: SurveyItem = { ...(parentItem as SurveyGroupItem).items.find(item => item.key === newItemKey) } as SurveyItem;
                                    (parentItem as SurveyGroupItem).items = (parentItem as SurveyGroupItem).items.filter(item => item.key !== newItemKey);
                                    editorInstance.addExistingSurveyItem(tempItem, newParentKey);

                                    // insert new item
                                    if (!tempItem) {
                                        alert('item during move could not be found');
                                        return;
                                    }

                                    setCurrentPath(newParentKey);
                                    setSelectedItemKey(newItemKey);

                                    toast(`Move successful. New item key: "${newItemKey}"`, {
                                        description: 'References to the item are not updated. Please update them manually.'
                                    });
                                    const updatedSurvey = editorInstance.getSurvey();
                                    updatedSurvey.prefillRules = updatedSurvey.prefillRules?.map(rule => {
                                        if (!rule.data || rule.data.length < 1) {
                                            return rule;
                                        }
                                        if (rule.data[0].str === oldItemKey) {
                                            rule.data[0].str = newItemKey;
                                        }
                                        return rule;
                                    })
                                    setSurvey(editorInstance.getSurvey());
                                }}
                                onChangeKey={(oldKey, newKey) => {
                                    let surveyJSON = editorInstance.getSurveyJSON();
                                    surveyJSON = surveyJSON.replaceAll(`"${oldKey}"`, `"${newKey}"`);
                                    surveyJSON = surveyJSON.replaceAll(`"${oldKey}.`, `"${newKey}.`);
                                    const survey = JSON.parse(surveyJSON) as Survey;
                                    setEditorInstance(new EditorInstance(survey));

                                    setSelectedItemKey(newKey);
                                    setSurvey(survey);
                                    toast(`Key changed from "${oldKey}" to "${newKey}"`, {
                                        description: 'References to the item are also updated.'
                                    });
                                }}
                                onUpdateSurveyItem={(item) => {
                                    if (!editorInstance.findSurveyItem(item.key)) {
                                        toast(`Couldn't find survey item with key "${item.key}".`,
                                            {
                                                description: 'To change the key, use the key editor feature instead of the source editor.'
                                            }
                                        )
                                        return;
                                    }
                                    editorInstance.updateSurveyItem(item);
                                    setSurvey(editorInstance.getSurvey());
                                    toast('Survey item updated')
                                }}
                            />
                        </div>
                    </ResizablePanel>

                </ResizablePanelGroup>
            </div>
        </ItemEditorContextProvider>
    );
};

export default ItemEditor;
