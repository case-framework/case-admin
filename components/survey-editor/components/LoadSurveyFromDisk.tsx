import Filepicker from '@/components/inputs/Filepicker';
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { SurveyEditor } from 'case-editor-tools/surveys/survey-editor/survey-editor';
import React from 'react';
import { BsExclamationTriangle } from 'react-icons/bs';
import { Survey } from 'survey-engine/data_types';

interface LoadSurveyFromDiskProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onLoadNewSurvey: (survey: Survey) => void;
}

const LoadSurveyFromDisk: React.FC<LoadSurveyFromDiskProps> = ({
    isOpen,
    onOpenChange,
    onLoadNewSurvey,
}) => {
    const [surveyFileContent, setSurveyFileContent] = React.useState<Survey | undefined>(undefined);
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);

    React.useEffect(() => {
        setSurveyFileContent(undefined);
    }, [isOpen]);

    const onLoad = () => {
        if (!surveyFileContent) return;
        onLoadNewSurvey(surveyFileContent);
        onOpenChange(false);
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}
            backdrop='blur'
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="bg-content2 flex flex-col gap-1">Load from disk</ModalHeader>
                        <Divider />
                        <ModalBody>
                            <div className='py-unit-md'>
                                <div className='flex items-center gap-unit-md p-unit-md bg-warning-50 rounded-medium mb-unit-md'>
                                    <span className='text-warning text-xl'>
                                        <BsExclamationTriangle />
                                    </span>
                                    <p className='text-warning-800'>
                                        This will overwrite the current survey. Are you sure you want to continue?
                                    </p>
                                </div>

                                <Filepicker
                                    label='Select a survey file'
                                    id='survey upload'
                                    accept={{
                                        'application/json': ['.json'],
                                    }}
                                    onChange={(files) => {
                                        setSurveyFileContent(undefined);
                                        setErrorMsg(undefined);
                                        if (files.length > 0) {
                                            // read file as a json
                                            const reader = new FileReader();
                                            reader.onload = (e) => {
                                                const text = e.target?.result;
                                                if (typeof text === 'string') {
                                                    const data = JSON.parse(text);

                                                    let surveyKeyFromData = '';
                                                    if (data && data.surveyDefinition && data.surveyDefinition.key) {
                                                        surveyKeyFromData = data.surveyDefinition.key;
                                                    }

                                                    if (!surveyKeyFromData) {
                                                        setErrorMsg('Survey key not found in the selected file.');
                                                        return;
                                                    }

                                                    setSurveyFileContent(data as Survey);
                                                } else {
                                                    setSurveyFileContent(undefined);
                                                    console.log('error');
                                                }

                                            }
                                            reader.readAsText(files[0]);
                                        }
                                    }}
                                />

                                {errorMsg && (
                                    <p className='text-danger mt-unit-md'>{errorMsg}</p>
                                )}
                            </div>
                        </ModalBody>
                        <Divider />
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={onLoad}
                                isDisabled={!surveyFileContent}
                            >
                                Load
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default LoadSurveyFromDisk;
