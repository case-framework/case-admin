import React, { useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { SurveyItem } from 'survey-engine/data_types';
import { Button } from '@/components/ui/button';


interface ItemSourceEditorProps {
    surveyItem: SurveyItem;
    onExitSourceMode: () => void;
    onApply: (modifiedItem: SurveyItem) => void;
}

const ItemSourceEditor: React.FC<ItemSourceEditorProps> = (props) => {
    const [editorContent, setEditorContent] = React.useState<string | undefined>('');

    useEffect(() => {
        const itemAsJSON = JSON.stringify(props.surveyItem, undefined, 2);
        setEditorContent(itemAsJSON)
    }, [props.surveyItem])

    const hasChanges = () => {
        const itemAsJSON = JSON.stringify(props.surveyItem, undefined, 2);
        return itemAsJSON !== editorContent;
    }

    return (
        <div className='h-full p-3 flex flex-col gap-3 border-t border-neutral-300'>
            <Editor
                className='grow rounded-lg overflow-hidden border border-border'
                defaultLanguage="json"
                value={editorContent}
                options={{
                    minimap: {
                        enabled: false,
                    },
                    roundedSelection: true,
                }}
                language='json'
                onChange={(e) => {
                    setEditorContent(e);
                    if (!e) return;

                }}
            />

            <div className='z-10 flex gap-3 justify-end'>
                <Button
                    variant={'outline'}
                    onClick={() => {
                        if (hasChanges()) {
                            if (!confirm('Are you sure you want to discard your changes?')) {
                                return;
                            }
                        }
                        const itemAsJSON = JSON.stringify(props.surveyItem, undefined, 2);
                        setEditorContent(itemAsJSON)
                        props.onExitSourceMode()
                    }}
                >
                    Cancel
                </Button>

                <Button
                    onClick={() => {
                        if (!editorContent) {
                            console.warn('missing editor content')
                            return;
                        }
                        const modifiedItem = JSON.parse(editorContent) as SurveyItem;
                        props.onApply(modifiedItem);
                    }}
                    disabled={!hasChanges()}
                >
                    Apply changes
                </Button>
            </div>
        </div>
    );
};

export default ItemSourceEditor;
