import Filepicker from '@/components/inputs/Filepicker';
import React from 'react';
import { Survey } from 'survey-engine/data_types';
import { findAllLocales, removeLocales, renameLocales } from '../utils/localeUtils';
import { Button } from '@/components/ui/button';
import { SurveyEditorContext } from '../../surveyEditorContext';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { StoredSurvey, SurveyStorage } from '../utils/SurveyStorage';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { getSurveyIdentifier } from '../utils/utils';
import { formatDistance } from 'date-fns';
import { AlertTriangleIcon, PencilIcon, XIcon } from 'lucide-react';

interface LoadSurveyFromDiskProps {
    isOpen: boolean;
    onClose: () => void;
    surveyStorage: SurveyStorage;
    setSurveyStorage: (storage: SurveyStorage) => void;
}


const LocaleEditor: React.FC<{
    locale: string,
    onRename: (oldLocale: string, newLocale: string) => void,
    onDelete: (locale: string) => void,
}> = ({ locale, onRename, onDelete }) => {
    return (
        <div className='flex items-center gap-4'>
            <span className='font-mono grow'>{locale}</span>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                    const newLocale = prompt('Enter new locale code:');
                    if (newLocale) {
                        onRename(locale, newLocale);
                    }
                }}
            >
                <PencilIcon />
            </Button>
            <Button
                variant='ghost'
                size='icon'
                onClick={() => {
                    if (confirm(`Are you sure you want to delete locale ${locale}?`)) {
                        onDelete(locale);
                    }
                }}
            >
                <XIcon />
            </Button>
        </div>
    )
}


const LoadSurveyFromDisk: React.FC<LoadSurveyFromDiskProps> = ({
    isOpen,
    onClose,
    surveyStorage,
    setSurveyStorage
}) => {
    const { storedSurvey, setStoredSurvey } = React.useContext(SurveyEditorContext);
    const [surveyFileContent, setSurveyFileContent] = React.useState<Survey | undefined>(undefined);
    const [storedSurveySelectionId, setStoredSurveySelectionId] = React.useState<string | undefined>(undefined);
    const [errorMsg, setErrorMsg] = React.useState<string | undefined>(undefined);

    const storedSurveys = surveyStorage.storedSurveys;


    React.useEffect(() => {
        setSurveyFileContent(undefined);
        setStoredSurveySelectionId(undefined);
    }, [isOpen]);

    const onLoadClick = () => {
        if (storedSurveySelectionId) {
            const storedSurvey = storedSurveys.find(ss => ss.id === storedSurveySelectionId);
            if (storedSurvey) {
                setStoredSurvey(storedSurvey);
            }
        } else {
            console.log('load survey from file contents', surveyFileContent);
            if (!surveyFileContent) return;
            setStoredSurvey(new StoredSurvey(getSurveyIdentifier(surveyFileContent), surveyFileContent, new Date()));
        }
        toast.success('Survey loaded');
        onClose();
    }


    let localesFromSurvey: string[] = [];
    if (surveyFileContent) {
        localesFromSurvey = findAllLocales(surveyFileContent);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}
        >
            <DialogContent
                className='overflow-auto max-h-svh lg:max-w-2xl'
            >
                <DialogHeader>
                    <DialogDescription />
                    <DialogTitle>
                        Pick survey file to open
                    </DialogTitle>
                </DialogHeader>
                <div>
                    <div className='py-3'>
                        <p className='pb-2'>From local computer:</p>

                        <Filepicker
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
                            <p className='text-red-700 mt-3'>{errorMsg}</p>
                        )}
                    </div>
                    {storedSurveys && storedSurveys.length > 0 && <div className='py-3'>
                        <p className='mb-2'>From recently opened surveys:</p>
                        <div className='flex flex-col gap-2'>
                            {
                                storedSurveys ? storedSurveys.sort((a, b) => b.lastUpdated.getTime() - a.lastUpdated.getTime()).map((ss, i) => (
                                    <Card key={i} className={cn('flex items-center justify-between', storedSurveySelectionId == ss.id ? "bg-slate-200" : "")}>
                                        <Button
                                            variant='ghost'
                                            className='grow pre'
                                            onClick={() => {
                                                if (storedSurveySelectionId == ss.id) {
                                                    setStoredSurveySelectionId(undefined);
                                                } else {
                                                    setStoredSurveySelectionId(ss.id);
                                                }
                                            }}
                                            onDoubleClick={() => {
                                                const storedSurvey = storedSurveys.find(item => ss.id === item.id);
                                                if (storedSurvey) {
                                                    setStoredSurvey(storedSurvey);
                                                }
                                                toast.success('Survey loaded successfully');
                                                onClose();
                                            }}
                                        >
                                            <>{ss.id}&nbsp;{"("}{formatDistance(ss.lastUpdated, new Date())}{" ago)"}</>
                                        </Button>
                                        <Button
                                            variant='ghost'
                                            size='icon'
                                            onClick={() => {
                                                if (confirm(`Are you sure you want to delete survey ${"\"" + ss.id + "\""} from memory?`)) {
                                                    const deletedSurvey = storedSurveys.find(s => s.id === ss.id);
                                                    if (deletedSurvey) {
                                                        surveyStorage.removeSurvey(deletedSurvey);
                                                        setSurveyStorage(surveyStorage);
                                                        if (storedSurvey?.id === ss.id) {
                                                            setStoredSurvey(undefined);
                                                        }
                                                    }
                                                }
                                            }}
                                        >
                                            <XIcon />
                                        </Button>
                                    </Card>
                                )) : null
                            }
                        </div>
                    </div>}
                    {localesFromSurvey.length > 0 && (
                        <div>
                            <h3 className='text-sm font-bold mb-2'>Locales used:</h3>
                            <ul>
                                {localesFromSurvey.map((loc, i) => (
                                    <li key={i} className=' bg-neutral-50 border rounded-lg px-3 py-3 mb-3'>
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

                </div>
                {storedSurvey && <div className={"flex items-center gap-3 p-4 bg-yellow-100 rounded-lg"}>
                    <span className='text-yellow-800 text-xl'>
                        <AlertTriangleIcon />
                    </span>
                    <p className="text-yellow-800">
                        This will overwrite the current survey. Are you sure you want to continue?
                    </p>
                </div>}
                <DialogFooter>

                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>

                    <Button color="primary" onClick={onLoadClick}
                        disabled={!(surveyFileContent || storedSurveySelectionId)}
                    >
                        Open
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog >
    );
};

export default LoadSurveyFromDisk;
