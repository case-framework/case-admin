import { Button, Divider, Input, Listbox, ListboxItem, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { Group } from 'case-editor-tools/surveys/types';
import React from 'react';
import { Bs123, BsArrowsExpand, BsCalendar3, BsCardHeading, BsCardText, BsCheck2Square, BsCheckCircle, BsCheckCircleFill, BsCheckSquare, BsCheckSquareFill, BsCircle, BsClock, BsCreditCard2Front, BsInfoCircle, BsInfoCircleFill, BsInfoLg, BsInputCursorText, BsMenuButton, BsSliders, BsTable, BsTextareaResize, BsUiRadiosGrid } from 'react-icons/bs';
import { SurveyItem, SurveySingleItem } from 'survey-engine/data_types';
import SurveyEndAttributeEditor, { SurveyEndAttributes } from './item-types/SurveyEndAttributeEditor';
import KeyEditor from './KeyEditor';
import { generateTitleComponent } from 'case-editor-tools/surveys/utils/simple-generators';
import { ItemEditor } from 'case-editor-tools/surveys/survey-editor/item-editor';
import { SurveyItems } from 'case-editor-tools/surveys/survey-items';
import { ComponentGenerators } from 'case-editor-tools/surveys/utils/componentGenerators';

interface NewItemDialogProps {
    currentMode: {
        actionKey: string,
        path: string,
    } | null;
    onCreateItem: (item: SurveyItem, path: string) => void;
    onClose: () => void;
}

class SimpleGroup extends Group {
    constructor(parentKey: string, key: string) {
        super(parentKey, key);
    }

    buildGroup(): void {
    }
}

interface ModalContentProps {
    onClose: () => void;
    parentKey?: string;
}

interface ModalContentForGroupActionProps extends ModalContentProps {
    onSubmit: (key: string) => void;
}

const ModalContentForGroupAction = ({
    parentKey,
    onSubmit,
    onClose
}: ModalContentForGroupActionProps) => {
    const [itemKey, setItemKey] = React.useState<string>('');

    return <form
        onSubmit={(e) => {
            e.preventDefault();
            onSubmit(itemKey);
        }}
    >
        <ModalHeader className='bg-content2'>
            New Group
        </ModalHeader>
        <Divider />
        <ModalBody>
            <div className='flex flex-col gap-unit-md py-unit-md'>
                <div className='p-unit-md bg-primary-100 rounded-medium flex gap-unit-sm items-center'>
                    <span className='text-primary-700 text-2xl'><BsInfoCircle /></span>
                    <span className='text-small'>
                        This can be used to group items together, e.g. if they have the same dependencies or they always appear together.
                    </span>
                </div>
                <Input
                    id='new-group-key'
                    label='Group key'
                    labelPlacement='outside'
                    placeholder='Enter a key for the new group'
                    variant='bordered'
                    description='Must be unique within the parent group.'
                    isRequired
                    value={itemKey}
                    onValueChange={(v) => {
                        setItemKey(v);
                    }}
                />
                <div>
                    <p className='text-small mb-unit-1'>Full key of the new item:</p>
                    <p className='font-mono overflow-x-scroll'>
                        <span className='text-default-500'>{parentKey}.</span><span>{itemKey}</span>
                    </p>
                </div>
            </div>
        </ModalBody>
        <Divider />
        <ModalFooter className='bg-content2'>
            <Button
                variant='ghost'
                color='danger'
                onClick={onClose}
                type='button'
            >
                Cancel
            </Button>
            <Button
                color='primary'
                type='submit'
            >
                Create
            </Button>

        </ModalFooter>
    </form>
}

interface ModalContentForSurveyEndActionProps extends ModalContentProps {
    onSubmit: (surveyEndAttributes: SurveyEndAttributes) => void;
}

const ModalContentForSurveyEndAction = (props: ModalContentForSurveyEndActionProps) => {
    const [itemProps, setItemProps] = React.useState<SurveyEndAttributes>({
        key: '',
        content: new Map(),
    });

    return <>
        <ModalHeader className='bg-content2'>
            New Survey End
        </ModalHeader>
        <Divider />
        <ModalBody className='py-unit-lg px-unit-md'>
            <KeyEditor
                parentKey={props.parentKey || ''}
                itemKey={itemProps.key.split('.').pop() || ''}
                onItemKeyChange={(_, key) => {
                    setItemProps({
                        ...itemProps,
                        key: key,
                    });
                    return true;
                }}
            />
            <Divider />
            <SurveyEndAttributeEditor
                attributes={itemProps}
                onChange={(newProps) => {
                    setItemProps(newProps);
                }}
            />
        </ModalBody>
        <Divider />
        <ModalFooter className='bg-content2'>
            <Button
                variant='ghost'
                color='danger'
                onClick={props.onClose}
                type='button'
            >
                Cancel
            </Button>
            <Button
                color='primary'
                type='button'
                isDisabled={!itemProps.key}
                onPress={() => {
                    props.onSubmit(itemProps);
                }}
            >
                Create
            </Button>
        </ModalFooter>
    </>
}

interface ModalContentForSurveyItemActionProps extends ModalContentProps {
    onSubmit: (item: SurveySingleItem) => void;
}

export const surveyItemTypes = [
    {
        key: 'display',
        label: 'Display',
        description: 'Displays text, without response slots. For information or instructions.',
        icon: <BsCardHeading className='text-neutral-800' />,
    },
    {
        key: 'singleChoice',
        label: 'Single choice',
        description: 'Allows the participant to select one option from a list of options.',
        icon: <BsCheckCircle className='text-fuchsia-800' />,
    },
    {
        key: 'multipleChoice',
        label: 'Multiple choice',
        description: 'Allows the participant to select multiple options from a list of options.',
        icon: <BsCheckSquare className='text-indigo-800' />,
    },
    {
        key: 'dateInput',
        label: 'Date input',
        description: 'Allows the participant to enter a date.',
        icon: <BsCalendar3 className='text-lime-700' />,
    },
    {
        key: 'timeInput',
        label: 'Time input',
        description: 'Allows the participant to enter a time.',
        icon: <BsClock className='text-yellow-600' />,
    },
    {
        key: 'textInput',
        label: 'Text input',
        description: 'Allows the participant to enter a text.',
        icon: <BsInputCursorText className='text-sky-700' />,
    },
    {
        key: 'numericInput',
        label: 'Numeric input',
        description: 'Allows the participant to enter a number.',
        icon: <Bs123 className='text-green-700' />,
    },
    {
        key: 'responsiveSingleChoiceArray',
        label: 'Single choice array',
        description: 'A list of single choice questions (likert scale). Different view modes are available per screen size.',
        icon: <BsUiRadiosGrid className='text-teal-800' />,
    },
    {
        key: 'responsiveBipolarLikertArray',
        label: 'Bipolar likert array',
        description: 'A list of bipolar likert scale questions. Different view modes are available per screen size.',
        icon: <BsArrowsExpand className='rotate-90 text-violet-800' />,
    },
    {
        key: 'responsiveMatrix',
        label: 'Matrix',
        description: 'Response slots arranged in a matrix. Different view modes are available per screen size.',
        icon: <BsTable className='text-emerald-600' />,
    },
    {
        key: 'clozeQuestion',
        label: 'Cloze question',
        description: 'A cloze question with a list of text and response slots.',
        icon: <BsCreditCard2Front className='text-purple-600' />,
    },
    {
        key: 'multilineTextInput',
        label: 'Multiline text input',
        description: 'Allows the participant to enter a text with multiple lines.',
        icon: <BsTextareaResize className='text-fuchsia-600' />,
    },

    {
        key: 'consent',
        label: 'Consent',
        description: 'Displays a consent form.',
        icon: <BsCheck2Square className='text-rose-800' />,
    },
    {
        key: 'sliderNumeric',
        label: 'Slider',
        description: 'Allows the participant to select a value from a range.',
        icon: <BsSliders className='text-blue-800' />,
    },
    {
        key: 'dropdown',
        label: 'Dropdown',
        description: 'Allows the participant to select one option from a list of options.',
        icon: <BsMenuButton className='text-orange-800' />,
    }
]

const ModalContentForSurveyItemAction = (props: ModalContentForSurveyItemActionProps) => {
    const [step, setStep] = React.useState<number>(0);

    const [itemProps, setItemProps] = React.useState<{
        key: string,
        itemType: string,
    }>({
        key: '',
        itemType: '',
    });

    const onTypeSelect = (type: string) => {
        setItemProps({
            ...itemProps,
            itemType: type,
        });
        setStep(1);
    }

    if (step === 0) {
        return <>
            <ModalHeader className='bg-content2'>
                What item type do you want to create?
            </ModalHeader>
            <Divider />
            <ModalBody className='py-unit-lg px-unit-md'>
                <Listbox
                    items={surveyItemTypes}
                    aria-label="Select an item type"
                    color='primary'
                    variant='flat'
                    onAction={(key) => onTypeSelect(key as string)}
                >
                    {(item) => (
                        <ListboxItem
                            key={item.key}
                            textValue={item.label}
                            startContent={<span
                                className='text-default-400 text-2xl me-2'
                            >
                                {item.icon}
                            </span>}
                            className='w-full'
                        >
                            <div className='font-bold text-large'>
                                {item.label}
                            </div>
                            <div className='text-tiny'>
                                {item.description}
                            </div>
                        </ListboxItem>
                    )}
                </Listbox>
            </ModalBody >
        </>
    }


    return <>
        <ModalHeader className='bg-content2'>
            {`New "${surveyItemTypes.find(t => t.key === itemProps.itemType)?.label}" item`}
        </ModalHeader>
        <Divider />
        <ModalBody className='py-unit-lg px-unit-md'>
            <div className='flex items-center p-unit-sm gap-unit-sm bg-secondary-50 rounded-medium'>
                <span>
                    <BsInfoCircle className='text-secondary-300 text-2xl me-2' />
                </span>
                <div>
                    <p className='mb-2 font-bold'>
                        Set a key for the new item. The key must be unique within the parent group.
                    </p>
                    <p>
                        You can edit the other properties of the item after creation through the item inspector view.
                    </p>
                </div>
            </div>
            <p className='font-bold'>Key:</p>
            <KeyEditor
                parentKey={props.parentKey || ''}
                itemKey={itemProps.key.split('.').pop() || ''}
                onItemKeyChange={(_, key) => {
                    setItemProps({
                        ...itemProps,
                        key: key,
                    });
                    console.log(key);
                    return true;
                }}
            />
        </ModalBody>
        <Divider />
        <ModalFooter className='bg-content2'>
            <Button
                variant='ghost'
                onPress={() => {
                    setStep(0);
                }}
                type='button'
            >
                Back
            </Button>
            <Button
                color='primary'
                type='button'
                isDisabled={!itemProps.key}
                onPress={() => {
                    let item: SurveySingleItem | undefined = undefined;
                    const newItemKey = itemProps.key.split('.').pop() || 'unknownKey';
                    switch (itemProps.itemType) {
                        case 'display':
                            item = SurveyItems.display({
                                parentKey: props.parentKey || '',
                                itemKey: newItemKey,
                                content: [
                                    ComponentGenerators.markdown({
                                        content: new Map(),
                                    })
                                ],
                            })
                            break;
                        case 'singleChoice':
                            item = SurveyItems.singleChoice({
                                parentKey: props.parentKey || '',
                                itemKey: newItemKey,
                                questionText: new Map(),
                                responseOptions: [],
                            });
                            break;
                        case 'multipleChoice':
                            item = SurveyItems.multipleChoice({
                                parentKey: props.parentKey || '',
                                itemKey: newItemKey,
                                questionText: new Map(),
                                responseOptions: [],
                            });
                            break;
                        case 'dateInput':
                            item = SurveyItems.dateInput({
                                parentKey: props.parentKey || '',
                                itemKey: newItemKey,
                                questionText: new Map(),
                                dateInputMode: 'YMD',
                            });
                            break;
                        case 'timeInput':
                            item = SurveyItems.timeInput({
                                parentKey: props.parentKey || '',
                                itemKey: newItemKey,
                                questionText: new Map(),
                            });
                            break;
                        case 'textInput':
                            item = SurveyItems.textInput({
                                parentKey: props.parentKey || '',
                                itemKey: newItemKey,
                                questionText: new Map(),
                            });
                            break;
                        case 'numericInput':
                            item = SurveyItems.numericInput({
                                parentKey: props.parentKey || '',
                                itemKey: newItemKey,
                                questionText: new Map(),
                                inputLabel: new Map(),
                            });
                            break;
                        case 'responsiveSingleChoiceArray':
                            item = SurveyItems.responsiveSingleChoiceArray({
                                parentKey: props.parentKey || '',
                                itemKey: newItemKey,
                                questionText: new Map(),
                                defaultMode: 'table',
                                rows: [],
                                scaleOptions: [],
                            });
                            break;
                        case 'responsiveBipolarLikertArray':
                            item = SurveyItems.responsiveBipolarLikertArray({
                                parentKey: props.parentKey || '',
                                itemKey: newItemKey,
                                questionText: new Map(),
                                defaultMode: 'table',
                                rows: [],
                                scaleOptions: [],
                            });
                            break;
                        case 'responsiveMatrix':
                            item = SurveyItems.responsiveMatrix({
                                parentKey: props.parentKey || '',
                                itemKey: newItemKey,
                                questionText: new Map(),
                                columns: [],
                                rows: [],
                                responseType: 'dropdown',
                            });
                            break;
                        case 'clozeQuestion':
                            item = SurveyItems.clozeQuestion({
                                parentKey: props.parentKey || '',
                                itemKey: newItemKey,
                                questionText: new Map(),
                                items: [],
                            });
                            break;
                        case 'multilineTextInput':
                            item = SurveyItems.multilineTextInput({
                                parentKey: props.parentKey || '',
                                itemKey: newItemKey,
                                questionText: new Map(),
                            });
                            break;
                        case 'consent':
                            item = SurveyItems.consent({
                                parentKey: props.parentKey || '',
                                itemKey: newItemKey,
                                questionText: new Map(),
                                acceptBtn: new Map(),
                                checkBoxLabel: new Map(),
                                dialogContent: new Map(),
                                dialogTitle: new Map(),
                                rejectBtn: new Map(),
                            });
                            break;
                        case 'sliderNumeric':
                            item = SurveyItems.numericSlider({
                                parentKey: props.parentKey || '',
                                itemKey: newItemKey,
                                questionText: new Map(),
                                noResponseLabel: new Map(),
                                sliderLabel: new Map(),
                            });
                            break;
                        case 'dropdown':
                            item = SurveyItems.dropDown({
                                parentKey: props.parentKey || '',
                                itemKey: newItemKey,
                                questionText: new Map(),
                                responseOptions: [],
                            });
                            break;
                        default:
                            break;
                    }
                    if (item === undefined) {
                        throw Error('Item type not implemented');
                    }
                    props.onSubmit(item);
                }}
            >
                Create
            </Button>
        </ModalFooter>
    </>
}


const NewItemDialog: React.FC<NewItemDialogProps> = ({
    currentMode,
    onCreateItem,
    ...props
}) => {
    const isOpen = currentMode !== null;

    const dialogContent = React.useMemo(() => {
        if (!currentMode) return null;

        const actionKey = currentMode.actionKey;
        const parentKey = currentMode.path;

        switch (currentMode.actionKey) {
            case 'group':
                return <ModalContent>
                    {(onClose) => (
                        <ModalContentForGroupAction
                            parentKey={parentKey}
                            onSubmit={(key) => {
                                console.log('submit', key);
                                const newGroup = new SimpleGroup(parentKey, key)
                                onCreateItem(newGroup.get(), parentKey);
                            }}
                            onClose={onClose} />
                    )}
                </ModalContent>
            case 'surveyEnd':
                return <ModalContent>
                    {(onClose) => (
                        <ModalContentForSurveyEndAction
                            parentKey={parentKey}
                            onSubmit={(surveyEndAtttributes) => {
                                const editor = new ItemEditor(undefined, { itemKey: surveyEndAtttributes.key, type: 'surveyEnd', isGroup: false });
                                editor.setTitleComponent(
                                    generateTitleComponent(surveyEndAtttributes.content)
                                );
                                editor.setCondition(surveyEndAtttributes.condition);
                                const se = editor.getItem();
                                onCreateItem(se, parentKey);
                            }}
                            onClose={onClose}
                        />
                    )}
                </ModalContent>
            case 'item':
                return <ModalContent>
                    {(onClose) => (
                        <ModalContentForSurveyItemAction
                            parentKey={parentKey}
                            onSubmit={(item) => {
                                onCreateItem(item, parentKey);
                            }}
                            onClose={onClose}
                        />
                    )}
                </ModalContent>
            default:
                return <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className='bg-content2'>
                                Unknown action
                            </ModalHeader>
                            <Divider />
                            <ModalBody className='text-warning py-unit-lg px-unit-md font-bold'>
                                The selected action is currently not implemented: {actionKey}
                            </ModalBody>
                        </>
                    )}
                </ModalContent>

        }

    }, [currentMode, onCreateItem]);

    return (
        <Modal isOpen={isOpen} onOpenChange={() => {
            props.onClose();
        }}
            isDismissable={false}

            scrollBehavior='outside'
            className='rounded-medium overflow-hidden'
            size='2xl'

        >
            <ModalContent>
                {(onClose) => (
                    <>
                        {dialogContent}

                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default NewItemDialog;
