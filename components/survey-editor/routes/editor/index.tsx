import EditorFooter from "./_components/footer"
import EditorSidebar from "./_components/sidebar"
import EditorMain from "./_components/main"
import { Navigate } from "react-router";
import { useKeyboardShortcuts } from "../../hooks/useKeyboardShortcuts";
import { useCallback } from "react";
import { toast } from "sonner";

const Editor = () => {
    const hasSession = true;

    const handleSave = useCallback(() => {
        // TODO: Implement save functionality
        console.log("Save triggered via keyboard shortcut");
        toast.success("Save functionality triggered (Ctrl/Cmd + S)");
        // For now, just show a notification or trigger a save dialog
        // This could be expanded to save to localStorage, trigger a download, etc.
    }, []);

    const handleUndo = useCallback(() => {
        // TODO: Implement undo functionality
        console.log("Undo triggered via keyboard shortcut");
        toast.success("Undo functionality triggered (Ctrl/Cmd + Z)");
        // This would typically revert to the previous state in a history stack
    }, []);

    const handleRedo = useCallback(() => {
        // TODO: Implement redo functionality
        console.log("Redo triggered via keyboard shortcut");
        toast.success("Redo functionality triggered (Ctrl/Cmd + Shift + Z)");
        // This would typically move forward in the history stack
    }, []);

    // Setup keyboard shortcuts
    useKeyboardShortcuts({
        onSave: handleSave,
        onUndo: handleUndo,
        onRedo: handleRedo,
    });

    if (!hasSession) {
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
