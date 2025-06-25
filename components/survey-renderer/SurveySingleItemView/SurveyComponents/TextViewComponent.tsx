import React from 'react';
import { ItemComponent } from 'survey-engine/data_types';
import { getClassName } from '../utils';
import clsx from 'clsx';
import { renderContent } from '../renderUtils';

interface TextViewComponentProps {
    compDef: ItemComponent;
    className?: string;
    embedded: boolean;
}

const supportedVariants = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'span'] as const;
type Variant = typeof supportedVariants[number]; // 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p';

const isValidVariant = (variant: unknown): variant is Variant => {
    return typeof variant === 'string' && supportedVariants.findIndex(v => v === variant) > -1;
}

const getVariant = (styles?: Array<{ key: string, value: string }>): Variant | undefined => {
    if (!styles) {
        return;
    }
    const variantObj = styles.find(st => st.key === 'variant');
    if (!variantObj) {
        return;
    }
    const variant = variantObj.value;
    if (!isValidVariant(variant)) {
        console.warn(`unsupported variant "${variant}", fallback to "p"`);
        return;
    }
    return variant;
}



const TextViewComponent: React.FC<TextViewComponentProps> = (props) => {
    const variant = getVariant(props.compDef.style);
    const className = clsx(
        {
            'm-0': !variant,
            'px-(--survey-card-px-sm) @md:px-(--survey-card-px)': !props.embedded
        },
        props.className,
        getClassName(props.compDef.style)
    );

    const content = renderContent(props.compDef, 'content', className);

    const TextTag = variant ? variant : 'p';

    return (<TextTag className={className}>
        {content}
    </TextTag>)
};

export default TextViewComponent;
