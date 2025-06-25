'use client';

import { Separator } from '@/components/ui/separator';
import { TooltipProvider } from '@/components/ui/tooltip';
import React, { useEffect } from 'react';
import CompactExplorerNavItem from './CompactExplorerNavItem';
import { Plus, ArrowLeft, Home } from 'lucide-react';


import { SurveyGroupItem, SurveySingleItem } from 'survey-engine/data_types';
import { getItemColor, getItemTypeInfos, isValidSurveyItemGroup } from '../../../utils/utils';
import ItemCreator from './ItemCreator';

import SortableWrapper from '../../general/SortableWrapper';

interface CompactExplorerProps {
    root: SurveyGroupItem;
    currentPath: string | null;
    selectedItemId: string | null;
    onSelectItem: (itemKey: string | null) => void;
    onChangePath: (newPath: string) => void;
    onAddItem: (newItemInfos: {
        itemType: string;
        parentKey: string;
    }) => void;
    onInsertFromClipboard: (parentKey: string) => void;
    onItemsReorder: (newGroup: SurveyGroupItem) => void;
}


const CompactExplorer: React.FC<CompactExplorerProps> = (props) => {
    const [currentGroup, setCurrentGroup] = React.useState<SurveyGroupItem>(props.root);
    const [draggedId, setDraggedId] = React.useState<string | null>(null);

    const isAtRoot = props.currentPath === '' || props.currentPath === null || props.currentPath.split('.').length === 1;

    useEffect(() => {
        if (!props.currentPath) {
            setCurrentGroup({ ...props.root });
            return;
        }
        const pathParts = props.currentPath.split('.');
        let tempGroup = props.root;
        let tempPath = '';
        for (let i = 0; i < pathParts.length; i++) {
            tempPath += (i > 0 ? '.' : '') + pathParts[i];
            const nextGroup = tempGroup.items.find(item => item.key === tempPath);
            if (nextGroup && isValidSurveyItemGroup(nextGroup)) {
                tempGroup = nextGroup;
            }
        }
        setCurrentGroup({ ...tempGroup });
    }, [props.currentPath, props.root]);


    const currentItems = currentGroup.items.map((surveyItem) => {
        const isActive = surveyItem.key === props.selectedItemId;
        const { icon, defaultItemClassName } = getItemTypeInfos(surveyItem);
        const itemColor = getItemColor(surveyItem);

        const isGroup = isValidSurveyItemGroup(surveyItem);
        return {
            id: surveyItem.key,
            icon: icon,
            className: isActive ? undefined : defaultItemClassName,
            isActive,
            label: surveyItem.metadata?.itemLabel || '',
            isGroup,
            textColor: isActive ? undefined : itemColor,
            isConfidential: (surveyItem as SurveySingleItem).confidentialMode !== undefined
        }
    })


    const draggedItem = draggedId ? currentItems.find(item => item.id === draggedId) : null;

    return (
        <nav className='flex flex-col items-center py-2 gap-2 bg-secondary/90 min-h-full'>
            <TooltipProvider>
                {isAtRoot ? <>
                    <CompactExplorerNavItem
                        icon={Home}
                        tooltip={{ label: 'Open root group' }}
                        onClick={() => {
                            props.onSelectItem(currentGroup.key);
                        }}
                    />
                    <Separator
                        className='bg-black/20'
                    />
                </> : <><CompactExplorerNavItem
                    icon={ArrowLeft}
                    tooltip={{ label: 'Go back' }}
                    onClick={() => {
                        const newPath = props.currentPath ? props.currentPath.split('.').slice(0, -1).join('.') : '';
                        props.onChangePath(newPath);
                    }}
                />

                    <Separator
                        className='bg-black/20'
                    />
                </>
                }


                <SortableWrapper
                    sortableID={`compact-explorer-${props.currentPath}`}
                    items={currentItems}
                    onDraggedIdChange={(id) => {
                        setDraggedId(id);
                    }}
                    onReorder={(activeIndex, overIndex) => {
                        const newItems = [...currentGroup.items];
                        newItems.splice(activeIndex, 1);
                        newItems.splice(overIndex, 0, currentGroup.items[activeIndex]);
                        const newGroup = {
                            ...currentGroup,
                            items: newItems,
                        }
                        props.onItemsReorder(newGroup);
                    }}
                    dragOverlayItem={(draggedId && draggedItem) ?
                        <CompactExplorerNavItem
                            key={draggedItem.id}
                            sortableID={draggedItem.id}
                            icon={draggedItem.icon}
                            isActive={draggedItem.isActive}
                            className={draggedItem.className}
                            style={{
                                color: draggedItem.textColor,
                            }}
                        />
                        : null}
                >

                    <ol
                        className='space-y-2 mx-auto relative'
                    >
                        {currentItems.map((item) => {
                            const onDoubleClick = item.isGroup ? () => {
                                props.onChangePath(item.id);
                            } : undefined

                            return <CompactExplorerNavItem
                                key={item.id}
                                sortableID={item.id}
                                icon={item.icon}
                                isActive={item.isActive}
                                isDragged={draggedId === item.id}
                                tooltip={{
                                    key: item.id,
                                    label: item.label,
                                }}
                                className={item.className}
                                isConfidential={item.isConfidential}
                                onClick={() => {
                                    if (props.onSelectItem) {
                                        props.onSelectItem(item.id);
                                    }
                                }}
                                onDoubleClick={onDoubleClick}
                                style={{
                                    color: item.textColor,
                                }}
                            />
                        })}

                    </ol>

                </SortableWrapper>


                {currentGroup.items.length === 0 &&
                    <CompactExplorerNavItem.EmptyList />
                }

                <Separator
                    className='bg-black/20'
                />
                <ItemCreator
                    trigger={<div>
                        <CompactExplorerNavItem
                            icon={Plus}
                            className='text-gray-600'
                            tooltip={{ label: 'Add a new item' }}
                        />
                    </div>
                    }
                    parentKey={props.currentPath || ''}
                    onAddItem={props.onAddItem}
                    onInsertFromClipboard={props.onInsertFromClipboard}
                />

            </TooltipProvider>
        </nav >
    );
};

export default CompactExplorer;
