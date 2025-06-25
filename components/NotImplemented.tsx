import React from 'react';
import clsx from 'clsx';

interface NotImplementedProps {
    children?: React.ReactNode;
    className?: string;
}

const NotImplemented: React.FC<NotImplementedProps> = (props) => {
    return (
        <div className={clsx(
            'bg-amber-50 py-4 px-6 rounded bg-repeat bg-size-[150px_150px] bg-[url(/images/floating-cogs.svg)]',
            props.className
        )}>
            <h3 className='text-sm font-light'>This feature is not implemented yet</h3>
            {props.children}
        </div>
    );
};

export default NotImplemented;
