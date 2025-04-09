import React, { useEffect } from 'react';
import { useStudyExpressionEditor } from '../study-expression-editor-context';


const KeyboardShortcuts: React.FC = () => {
    const {
        saveRulesToDisk,
        saveSessionToDisk,
    } = useStudyExpressionEditor();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            // Check if Cmd (metaKey) or Ctrl is pressed along with 'S'
            if ((event.metaKey || event.ctrlKey)) {
                switch (event.key) {
                    case 'e':
                        event.preventDefault();
                        saveRulesToDisk()
                        break;
                    case 's':
                        event.preventDefault();
                        saveSessionToDisk();
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
    }, [saveRulesToDisk, saveSessionToDisk]);

    return null;
};

export default KeyboardShortcuts;
