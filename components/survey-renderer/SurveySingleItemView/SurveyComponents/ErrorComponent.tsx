import React from 'react';
import { ItemComponent } from 'survey-engine/data_types';
import { getClassName } from '../utils';
import clsx from 'clsx';
import { renderContent } from '../renderUtils';

interface ErrorComponentProps {
    compDef: ItemComponent;
}

const ErrorComponent: React.FC<ErrorComponentProps> = (props) => {
    return (
        <p
            className={
                clsx(
                    "m-0",
                    "font-bold text-(--survey-error-text-color)",
                    'px-(--survey-card-px-sm) @md:px-(--survey-card-px)',
                    getClassName(props.compDef.style),
                )
            }
            role="alert"
        >
            {renderContent(props.compDef, 'content')}
        </p>
    );
};

export default ErrorComponent;
