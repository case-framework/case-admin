import React from 'react';
import { ItemComponent } from 'survey-engine/data_types';
import { parseCQM } from 'survey-engine/cqm-parser';
import { getClassName } from './utils';
import { cn } from '@/lib/utils';
import SimpleMarkdownRenderer from '../components/SimpleMarkdownRenderer';

export const renderContent = (component: ItemComponent, contentKey: string, classNameOverride?: string): React.ReactNode => {
    const content = component.content?.find(c => c.key === contentKey);
    if (!content) {
        return <span
            className='text-destructive font-mono text-sm font-normal'
        >
            {`Content doesn't exist for key "${contentKey}" in component "${component.role} (${component.key})"`}
        </span>
    }

    const className = classNameOverride || getClassName(component.style);

    switch (content?.type) {
        case 'simple':
            return <span
                className={className}
            >{content.resolvedText}</span>
        case 'CQM':
            return renderCQMContent(content?.resolvedText, className)
        case 'md':
            return renderMarkdownContent(content?.resolvedText, className)
        default:
            console.warn(`content type not implemented: ${content.type}`);
            return null
    }
}

export const renderCQMContent = (content?: string, className?: string) => {
    const parts = parseCQM(content);

    return <span className={className}>
        {parts.map((part, index) => {
            return <span
                key={index.toFixed()}
                className={cn({
                    'text-primary': part.primary,
                    'underline': part.underline,
                    'italic': part.italic,
                    'font-bold': part.bold
                })}
            >{part.content}</span>
        })}</span>
}

export const renderMarkdownContent = (content?: string, className?: string) => {
    return <SimpleMarkdownRenderer
        className={className}
    >
        {content || ''}
    </SimpleMarkdownRenderer>
}
