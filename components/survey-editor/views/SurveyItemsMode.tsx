import React from 'react';
import ItemExplorerColumn from '../components/ItemExplorerColumn';
import { SurveyEditor } from 'case-editor-tools/surveys/survey-editor/survey-editor'
import { generatePageBreak } from 'case-editor-tools/surveys/utils/simple-generators';
import NewItemDialog from '../components/NewItemDialog';

import clsx from 'clsx';
import ItemInspector from '../components/ItemInspector';
import { SurveyGroupItem, SurveyItem } from 'survey-engine/data_types';
import EditorMenu from '../components/EditorMenu';
import MoveSurveyItemDialog from '../components/MoveSurveyItemDialog';

interface SurveyItemsModeProps {
    editorInstance: SurveyEditor;
}


const SurveyItemsMode: React.FC<SurveyItemsModeProps> = (props) => {
    const [counter, setCounter] = React.useState(0);
    const [newItemDialogMode, setNewItemDialogMode] = React.useState<{
        actionKey: string,
        path: string,
    } | null>(null);

    const [selectedItem, setSelectedItem] = React.useState<SurveyItem | null>(null);

    const [isInspectorExpanded, setIsInspectorExpanded] = React.useState(false);
    const [itemToMove, setItemToMove] = React.useState<SurveyItem | null>(null);

    return (<>
        <div className='relative h-screen'>
            <EditorMenu
                title='Survey Items'
                editorInstance={props.editorInstance}
            />
            <div className='flex pt-12 h-full relative'>
                <div className='overflow-x-scroll '>
                    <ItemExplorerColumn
                        itemGroup={props.editorInstance.getSurvey().surveyDefinition}
                        onItemSelect={(item) => {
                            setSelectedItem(item);
                        }}
                        onAddItem={(actionKey, path) => {
                            if (actionKey === 'pageBreak') {
                                props.editorInstance.addExistingSurveyItem(generatePageBreak(path), path);
                            } else {
                                setNewItemDialogMode({
                                    actionKey: actionKey,
                                    path: path,
                                });
                            }
                            setCounter(counter + 1);
                        }}
                        onItemsReorder={(newGroup) => {
                            props.editorInstance.updateSurveyItem(newGroup);
                            setCounter(counter + 1);
                        }}
                    />
                </div>
                <div className='grow'></div>
                {selectedItem &&
                    <div className={clsx('grow h-full flex min-w-[400px] border-l bg-yellow drop-shadow-[-4px_2px_5px_rgba(0,0,0,0.25)] z-10 transition',
                        {
                            'fixed right-0 top-0 pt-12 left-36': isInspectorExpanded,
                            'max-w-[500px] min-w-[500px]': !isInspectorExpanded,
                        }
                    )}>
                        <ItemInspector
                            isExpanded={isInspectorExpanded}
                            onExpandToggle={(isExpanded) => {
                                setIsInspectorExpanded(isExpanded);
                            }}
                            onDeleteItem={(itemKey) => {
                                const parentKey = itemKey.split('.').slice(0, -1).join('.');
                                console.log(parentKey);
                                const parentItem = props.editorInstance.findSurveyItem(parentKey);
                                if (!parentItem) {
                                    alert('parent item not found');
                                    return;
                                };
                                (parentItem as SurveyGroupItem).items = (parentItem as SurveyGroupItem).items.filter(item => item.key !== itemKey);
                                //props.editorInstance.removeItem(itemKey);
                                setSelectedItem(null);
                                console.warn('references not checked')
                            }}
                            selectedItem={selectedItem}
                            onClearSelection={() => {
                                setSelectedItem(null);
                                setIsInspectorExpanded(false);
                            }}

                            onItemKeyChange={(oldKey, newKey) => {
                                const itemWithSameKey = props.editorInstance.findSurveyItem(newKey);
                                if (itemWithSameKey) return false;
                                props.editorInstance.changeItemKey(oldKey, newKey)

                                const newItem = props.editorInstance.findSurveyItem(newKey);
                                if (!newItem) return false;
                                setSelectedItem({ ...newItem });
                                return true
                            }}
                            onWantsToMoveItem={(itemKey) => {
                                setItemToMove({ ...selectedItem });
                                setSelectedItem(null);
                            }}
                            onItemChange={(item) => {
                                // find parent item
                                const parentKey = item.key.split('.').slice(0, -1).join('.');
                                const parentItem = props.editorInstance.findSurveyItem(parentKey);
                                if (!parentItem) {
                                    alert('parent item not found');
                                    return;
                                };
                                // replace item in parent
                                const i = (parentItem as SurveyGroupItem).items.findIndex(i => i.key === item.key);
                                if (i < 0) {
                                    alert('item not found in parent');
                                    return;
                                }
                                (parentItem as SurveyGroupItem).items[i] = item;

                                setSelectedItem({ ...item });
                            }}
                        />
                    </div>}

            </div>
        </div>

        <MoveSurveyItemDialog
            isOpen={itemToMove !== null}
            onOpenChange={(isOpen) => {
                if (!isOpen) {
                    setItemToMove(null);
                }
            }}
            currentKey={itemToMove?.key || ''}
            surveyDefinition={props.editorInstance.getSurvey().surveyDefinition as SurveyGroupItem}
            onMoveItem={(newParentKey) => {
                if (!itemToMove) return;
                // props.editorInstance.moveSurveyItem(itemToMove, newParentKey);
                // remove old item
                const oldItemKey = itemToMove.key;
                const oldParentKey = itemToMove.key.split('.').slice(0, -1).join('.');

                const parentItem = props.editorInstance.findSurveyItem(oldParentKey);
                if (!parentItem) {
                    alert('parent item not found');
                    return;
                };
                const newItemKey = itemToMove.key.replace(oldParentKey, newParentKey);
                props.editorInstance.changeItemKey(oldItemKey, newItemKey);

                const tempItem: SurveyItem = { ...(parentItem as SurveyGroupItem).items.find(item => item.key === newItemKey) } as SurveyItem;
                (parentItem as SurveyGroupItem).items = (parentItem as SurveyGroupItem).items.filter(item => item.key !== newItemKey);
                //props.editorInstance.removeItem(itemKey);

                // insert new item
                if (!tempItem) {
                    alert('item during move could not be found');
                    return;
                }
                props.editorInstance.addExistingSurveyItem(tempItem, newParentKey);


                setSelectedItem(null);
                console.warn('references not checked')
                setItemToMove(null);
            }}
        />
        <NewItemDialog
            currentMode={newItemDialogMode}
            onCreateItem={(item, path) => {
                props.editorInstance.addExistingSurveyItem(item, path);
                setNewItemDialogMode(null);
                setCounter(counter + 1);
            }}
            onClose={() => {
                setNewItemDialogMode(null);
            }}
        />
    </>
    );
};

export default SurveyItemsMode;
