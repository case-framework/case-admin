'use client'

import React from 'react';
import type { ForwardedRef } from 'react'
import {
    headingsPlugin,
    listsPlugin,
    quotePlugin,
    thematicBreakPlugin,
    markdownShortcutPlugin,
    MDXEditor,
    type MDXEditorMethods,
    type MDXEditorProps,
    toolbarPlugin,
    UndoRedo,
    BoldItalicUnderlineToggles,
    ListsToggle,
    diffSourcePlugin,
    DiffSourceToggleWrapper,
    linkPlugin,
    imagePlugin,
    jsxPlugin
} from '@mdxeditor/editor'
import '@mdxeditor/editor/style.css'
import './markdown-editor.css'
import { cn } from '@/lib/utils';


interface InitialisedMdxEditorProps {
    editorRef: ForwardedRef<MDXEditorMethods> | null
};

const InitialisedMdxEditor: React.FC<InitialisedMdxEditorProps & MDXEditorProps> = (props) => {

    return (
        <MDXEditor
            ref={props.editorRef}
            plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                linkPlugin(),
                imagePlugin(),
                jsxPlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                diffSourcePlugin({ viewMode: 'rich-text' }),
                toolbarPlugin({
                    toolbarContents: () => (
                        <>
                            <DiffSourceToggleWrapper
                                options={['rich-text', 'source']}
                            >
                                {''}
                                <UndoRedo />
                                <BoldItalicUnderlineToggles />
                                <ListsToggle
                                    options={['bullet', 'number']}
                                />
                                <span className='grow'></span>
                            </DiffSourceToggleWrapper>
                        </>
                    )
                })
            ]}

            {...props}
            className={cn(
                'min-w-full h-64 z-10 bg-white rounded-lg overflow-auto border border-border',
                'prose prose-p:mt-0 prose-p:mb-3 prose-headings:mt-0 prose-li:my-1 prose-ul:my-0 prose-li:text-base prose-headings:mb-3',
            )}
        />
    );
};

export default InitialisedMdxEditor;
