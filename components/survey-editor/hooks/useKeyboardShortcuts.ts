import { useEffect } from 'react';

export interface KeyboardShortcutHandlers {
    onSave?: () => void;
    onUndo?: () => void;
    onRedo?: () => void;
}

export const useKeyboardShortcuts = (handlers: KeyboardShortcutHandlers) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check if Cmd (on Mac) or Ctrl (on Windows/Linux) is pressed
            const isModifierPressed = event.metaKey || event.ctrlKey;

            if (!isModifierPressed) {
                return;
            }

            switch (event.key.toLowerCase()) {
                case 's':
                    event.preventDefault();
                    handlers.onSave?.();
                    break;
                case 'z':
                    event.preventDefault();
                    if (event.shiftKey) {
                        // Shift+Cmd+Z or Shift+Ctrl+Z for redo
                        handlers.onRedo?.();
                    } else {
                        // Cmd+Z or Ctrl+Z for undo
                        handlers.onUndo?.();
                    }
                    break;
                case 'y':
                    // Ctrl+Y for redo (Windows convention)
                    if (!event.metaKey && event.ctrlKey) {
                        event.preventDefault();
                        handlers.onRedo?.();
                    }
                    break;
                default:
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handlers]);
};
