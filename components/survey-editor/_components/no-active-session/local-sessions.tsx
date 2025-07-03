import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface LocalSessionsProps {
    open: boolean;
    onClose: () => void;
}

const LocalSessions: React.FC<LocalSessionsProps> = ({ open, onClose }) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Local Sessions</DialogTitle>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default LocalSessions;
