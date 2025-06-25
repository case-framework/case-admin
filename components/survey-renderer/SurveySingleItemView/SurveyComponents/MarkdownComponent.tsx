import React from 'react';
import { ItemComponent } from 'survey-engine/data_types';
import { getClassName } from '../utils';
import { renderContent } from '../renderUtils';
import { cn } from '@/lib/utils';


interface MarkdownComponentProps {
    compDef: ItemComponent;
    className?: string;
    embedded: boolean;
}

const MarkdownComponent: React.FC<MarkdownComponentProps> = (props) => {
    const className = cn(
        {
            'px-(--survey-card-px-sm) @md:px-(--survey-card-px)': !props.embedded,
        },
        'prose prose-p:my-1 prose-headings:mb-2 prose-ul:mt-0 prose-ul:ml-0 prose-ul:pl-4 prose-li:text-justify prose-p:break-words',
        props.className,
        getClassName(props.compDef.style)
    );

    return renderContent(props.compDef, 'content', className);
};

export default MarkdownComponent;
