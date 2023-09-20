import { Button } from '@nextui-org/button';
import { SurveyEditor } from 'case-editor-tools/surveys/survey-editor/survey-editor';
import React from 'react';
import { BsDownload, BsSave } from 'react-icons/bs';
import SaveSurveyToDiskDialog from './SaveSurveyToDiskDialog';

interface EditorMenuProps {
    title: string;
    editorInstance: SurveyEditor;
}

const EditorMenu: React.FC<EditorMenuProps> = (props) => {
    const [isSaveDialogOpen, setIsSaveDialogOpen] = React.useState(false);


    return (
        <div className='fixed top-0 left-0 h-12 w-full border-b border-default-400 z-20 bg-neutral-100/70 backdrop-blur-md px-unit-sm'>
            <div className='pl-14 flex items-center h-full'>
                <h1 className='grow font-bold'>
                    {props.title}
                </h1>
                <Button
                    variant='light'
                    color='secondary'
                    startContent={<BsDownload />}
                    onPress={() => {
                        setIsSaveDialogOpen(true);
                    }}
                >
                    Save Survey
                </Button>
            </div>
            <SaveSurveyToDiskDialog
                isOpen={isSaveDialogOpen}
                onOpenChange={(isOpen) => {
                    setIsSaveDialogOpen(isOpen);
                }}
                editorInstance={props.editorInstance}
            />
        </div >
    );
};

export default EditorMenu;
