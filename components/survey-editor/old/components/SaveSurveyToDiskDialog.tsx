import { format } from 'date-fns';
import React, { useEffect, useContext } from 'react';
import { SurveyEditorContext } from '../../surveyEditorContext';
import { toast } from 'sonner';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

interface SaveSurveyToDiskDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

const SaveSurveyToDiskDialog: React.FC<SaveSurveyToDiskDialogProps> = ({
    isOpen,
    onClose,
}) => {
    const { survey } = useContext(SurveyEditorContext);
    const [fileName, setFileName] = React.useState<string>('');
    const [useIndentation, setUseIndentation] = React.useState<boolean>(true);
    const [isPending, startTransition] = React.useTransition();
    const saveButtonRef = React.useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen && survey) {
            const newFileName = `${survey.surveyDefinition.key}_${format(new Date(), 'yyyy-MM-dd')}.json`;
            setFileName(newFileName);
        }
    }, [isOpen, survey]);

    const onSave = () => {
        const surveyStr = JSON.stringify(survey, null, useIndentation ? 2 : 0);
        const blob = new Blob([surveyStr], { type: 'application/json' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();

        toast.success('Survey saved to disk');

        onClose();
    }

    return (
        <Dialog
            open={isOpen}
            onOpenChange={onClose}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Save to disk</DialogTitle>
                </DialogHeader>

                <div>
                    <Label htmlFor='filename'>
                        File name
                    </Label>
                    <Input
                        id='filename'
                        name='filename'
                        className='my-1.5'
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder='Enter a file name'
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                saveButtonRef.current?.click();
                            }
                        }}
                    />
                    <p className='text-xs'>
                        The file will be saved in the downloads folder of your browser.
                    </p>
                </div>

                <div>
                    <Label htmlFor='use-indentation'
                        className='flex items-center gap-2'
                    >
                        <Switch
                            id='use-indentation'
                            name='use-indentation'
                            className='my-1.5'
                            checked={useIndentation}
                            onCheckedChange={setUseIndentation}
                        />
                        Use indentation
                    </Label>
                </div>

                <DialogFooter>
                    <DialogClose
                        asChild
                    >
                        <Button variant={'outline'}>
                            Cancel
                        </Button>
                    </DialogClose>
                    <LoadingButton
                        ref={saveButtonRef}
                        disabled={!fileName || fileName.length === 0 || !survey}
                        isLoading={isPending}
                        onClick={() => {
                            startTransition(() => onSave());
                        }}
                    >
                        Save
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>

        </Dialog>
    );
};

export default SaveSurveyToDiskDialog;
