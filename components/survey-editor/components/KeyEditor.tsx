import { Button, Input, Tooltip } from "@nextui-org/react";
import React, { useEffect } from "react";
import { BsCheck2, BsPencilFill, BsPencilSquare, BsTag, BsX } from "react-icons/bs";

const KeyEditor: React.FC<{
    parentKey: string;
    itemKey: string;
    onItemKeyChange: (oldKey: string, newKey: string) => boolean;
    requireChangeConfirm?: boolean;
}> = ({ parentKey, itemKey, onItemKeyChange, requireChangeConfirm }) => {
    const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

    const [editMode, setEditMode] = React.useState<boolean>(false);
    const [editorContent, setEditorContent] = React.useState<string>(itemKey);

    useEffect(() => {
        setEditorContent(itemKey);
    }, [itemKey]);



    return <div>
        <div className=''>
            <div className='flex items-center'>
                <Tooltip
                    content='Item Key'
                >
                    <span>
                        <BsTag className='text- text-default-500 me-2' />
                    </span>
                </Tooltip>
                <span className='font-mono text-tiny text-default-400 pt-1'>
                    {parentKey}.
                </span>
            </div>
            <div className="flex items-center">
                <Input
                    aria-label='Item key'
                    className='font-mono w-64'
                    variant='bordered'
                    size='sm'
                    placeholder='Enter a key for the item'
                    isRequired
                    readOnly={!editMode && requireChangeConfirm}
                    validationState={editorContent.length === 0 ? 'invalid' : 'valid'}
                    value={editorContent}
                    onValueChange={(v) => {
                        setErrorMsg(null);
                        setEditorContent(v);
                        if (!requireChangeConfirm) {
                            if (!onItemKeyChange([parentKey, itemKey].join('.'), [parentKey, v].join('.'))) {
                                setErrorMsg('Key already exists. To avoid issues it is not possible to change the key to an existing one.');
                            }
                        }
                    }}
                />
                <div className='flex justify-end ms-1'>
                    {(!editMode && requireChangeConfirm) && <Tooltip content='Edit'>
                        <Button
                            isIconOnly={true}
                            size='sm'
                            variant='flat'
                            onPress={() => setEditMode(true)}
                        >
                            <BsPencilSquare />
                        </Button>
                    </Tooltip>}

                    {editMode && <>
                        <Tooltip content='Discard changes'>
                            <Button
                                isIconOnly={true}
                                size='sm'
                                variant='light'
                                color='danger'
                                className='text-2xl'
                                onPress={() => {
                                    setEditMode(false);
                                    setEditorContent(itemKey);
                                }}
                            >
                                <BsX />
                            </Button>
                        </Tooltip>
                        <Tooltip content='Accept changes'>
                            <Button
                                isIconOnly={true}
                                size='sm'
                                variant='light'
                                color='success'
                                className='text-2xl'
                                isDisabled={editorContent.length === 0 || editorContent === itemKey}
                                onPress={() => {
                                    if (!onItemKeyChange([parentKey, itemKey].join('.'), [parentKey, editorContent].join('.'))) {
                                        setErrorMsg('Key already exists. To avoid issues it is not possible to change the key to an existing one.');
                                    } else {
                                        setEditMode(false);
                                    }
                                }}
                            >
                                <BsCheck2 />
                            </Button>
                        </Tooltip>
                    </>}
                </div>
            </div>
            {errorMsg && <p className='text-danger-500 text-sm mt-1'>{errorMsg}</p>}
        </div>
    </div>
}

export default KeyEditor;
