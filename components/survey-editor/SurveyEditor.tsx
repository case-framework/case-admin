'use client';

import React, { useEffect } from 'react';

import TestPreview from './test-preview';

const SurveyEditorWrapper: React.FC = () => {
    return <p>use index.tsx</p>
    return <TestPreview />;
}

/* import SurveyEditorMenu from './components/SurveyEditorMenu';
import ItemEditor from './components/ItemEditor/ItemEditor';
import { Survey } from 'survey-engine/data_types';
import { EditorMode } from './components/types';
import { Toaster } from 'sonner';
import { SurveyEditorContextProvider } from './surveyEditorContext';
import SurveyProperties from './components/survey-props-editor/survey-props-editor';
import SaveSurveyToDiskDialog from './components/SaveSurveyToDiskDialog';
import LoadSurveyFromDisk from './components/LoadSurveyFromDisk';
import SurveySimulator from './components/SurveySimulator';
import WelcomeScreen from './components/welcome-screen';
import InitNewSurveyDialog from './components/init-new-survey-dialog';
import { useDebounceCallback, useLocalStorage } from 'usehooks-ts';
import { StoredSurvey, SurveyStorage } from './utils/SurveyStorage';
import { getSurveyIdentifier } from './utils/utils';
import TestPreview from './test-preview';

interface SurveyEditorProps {
    initialSurvey?: Survey;
    notLatestVersion?: boolean;
    embedded?: boolean;
    simulatorUrl: string;
    onUploadNewVersion?: (survey?: Survey) => void;
    onExit?: () => void;
}

const SurveyEditor: React.FC<SurveyEditorProps> = (props) => {
    const [mode, setMode] = React.useState<EditorMode>(EditorMode.ItemEditor);

    const [openSaveDialog, setOpenSaveDialog] = React.useState<boolean>(false);
    const [openLoadDialog, setOpenLoadDialog] = React.useState<boolean>(false);
    const [openNewDialog, setOpenNewDialog] = React.useState<boolean>(false);
    const [selectedLanguage, setSelectedLanguage] = React.useState<string>(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');
    const runDebounced = useDebounceCallback((f) => f(), 1000);

    //  Main State
    const [surveyStorage, setSurveyStorage] = useLocalStorage('SurveyStorage', new SurveyStorage(), { serializer: (storage) => JSON.stringify(storage.asObject()), deserializer: (s) => new SurveyStorage(s) });

    //  Associated State
    const [storedSurvey, setStoredSurvey] = React.useState<StoredSurvey | undefined>(props.initialSurvey ? new StoredSurvey(getSurveyIdentifier(props.initialSurvey), props.initialSurvey, new Date()) : undefined);

    //  Derived state
    const survey = storedSurvey?.survey;
    const setSurvey = (s: Survey) => {
        setStoredSurvey(new StoredSurvey(storedSurvey?.id ?? getSurveyIdentifier(s), s, new Date()));
    };

    //  Update associated state if survey storage changes. Usually external changes trigger this.
    useEffect(() => {
        const updatedStoredSurvey = surveyStorage.storedSurveys.find(s => s.id === storedSurvey?.id);
        if (updatedStoredSurvey && JSON.stringify(updatedStoredSurvey?.survey) !== JSON.stringify(storedSurvey?.survey)) {
            setStoredSurvey(updatedStoredSurvey);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [surveyStorage]);

    //  Run every time stored survey changes, but debounced
    useEffect(() => {
        if (storedSurvey) {
            runDebounced(() => {
                surveyStorage.updateSurvey(new StoredSurvey(storedSurvey.id, storedSurvey.survey, new Date()));
                setSurveyStorage(surveyStorage);
            });
        }
        return () => {
            runDebounced.cancel();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [storedSurvey]);

    // Handle events for keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check if Cmd (metaKey) or Ctrl is pressed along with 'S'
            if ((event.metaKey || event.ctrlKey)) {
                switch (event.key) {
                    case '1':
                        event.preventDefault();
                        setMode(EditorMode.Properties);
                        break;
                    case '2':
                        event.preventDefault();
                        setMode(EditorMode.ItemEditor);
                        break;
                    case '3':
                        event.preventDefault();
                        setMode(EditorMode.Simulator);
                        break;
                    case 's':
                        event.preventDefault();
                        if (!storedSurvey) {
                            break;
                        }
                        setOpenSaveDialog(true);
                        break;
                    case 'o':
                        event.preventDefault();
                        setOpenLoadDialog(true);
                        break;
                }

            }
        };

        // Attach the event listener
        document.addEventListener('keydown', handleKeyDown);

        // Cleanup the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [storedSurvey]);


    let mainContent: React.ReactNode = null;
    switch (mode) {
        case EditorMode.Properties:
            mainContent = <SurveyProperties />;
            break;
        case EditorMode.ItemEditor:
            mainContent = <ItemEditor
                className='grow'
            />;
            break;
        case EditorMode.Simulator:
            mainContent = <SurveySimulator
                simulatorUrl={props.simulatorUrl}
            />
            break;
    }

    if (!storedSurvey) {
        mainContent = (<WelcomeScreen
            onCreateSurvey={() => {
                setOpenNewDialog(true);
            }}
            onOpenSurvey={() => {
                setOpenLoadDialog(true);
            }}
            recentlyEditedStoredSurvey={surveyStorage.getMostRecentlyEditedSurvey()}
            onOpenRecentlyEditedSurvey={() => {
                setStoredSurvey(surveyStorage.getMostRecentlyEditedSurvey());
            }}
        />
        );
    }

    return (
        <SurveyEditorContextProvider
            survey={survey}
            setSurvey={setSurvey}
            storedSurvey={storedSurvey}
            setStoredSurvey={setStoredSurvey}
            selectedLanguage={selectedLanguage}
            setSelectedLanguage={setSelectedLanguage}
        >

            <div className='bg-center bg-cover bg-[url(/images/sailing-ship.png)] h-screen absolute top-0 left-0 w-screen z-40 flex flex-col'>
                <SurveyEditorMenu
                    currentEditorMode={mode}
                    onChangeMode={setMode}
                    noSurveyOpen={!survey}
                    embedded={props.embedded}
                    onSave={() => setOpenSaveDialog(true)}
                    onOpen={() => setOpenLoadDialog(true)}
                    onNew={() => setOpenNewDialog(true)}
                    onExit={() => { props.onExit?.() }}
                    onUploadNewVersion={() => { props.onUploadNewVersion?.(survey) }}
                    notLatestVersion={props.notLatestVersion}
                />

                <div className='overflow-hidden flex flex-col grow'>
                    {mainContent}
                </div >
                <LoadSurveyFromDisk
                    isOpen={openLoadDialog}
                    onClose={() => setOpenLoadDialog(false)}
                    surveyStorage={surveyStorage}
                    setSurveyStorage={setSurveyStorage}
                />
                <SaveSurveyToDiskDialog
                    isOpen={openSaveDialog}
                    onClose={() => setOpenSaveDialog(false)}
                />
                <InitNewSurveyDialog
                    isOpen={openNewDialog}
                    onClose={() => setOpenNewDialog(false)}
                />
                <Toaster
                    expand={true}
                />
            </div >
        </SurveyEditorContextProvider>
    );
}; */

export default SurveyEditorWrapper;
