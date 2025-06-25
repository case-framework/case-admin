import { MDXEditorMethods } from '@mdxeditor/editor';
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';

const MdxEditor = dynamic(() => import('./initialised-mdx-editor'), {
    ssr: false
})

interface MarkdownContentEditorProps {
    content: string;
    onUpdateContent: (content: string) => void;
}

const MarkdownContentEditor: React.FC<MarkdownContentEditorProps> = (props) => {
    const mdEditorRef = React.useRef<MDXEditorMethods>(null);

    useEffect(() => {
        if (mdEditorRef.current) {
            mdEditorRef.current.setMarkdown(props.content);
        }
    }, [props.content]);

    return (
        <MdxEditor
            placeholder='Write your content here...'
            editorRef={mdEditorRef}
            markdown={props.content}
            onChange={(content) => {
                props.onUpdateContent(content);
            }}
        />
    );
};

export default MarkdownContentEditor;
