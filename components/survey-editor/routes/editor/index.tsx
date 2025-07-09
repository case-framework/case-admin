import EditorFooter from "./_components/footer"
import EditorSidebar from "./_components/sidebar"
import EditorMain from "./_components/main"
import { Navigate } from "react-router";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useCallback } from "react";
import { toast } from "sonner";
import { useSessionStore } from "../../store/session-store";
import { useSurveyEditor } from "../../store/useSurveyEditor";

const Editor = () => {
    const { currentSession } = useSessionStore();
    const { editor } = useSurveyEditor();

    const handleSave = useCallback(() => {
        // TODO: Implement save functionality
        console.log("Save triggered via keyboard shortcut");
        console.log(editor?.survey.toJson());
        toast.success("Save functionality triggered (Ctrl/Cmd + S)");
        // For now, just show a notification or trigger a save dialog
        // This could be expanded to save to localStorage, trigger a download, etc.
    }, [editor]);

    const handleUndo = useCallback(() => {
        if (editor?.canUndo()) {
            if (editor?.undo()) {
                toast.success("Undo functionality triggered (Ctrl/Cmd + Z)");
            } else {
                toast.error("No more actions to undo");
            }
        } else {
            toast.error("No more actions to undo");
        }
    }, [editor]);

    const handleRedo = useCallback(() => {
        if (editor?.canRedo()) {
            if (editor?.redo()) {
                toast.success("Redo functionality triggered (Ctrl/Cmd + Shift + Z)");
            } else {
                toast.error("No more actions to redo");
            }
        } else {
            toast.error("No more actions to redo");
        }
    }, [editor]);

    // Setup keyboard shortcuts
    useKeyboardShortcuts({
        onSave: handleSave,
        onUndo: handleUndo,
        onRedo: handleRedo,
    });

    if (!currentSession) {
        return <Navigate to="/" replace />
    }

    return <div className="flex flex-col h-screen w-screen overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
            <EditorSidebar onSave={handleSave} onUndo={handleUndo} onRedo={handleRedo} />
            <EditorMain />
        </div>
        <EditorFooter />
    </div>
}

export default Editor;
