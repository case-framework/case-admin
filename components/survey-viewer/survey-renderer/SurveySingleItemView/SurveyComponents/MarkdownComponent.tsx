import clsx from 'clsx';
import React from 'react';
import { ItemComponent } from 'survey-engine/data_types';
import { getClassName, getLocaleStringTextByCode } from '../utils';
import SimpleMarkdownRenderer from '../../components/SimpleMarkdownRenderer';


interface MarkdownComponentProps {
    compDef: ItemComponent;
    languageCode: string;
    className?: string;
}

const MarkdownComponent: React.FC<MarkdownComponentProps> = (props) => {
    const className = clsx(
        props.className,
        getClassName(props.compDef.style)
    );

    const content = getLocaleStringTextByCode(props.compDef.content, props.languageCode);

    return (
        <SimpleMarkdownRenderer
            className={clsx(
                'prose',
                className
            )}
        >
            {content ? content : ''}
        </SimpleMarkdownRenderer>
    );
};

export default MarkdownComponent;
