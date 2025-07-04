import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Filepicker from "@/components/inputs/Filepicker";
import React, { useState } from "react";
import { Survey } from "survey-engine";

interface OpenSurveyProps {
    open: boolean;
    onClose: () => void;
    onLoadSurvey?: (survey: Survey) => void;
}

const OpenSurvey: React.FC<OpenSurveyProps> = ({ open, onClose, onLoadSurvey }) => {
    const [selectedSurvey, setSelectedSurvey] = useState<Survey | undefined>(undefined);
    const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    // Reset state when dialog opens/closes
    React.useEffect(() => {
        if (open) {
            setSelectedSurvey(undefined);
            setErrorMsg(undefined);
            setIsLoading(false);
        }
    }, [open]);

    const handleFileChange = (files: readonly File[]) => {
        setSelectedSurvey(undefined);
        setErrorMsg(undefined);
        setIsLoading(true);

        if (files.length === 0) {
            setIsLoading(false);
            return;
        }

        const file = files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            const text = e.target?.result;
            if (typeof text === 'string') {
                try {
                    const data = JSON.parse(text);

                    // Validate survey structure
                    if (!data) {
                        setErrorMsg('Invalid file format - file appears to be empty or corrupted.');
                        setIsLoading(false);
                        return;
                    }

                    if (!data.surveyDefinition) {
                        setErrorMsg('Invalid survey file - missing surveyDefinition.');
                        setIsLoading(false);
                        return;
                    }

                    if (!data.surveyDefinition.key) {
                        setErrorMsg('Invalid survey file - survey key not found.');
                        setIsLoading(false);
                        return;
                    }

                    // Valid survey file
                    setSelectedSurvey(data as Survey);
                    setErrorMsg(undefined);
                } catch (error) {
                    console.error('Error parsing survey file:', error);
                    setErrorMsg('Invalid JSON format - unable to parse the file.');
                }
            } else {
                setErrorMsg('Unable to read the file content.');
            }
            setIsLoading(false);
        };

        reader.onerror = () => {
            setErrorMsg('Error reading the file.');
            setIsLoading(false);
        };

        reader.readAsText(file);
    };

    const handleLoadSurvey = () => {
        if (selectedSurvey && onLoadSurvey) {
            onLoadSurvey(selectedSurvey);
            onClose();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Open Survey</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground mb-3">
                            Select a survey file (.csurvey) to open:
                        </p>

                        <Filepicker
                            id="survey-file-picker"
                            accept={{
                                'application/json': ['.csurvey', '.json'],
                            }}
                            onChange={handleFileChange}
                            placeholders={{
                                upload: 'Click to select survey file',
                                drag: 'or drag and drop a .csurvey file'
                            }}
                        />
                    </div>

                    {isLoading && (
                        <p className="text-sm text-muted-foreground">
                            Validating survey file...
                        </p>
                    )}

                    {errorMsg && (
                        <p className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
                            {errorMsg}
                        </p>
                    )}

                    {selectedSurvey && !errorMsg && (
                        <div className="text-sm text-green-600 bg-green-50 p-3 rounded-md">
                            <p><strong>Valid survey file detected:</strong></p>
                            <p>Survey Key: {selectedSurvey.surveyKey}</p>
                            {selectedSurvey.rootItem?.key && (
                                <p>Root Item Key: {selectedSurvey.rootItem.key.toString()}</p>
                            )}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleLoadSurvey}
                        disabled={!selectedSurvey || isLoading}
                    >
                        Load Survey
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default OpenSurvey;
