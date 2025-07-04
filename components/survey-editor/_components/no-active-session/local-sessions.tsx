import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Trash2, Clock } from "lucide-react";
import { useState } from "react";

interface LocalSessionsProps {
    open: boolean;
    onClose: () => void;
}

interface LocalSession {
    id: string;
    surveyKey: string;
    lastChange: Date;
}

const LocalSessions: React.FC<LocalSessionsProps> = ({ open, onClose }) => {
    // Mock session data
    const [sessions, setSessions] = useState<LocalSession[]>([
        {
            id: "session-1",
            surveyKey: "weekly-health-survey",
            lastChange: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
            id: "session-2",
            surveyKey: "patient-feedback-form",
            lastChange: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
            id: "session-3",
            surveyKey: "medication-adherence-questionnaire",
            lastChange: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
            id: "session-4",
            surveyKey: "medication-adherence-questionnaire",
            lastChange: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
            id: "session-5",
            surveyKey: "medication-adherence-questionnaire",
            lastChange: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        }
    ]);

    const [selectedSessionId, setSelectedSessionId] = useState<string>("");
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [sessionToDelete, setSessionToDelete] = useState<LocalSession | null>(null);

    const handleDeleteSession = (sessionId: string) => {
        setSessions(sessions.filter(session => session.id !== sessionId));
        // Clear selection if the selected session was deleted
        if (selectedSessionId === sessionId) {
            setSelectedSessionId("");
        }
        setDeleteConfirmOpen(false);
        setSessionToDelete(null);
    };

    const handleDeleteClick = (session: LocalSession) => {
        setSessionToDelete(session);
        setDeleteConfirmOpen(true);
    };

    const handleLoadSession = (sessionId: string) => {
        // TODO: Implement session loading
        console.log('Load session:', sessionId);
        onClose();
    };

    const handleDoubleClick = (sessionId: string) => {
        handleLoadSession(sessionId);
    };

    const formatLastChange = (date: Date) => {
        const now = new Date();
        const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) {
            return "Just now";
        } else if (diffInHours < 24) {
            return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        } else {
            const diffInDays = Math.floor(diffInHours / 24);
            return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onClose}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Local Sessions</DialogTitle>
                        <DialogDescription>
                            Restoring a session will load the survey and all its state into the current tab.
                        </DialogDescription>
                    </DialogHeader>

                    {/* Warning Display */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                                <p className="font-medium text-yellow-800 mb-1">Use at your own risk!</p>
                                <p className="text-yellow-700 text-xs">
                                    Local sessions are stored in your browser&apos;s local storage and are not saved to the cloud.
                                    They can be lost if browser cache is cleared, browser data is deleted, or you switch devices.
                                    This is only a small helper to pick up sessions again or share state between browser tabs.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sessions List */}
                    <div className="flex flex-col gap-2">
                        {sessions.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>No local sessions found</p>
                            </div>
                        ) : (
                            <RadioGroup
                                value={selectedSessionId}
                                onValueChange={setSelectedSessionId}
                                className="divide-y gap-0 divide-border border border-border focus-within:ring-2 focus-within:ring-primary/20 rounded-2xl overflow-y-auto max-h-[300px]"
                            >
                                {sessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className="group flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                                        onDoubleClick={() => handleDoubleClick(session.id)}
                                    >
                                        <RadioGroupItem value={session.id} id={session.id} />
                                        <Label
                                            htmlFor={session.id}
                                            className="flex-1 cursor-pointer"
                                        >
                                            <div className="space-y-1">
                                                <h3 className="font-medium text-sm leading-tight">{session.surveyKey}</h3>
                                                <div className="text-xs text-muted-foreground">
                                                    ID: {session.id}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>Last modified: {formatLastChange(session.lastChange)}</span>
                                                </div>
                                            </div>
                                        </Label>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDeleteClick(session);
                                            }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </RadioGroup>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <div className="text-xs text-muted-foreground w-44 text-balance">
                            {sessions.length > 0 && "Tip: Double-click an item to load it quickly"}
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                            <Button
                                onClick={() => selectedSessionId && handleLoadSession(selectedSessionId)}
                                disabled={!selectedSessionId}
                            >
                                Load Selected
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Local Session</AlertDialogTitle>
                        <AlertDialogDescription>
                            <span className='block mb-2'>
                                Are you sure you want to delete the session for <span className="font-bold">{sessionToDelete?.surveyKey}</span>?
                            </span>

                            <span className="text-xs">
                                This action cannot be undone and all unsaved changes in this session will be lost.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => sessionToDelete && handleDeleteSession(sessionToDelete.id)}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default LocalSessions;
