import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React from 'react';
import { BsExclamationTriangle } from 'react-icons/bs';
import { Survey } from 'survey-engine/data_types';

interface InitNewSurveyDialogProps {
    isOpen: boolean;
    showOverwriteWarning: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onInitNewSurvey: (survey: Survey) => void;
}

const InitNewSurveyDialog: React.FC<InitNewSurveyDialogProps> = ({
    isOpen,
    onOpenChange,
    showOverwriteWarning,
    onInitNewSurvey,
}) => {
    const [surveyKey, setSurveyKey] = React.useState<string>('');

    const onCreateNewSurvey = () => {
        if (!surveyKey) return;
        onInitNewSurvey({
            availableFor: 'active_participants',
            surveyDefinition: {
                key: surveyKey,
                items: [],
            },
            versionId: '',

        });
        onOpenChange(false);
    }


    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}
            backdrop='blur'
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="bg-content2 flex flex-col gap-1">New survey</ModalHeader>
                        <Divider />
                        <ModalBody>
                            <div className='py-unit-md'>
                                {showOverwriteWarning && <div className='flex items-center gap-unit-md p-unit-md bg-warning-50 rounded-medium mb-unit-md'>
                                    <span className='text-warning text-xl'>
                                        <BsExclamationTriangle />
                                    </span>
                                    <p className='text-warning-800'>
                                        This will overwrite the current survey. Are you sure you want to continue?
                                    </p>
                                </div>
                                }

                                <Input
                                    label='Survey key'
                                    placeholder='Enter a survey key'
                                    id='survey key'
                                    value={surveyKey}
                                    onValueChange={(value) => {
                                        setSurveyKey(value);
                                    }}
                                    description='Survey key is required'
                                    isRequired
                                />
                            </div>
                        </ModalBody>
                        <Divider />
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary"
                                onPress={onCreateNewSurvey}
                                isDisabled={!surveyKey}
                            >
                                Init new survey
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default InitNewSurveyDialog;
