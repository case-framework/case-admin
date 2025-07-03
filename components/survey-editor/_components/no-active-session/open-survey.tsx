import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OpenSurveyProps {
    open: boolean;
    onClose: () => void;
}

const OpenSurvey: React.FC<OpenSurveyProps> = ({ open, onClose }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Open Survey</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default OpenSurvey;