import { Button, Card, Divider } from '@nextui-org/react';
import React from 'react';
import { BsDownload, BsFileArrowUp } from 'react-icons/bs';
import SaveSurveyToDiskDialog from '../components/SaveSurveyToDiskDialog';
import { SurveyEditor } from 'case-editor-tools/surveys/survey-editor/survey-editor';
import LoadSurveyFromDisk from '../components/LoadSurveyFromDisk';
import { Survey } from 'survey-engine/data_types';

interface FileModeProps {
    editorInstance: SurveyEditor;
    onLoadNewSurvey: (survey: Survey) => void;
}

const FileMode: React.FC<FileModeProps> = (props) => {
    const [dialog, setDialog] = React.useState<'save' | 'load' | undefined>(undefined);


    return (
        <div className='flex items-center justify-center h-screen'>
            <Card
                className="bg-white/80"
                isBlurred
            >
                <div className='p-unit-md font-bold text-2xl'>
                    <h1>Welcome to the Survey Editor</h1>
                </div>
                <Divider />
                <div className='grid grid-cols-2 gap-unit-md p-unit-md divide-x'>
                    <div className='space-y-unit-md flex flex-col w-80'>
                        <Button
                            variant='flat'
                            size='lg'
                            className='flex items-center space-x-unit-sm justify-start h-auto py-unit-2'
                            onPress={() => setDialog('load')}
                        >
                            <span className='text-xl text-default-400'>
                                <BsFileArrowUp />
                            </span>
                            <div className='flex flex-col items-start'>
                                <span className='font-bold'>Import</span>
                                <span className='text-tiny text-default-600'>Load a survey from disk</span>
                            </div>
                        </Button>

                        <Button
                            variant='flat'
                            size='lg'
                            className='flex items-center space-x-unit-sm justify-start h-auto py-unit-2'
                            onPress={() => setDialog('save')}
                        >
                            <span className='text-xl text-default-400'>
                                <BsDownload />
                            </span>
                            <div className='flex flex-col items-start'>
                                <span className='font-bold'>Export</span>
                                <span className='text-tiny text-default-600'>Save current survey to disk</span>
                            </div>
                        </Button>
                    </div>
                    <div className='px-unit-md'>
                        <h2 className='text-small'>
                            Currently loaded survey:
                        </h2>
                        <p className='font-mono font-bold'>
                            {props.editorInstance.getSurvey().surveyDefinition.key}
                        </p>
                    </div>
                </div>
            </Card>
            <LoadSurveyFromDisk
                onLoadNewSurvey={props.onLoadNewSurvey}
                isOpen={dialog === 'load'}
                onOpenChange={(isOpen) => {
                    if (!isOpen) setDialog(undefined);
                }}
            />

            <SaveSurveyToDiskDialog
                editorInstance={props.editorInstance}
                isOpen={dialog === 'save'}
                onOpenChange={(isOpen) => {
                    if (!isOpen) setDialog(undefined);
                }}

            />
        </div>
    );
};

export default FileMode;
