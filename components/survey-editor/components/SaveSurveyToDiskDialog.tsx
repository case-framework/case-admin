import { Button, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import { SurveyEditor } from 'case-editor-tools/surveys/survey-editor/survey-editor';
import { format } from 'date-fns';
import React, { useEffect } from 'react';

interface SaveSurveyToDiskDialogProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    editorInstance: SurveyEditor;
}

const SaveSurveyToDiskDialog: React.FC<SaveSurveyToDiskDialogProps> = ({
    isOpen,
    onOpenChange,
    editorInstance,
}) => {
    const [fileName, setFileName] = React.useState<string>('');

    useEffect(() => {
        if (isOpen) {
            const newFileName = `${editorInstance.getSurvey().surveyDefinition.key}_${format(new Date(), 'yyyy-MM-dd')}.json`;
            setFileName(newFileName);
        }
    }, [isOpen, editorInstance]);

    const onSave = () => {
        const survey = editorInstance.getSurveyJSON();
        const blob = new Blob([survey], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        onOpenChange(false);
    }

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}
            backdrop='blur'
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="bg-content2 flex flex-col gap-1">Save to disk</ModalHeader>
                        <Divider />
                        <ModalBody>
                            <div className='py-unit-md'>
                                <Input
                                    id='file-name'
                                    label='File name'
                                    labelPlacement='outside'
                                    placeholder='Enter a file name'
                                    description='The file will be saved in the downloads folder of your browser.'
                                    variant='bordered'
                                    value={fileName}
                                    onValueChange={(val) => {
                                        setFileName(val);
                                    }}
                                />
                            </div>
                        </ModalBody>
                        <Divider />
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button color="primary" onPress={onSave}>
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default SaveSurveyToDiskDialog;
