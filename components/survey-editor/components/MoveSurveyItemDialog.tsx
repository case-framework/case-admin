import { Button, Divider, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React, { useEffect } from 'react';
import { SurveyGroupItem, SurveyItem } from 'survey-engine/data_types';

interface MoveSurveyItemDialogProps {
    currentKey: string;
    surveyDefinition: SurveyGroupItem;
    onMoveItem: (newParentKey: string) => void;
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
}

const extractGroups = (item: SurveyItem): Array<{ key: string }> => {
    let result: Array<{ key: string }> = [];
    if ((item as SurveyGroupItem).items === undefined) {
        return [];
    }
    result.push({ key: item.key });
    (item as SurveyGroupItem).items.forEach(item => {
        result = result.concat(extractGroups(item))
    });
    return result;
}

const MoveSurveyItemDialog: React.FC<MoveSurveyItemDialogProps> = ({
    currentKey,
    surveyDefinition,
    onMoveItem,
    isOpen,
    onOpenChange,
}) => {
    const [selectedGroup, setSelectedGroup] = React.useState<string | undefined>(undefined);

    useEffect(() => {
        setSelectedGroup(undefined);
    }, [isOpen]);

    const onSubmit = () => {
        if (!selectedGroup) {
            onOpenChange(false);
            return
        };
        onMoveItem(selectedGroup);
    }

    const parentKey = currentKey.substring(0, currentKey.lastIndexOf('.'));

    const groups = extractGroups(surveyDefinition).filter(g => {
        return !(g.key.startsWith(currentKey + '.') || g.key === parentKey || g.key === currentKey);
    });


    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}
            backdrop='blur'
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="bg-content2 flex flex-col gap-1">Move item to a new parent group</ModalHeader>
                        <Divider />
                        <ModalBody>
                            <div className='py-unit-md'>
                                <p className='font-bold'>Select the new parent group:</p>
                                {groups.length === 0 && <p className='text-gray-500'>No other groups available.</p>}
                                <Listbox
                                    items={groups}
                                    aria-label='groups'
                                    variant='bordered'
                                    selectionMode='single'
                                    selectedKeys={selectedGroup ? [selectedGroup] : []}
                                    onSelectionChange={(keys) => {
                                        const selectedKey = (keys as Set<React.Key>).values().next().value;
                                        if (!selectedKey) return;
                                        setSelectedGroup(selectedKey as string);
                                    }}


                                >
                                    {(item) => {
                                        return <ListboxItem
                                            key={item.key}
                                            aria-label={item.key}
                                            className='bg-default-50'
                                        >
                                            {item.key}
                                        </ListboxItem>
                                    }}
                                </Listbox>
                            </div>
                        </ModalBody>
                        <Divider />
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={onSubmit}
                                isDisabled={!selectedGroup}
                            >
                                Move
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default MoveSurveyItemDialog;
