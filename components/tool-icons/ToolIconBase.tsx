import clsx from 'clsx';
import React from 'react';


interface ToolIconBaseProps {
    size: 'md' | 'lg';
    color?: string;
    icon: React.ReactNode;
}

const ToolIconBase: React.FC<ToolIconBaseProps> = (props) => {
    return (
        <div
            className={clsx(
                'shadow-xs rounded-md flex items-center justify-center text-center',
                props.color,
                {
                    'size-8 text-lg': props.size === 'md',
                    'size-14 text-3xl': props.size === 'lg'
                }
            )}        >
            {props.icon}
        </div>
    );
};

export default ToolIconBase;
