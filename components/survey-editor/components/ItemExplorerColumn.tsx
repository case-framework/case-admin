import { Button } from '@nextui-org/button';
import { Divider, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger, Kbd, Listbox, ListboxItem } from '@nextui-org/react';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { BsArrowReturnLeft, BsCardHeading, BsChevronRight, BsClipboardPlus, BsCollection, BsCollectionFill, BsFileEarmarkPlus, BsPlus, BsPlusCircle, BsPlusSquare, BsQuestionSquare, BsStopCircle } from 'react-icons/bs';
import { SurveyGroupItem, SurveyItem, SurveySingleItem, isSurveyGroupItem } from 'survey-engine/data_types';

interface ItemExplorerColumnProps {
    itemGroup: SurveyGroupItem;
    onAddItem: (itemMode: string, path: string) => void;
    onItemsReorder: (newGroup: SurveyGroupItem) => void;
    onItemSelect?: (item: SurveyItem | null) => void;
}

const ItemExplorerColumn: React.FC<ItemExplorerColumnProps> = (props) => {
    const [selectedItem, setSelectedItem] = React.useState<SurveyItem | null>(null);

    const dragItem = React.useRef<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = React.useState<number | null>(null);
    const sourceListId = React.useRef<string | null>(null);

    useEffect(() => {
        if (selectedItem !== null) {
            if (props.itemGroup.items.findIndex(i => i.key === selectedItem.key) === -1) {
                setSelectedItem(null);
            }
        }
    }, [props.itemGroup.items, selectedItem]);


    const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        // prevent drag start if already dragging in other list:
        if (sourceListId.current !== null && sourceListId.current !== props.itemGroup.key) return;
        sourceListId.current = props.itemGroup.key;

        dragItem.current = index;
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        if (sourceListId.current !== props.itemGroup.key) return;
        e.preventDefault();
        if (dragItem.current !== index) {
            setDragOverIndex(index);
        } else {
            setDragOverIndex(null);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLLIElement>, index: number) => {
        if (dragItem.current === null) return;
        if (sourceListId.current !== props.itemGroup.key) return;

        if (props.itemGroup.items.length - 1 < dragItem.current) return;
        const draggedItem = props.itemGroup.items[dragItem.current];
        const newItems = [...props.itemGroup.items];
        newItems.splice(dragItem.current, 1);
        newItems.splice(index, 0, draggedItem);

        props.onItemsReorder({
            ...props.itemGroup,
            items: newItems,
        })
        setDragOverIndex(null);
        sourceListId.current = null;  // Reset stored listId
    };

    const handleDragEnd = () => {
        setDragOverIndex(null);
    };

    let itemList: React.ReactNode = null;
    if (!props.itemGroup.items || props.itemGroup.items.length === 0) {
        itemList = (
            <div className=' py-unit-md flex flex-col items-center justify-center gap-unit-sm  bg-white'>
                <div className='text-small'>
                    <div className='text-default-400 text-xl flex justify-center mb-unit-1'>
                        <BsQuestionSquare />
                    </div>
                    Empty group
                </div>
            </div>
        );
    } else {
        itemList = (
            <Listbox
                className=' bg-white'
                aria-label={`List of items in group ${props.itemGroup.key}`}
                onAction={(key) => {
                    const item = props.itemGroup.items.find(i => i.key === key);
                    if (item) {
                        setSelectedItem(item);
                        props.onItemSelect && props.onItemSelect(item);
                    } else {
                        setSelectedItem(null);
                        props.onItemSelect && props.onItemSelect(null);
                    }
                }}
            >

                {props.itemGroup.items.map((item, index) => {
                    let icon = <BsCardHeading />;
                    if (isSurveyGroupItem(item) || (item as SurveyGroupItem).items !== undefined) {
                        icon = <BsCollectionFill className='text-primary-300' />;
                    } else if (item.type === 'pageBreak') {
                        icon = <BsArrowReturnLeft className='text-secondary-300' />;
                    } else if (item.type === 'surveyEnd') {
                        icon = <BsStopCircle className='text-danger-300' />;
                    }

                    return (
                        <ListboxItem
                            key={item.key}
                            color='primary'
                            variant='flat'
                            startContent={<span className='text-default-400'>{icon}</span>}
                            endContent={(item as SurveyGroupItem).items !== undefined && <span className='text-default-400'>
                                <BsChevronRight />
                            </span>}
                            className={clsx(
                                'relative group',
                                {
                                    'bg-primary-100': selectedItem?.key === item.key,
                                    'bg-primary-50': dragOverIndex === index,
                                }
                            )}
                            textValue={item.key}

                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDrop={(e) => handleDrop(e, index)}
                            onDragEnd={handleDragEnd}
                        >
                            {(dragOverIndex === index && dragItem.current !== null && dragItem.current < index) && (
                                <div className='absolute -bottom-1 left-0 w-full h-2 rounded-full bg-default-400/50 z-10' />
                            )}
                            {(dragOverIndex === index && dragItem.current !== null && dragItem.current > index) && (
                                <div className='absolute -top-1 left-0 w-full h-2 rounded-full bg-default-400/50 z-10' />
                            )}

                            {(item as SurveySingleItem).type === 'pageBreak' ? 'Page break' : item.key?.split('.').pop() || 'error retrieving key'}
                        </ListboxItem>
                    )
                })}
            </Listbox>
        );
    }

    return (
        <div className='h-full flex'>
            <div className='border-r border-default-400 min-w-[220px] overflow-y-scroll bg-white/60' >
                <div className='font-mono bg-primary-50 px-unit-sm py-unit-1 text-small'>
                    {props.itemGroup.key}
                </div>
                <Divider />
                {itemList}
                <Divider />
                <div className='flex justify-center py-unit-sm'>
                    <Dropdown backdrop='opaque'>
                        <DropdownTrigger>
                            <Button
                                startContent={<BsPlusSquare />}
                                color='secondary'
                                variant='light'
                                size='sm'
                            >
                                Add new item
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Action event example"
                            onAction={(key) => {
                                const actionKey = key as string;
                                props.onAddItem(actionKey, props.itemGroup.key);
                            }}
                        >
                            <DropdownSection showDivider aria-label='System actions'>
                                <DropdownItem
                                    key="pasteJSON"
                                    description='Paste a JSON object to create a new item.'
                                    startContent={<span className='text-xl text-default-400'><BsClipboardPlus /></span>}
                                >
                                    Paste from JSON
                                </DropdownItem>
                            </DropdownSection>
                            <DropdownSection title="Built-in items">
                                <DropdownItem key="item"
                                    description='Item type will be selected in the next step.'
                                    startContent={<span className='text-xl text-default-400'><BsCardHeading /></span>}
                                >
                                    Question/Info item</DropdownItem>
                                <DropdownItem key="group"
                                    description='Container for a group of items.'
                                    startContent={<span className='text-xl text-primary-300'><BsCollectionFill /></span>}
                                >
                                    Group</DropdownItem>
                                <DropdownItem key="pageBreak"
                                    startContent={<span className='text-xl text-secondary-300'><BsArrowReturnLeft /></span>}
                                    description='Items after this will be displayed on a new page.'
                                >Page break</DropdownItem>
                                <DropdownItem
                                    key="surveyEnd"
                                    startContent={<span className='text-xl text-danger-300'><BsStopCircle /></span>}
                                    description='Define content that appears next to the submit button.'
                                >Survey end content</DropdownItem>
                            </DropdownSection>
                        </DropdownMenu>
                    </Dropdown>

                </div>
            </div>
            {(selectedItem && (selectedItem as SurveyGroupItem).items !== undefined) && (
                <ItemExplorerColumn
                    itemGroup={selectedItem as SurveyGroupItem}
                    onAddItem={props.onAddItem}
                    onItemSelect={(item) => {
                        props.onItemSelect && props.onItemSelect(item);
                    }}
                    onItemsReorder={(newGroup) => {
                        const newItems = [...props.itemGroup.items];
                        const index = newItems.findIndex(i => i.key === newGroup.key);
                        if (index > -1) {
                            newItems[index] = newGroup;
                            setSelectedItem(newGroup)
                            props.onItemsReorder({
                                ...props.itemGroup,
                                items: newItems,
                            });
                        }
                    }}
                />
            )}
        </div>
    );

};

export default ItemExplorerColumn;
