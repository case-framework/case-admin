import React from 'react';
import { ItemComponent } from 'survey-engine/data_types';
import { getClassName } from '../utils';
import clsx from 'clsx';
import { renderContent } from '../renderUtils';

interface WarningComponentProps {
    compDef: ItemComponent;
}

const WarningComponent: React.FC<WarningComponentProps> = (props) => {
    return (
        <p
            className={
                clsx(
                    "m-0",
                    "font-bold text-(--survey-warning-text-color)",
                    'px-(--survey-card-px-sm) @md:px-(--survey-card-px)',
                    getClassName(props.compDef.style),
                )
            }>
            {renderContent(props.compDef, 'content')}
        </p>
    );
};

export default WarningComponent;
