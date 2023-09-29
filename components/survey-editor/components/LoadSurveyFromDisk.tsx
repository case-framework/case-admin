import Filepicker from '@/components/inputs/Filepicker';
import { Button, Divider, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React from 'react';
import { BsExclamationTriangle, BsPencil, BsXLg } from 'react-icons/bs';
import { Survey } from 'survey-engine/data_types';
import { findAllLocales, removeLocales, renameLocales } from './localeUtils';

interface LoadSurveyFromDiskProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    onLoadNewSurvey: (survey: Survey) => void;
}


const LocaleEditor: React.FC<{
    locale: string,
    onRename: (oldLocale: string, newLocale: string) => void,
    onDelete: (locale: string) => void,
}> = ({ locale, onRename, onDelete }) => {
    return (
        <div className='flex items-center gap-unit-md'>
            <span className='font-mono grow'>{locale}</span>
            <Button
                variant='light'
                size='sm'
                isIconOnly={true}
                onPress={() => {
                    const newLocale = prompt('Enter new locale code:');
                    if (newLocale) {
                        onRename(locale, newLocale);
                    }
                }}
            >
                <BsPencil />
            </Button>
            <Button
                variant='light'
                size='sm'
                isIconOnly={true}
                onPress={() => {
                    if (confirm(`Are you sure you want to delete locale ${locale}?`)) {
                        onDelete(locale);
                    }
                }}
            >
                <BsXLg />
            </Button>
        </div>
    )
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


    let localesFromSurvey: string[] = [];
    if (surveyFileContent) {
        localesFromSurvey = findAllLocales(surveyFileContent);
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
                            {localesFromSurvey.length > 0 && (
                                <div>
                                    <h3 className='text-sm font-bold mb-2'>Locales used:</h3>
                                    <ul>
                                        {localesFromSurvey.map((loc, i) => (
                                            <li key={i} className=' bg-default-50 border rounded-medium px-unit-sm py-unit-2 mr-unit-sm mb-unit-sm'>
                                                <LocaleEditor
                                                    locale={loc}
                                                    onRename={(oldLocale, newLocale) => {
                                                        if (!surveyFileContent) return;
                                                        console.log('rename', oldLocale, newLocale);
                                                        setSurveyFileContent({ ...renameLocales(surveyFileContent, oldLocale, newLocale) });
                                                    }}
                                                    onDelete={(locale) => {
                                                        if (!surveyFileContent) return;
                                                        setSurveyFileContent(removeLocales(surveyFileContent, [locale]));
                                                    }}
                                                />
                                            </li>
                                        ))}
                                    </ul>

                                </div>
                            )}

                        </ModalBody>
                        <Divider />
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancel
                            </Button>

                            <Button color="primary" onPress={onLoad}
                                isDisabled={!surveyFileContent}
                            >
                                Import
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default LoadSurveyFromDisk;
