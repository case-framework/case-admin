import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { on } from 'events';
import React from 'react';
import { BsPencil, BsPlus, BsXLg } from 'react-icons/bs';

interface SurveyMetadataEditorProps {
    metadata: {
        [key: string]: string;
    };
    onChange: (metadata: {
        [key: string]: string;
    } | undefined) => void
}

const columns = [
    { name: "KEY", uid: "key" },
    { name: "VALUE", uid: "value" },
    { name: "ACTIONS", uid: "actions" },
];

const MetadataEditorDialog: React.FC<{
    isOpen: boolean;
    metadataEntry?: {
        key: string,
        value: string
    };
    onClose: (metadataEntry?: {
        key: string,
        value: string
    }) => void;
}> = (props) => {
    const [key, setKey] = React.useState<string>(props.metadataEntry?.key || '');
    const [value, setValue] = React.useState<string>(props.metadataEntry?.value || '');

    React.useEffect(() => {
        if (!props.isOpen) {
            setKey('');
            setValue('');
            return;
        }
        setKey(props.metadataEntry?.key || '');
        setValue(props.metadataEntry?.value || '');
    }, [props.metadataEntry, props.isOpen]);

    return (
        <Modal isOpen={props.isOpen} onOpenChange={() => props.onClose()}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="">
                            {props.metadataEntry !== undefined ? 'Edit ' : 'New '} metadata entry
                        </ModalHeader>
                        <Divider />
                        <ModalBody>
                            <div className='py-unit-md space-y-unit-md'>
                                <Input
                                    label='Key'
                                    placeholder='Enter a key'
                                    labelPlacement='outside'
                                    value={key}
                                    onValueChange={(value) => setKey(value)}
                                    isReadOnly={!!props.metadataEntry}
                                />
                                <Input
                                    label='Value'
                                    placeholder='Enter a value'
                                    labelPlacement='outside'
                                    value={value}
                                    onValueChange={(value) => setValue(value)}
                                />
                            </div>
                        </ModalBody>
                        <Divider />
                        <ModalFooter>
                            <div className='flex gap-unit-sm'>
                                <Button
                                    onPress={() => props.onClose()}
                                    color='danger'
                                    variant='light'
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onPress={() => props.onClose({
                                        key,
                                        value
                                    })}
                                    color='primary'
                                    variant='flat'
                                    isDisabled={!key || !value}
                                >
                                    Save
                                </Button>
                            </div>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}



const SurveyMetadataEditor: React.FC<SurveyMetadataEditorProps> = ({
    metadata,
    onChange,
}) => {
    const [showMetadataEditor, setShowMetadataEditor] = React.useState<boolean>(false);
    const [selectedMetadataEntry, setSelectedMetadataEntry] = React.useState<{ key: string, value: string } | undefined>(undefined);

    const metadataEntries = Object.entries(metadata).map(([key, value]) => {
        return {
            key,
            value
        };
    });

    const renderCell = React.useCallback((metadataEntry: { key: string, value: string }, columnKey: React.Key) => {
        switch (columnKey) {
            case 'key':
                return metadataEntry.key;
            case 'value':
                return metadataEntry.value;
            case 'actions':
                return (
                    <div className='flex gap-unit-sm'>
                        <Button
                            onPress={() => {
                                setSelectedMetadataEntry(metadataEntry);
                                setShowMetadataEditor(true);
                            }}
                            color='secondary'
                            variant='light'
                            isIconOnly
                        >
                            <BsPencil />
                        </Button>
                        <Button
                            onPress={() => {
                                if (confirm('Are you sure you want to delete this metadata entry?')) {
                                    const newMetadata = { ...metadata };
                                    delete newMetadata[metadataEntry.key];
                                    onChange(newMetadata);
                                }
                            }}
                            color='danger'
                            variant='light'
                            isIconOnly
                        >
                            <BsXLg />
                        </Button>
                    </div>
                );
        }
    }, [metadata, onChange]);


    return (
        <div className='space-y-unit-md'>
            <Table
                aria-label="Survey metadata viewer"
                isStriped
                isCompact
            >
                <TableHeader
                    columns={columns}
                >
                    {(column) => (
                        <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody emptyContent={"This survey has no metadata."}
                    items={metadataEntries}
                >
                    {(item) => (
                        <TableRow key={item.key}>
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <Button
                onPress={() => {
                    setSelectedMetadataEntry(undefined);
                    setShowMetadataEditor(true);
                }}
                startContent={<BsPlus />}
                color='default'
            >
                Add new entry
            </Button>
            <MetadataEditorDialog
                isOpen={showMetadataEditor}
                metadataEntry={selectedMetadataEntry}
                onClose={(metadataEntry) => {
                    setShowMetadataEditor(false);
                    setSelectedMetadataEntry(undefined);
                    if (!metadataEntry) {
                        return;
                    }
                    onChange({
                        ...metadata,
                        [metadataEntry.key]: metadataEntry.value
                    })
                }}
            />
        </div>
    );
};

export default SurveyMetadataEditor;
