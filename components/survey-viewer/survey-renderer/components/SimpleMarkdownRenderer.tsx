import React from 'react';
import ReactMarkdown from 'react-markdown';


interface MarkdownRendererProps {
    className?: string;
    children: string;
}

const SimpleMarkdownRenderer: React.FC<MarkdownRendererProps> = (props) => {
    return (
        <ReactMarkdown
            className={props.className}
            components={{
                a: ({ node, ...props }) => {
                    return <a
                        className='text-primary-500 hover:underline'
                        href={props.href as string} {...props} />
                }
            }}
        >
            {props.children}
        </ReactMarkdown>
    );
};

export default SimpleMarkdownRenderer;
