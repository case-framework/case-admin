import { Button } from '@nextui-org/button';
import clsx from 'clsx';
import React from 'react';

interface SidebarItemProps {
    children?: React.ReactNode;
    className?: string;
    tooltip?: string;
    as?: any;
    href?: string;
    onPress?: () => void;
    isActive?: boolean;
    isDisabled?: boolean;
}



export const SidebarItem: React.FC<SidebarItemProps> = (props) => {
    return (
        <li className={clsx(
            'relative group flex',
            props.className,

        )}>
            <div className={clsx(
                'w-full h-full flex items-center justify-center  p-unit-1',
                {
                    'bg-default-200': props.isActive,
                }
            )}

            >
                <div className={clsx('absolute bg-primary h-full w-[5px] left-0 top-0',
                    {
                        'hidden': !props.isActive,
                    }
                )}></div>
                <Button
                    type='button'
                    className={clsx(
                        'w-12 h-12 text-2xl rounded-full hover:rounded-medium transition-all duration-200',
                        {
                            'rounded-medium': props.isActive,
                        }
                    )}
                    variant='light'
                    isIconOnly
                    as={props.as}
                    href={props.href}
                    onPress={props.onPress}
                    isDisabled={props.isDisabled}
                >
                    {props.children}
                </Button>
            </div>
            {props.tooltip &&
                <div className={clsx('absolute w-auto p-unit-2 m-unit-2 min-w-max left-14 rounded-small shadow-small text-small font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100',
                    'bg-content1 z-50 h-10'
                )}>
                    {props.tooltip}
                </div>
            }
        </li>
    );
}


interface SidebarProps {
    children?: React.ReactNode;
    className?: string;
}

export const Sidebar: React.FC<SidebarProps> = (props) => {
    return (
        <nav className={clsx(
            'h-full border-r border-default-300 z-30 bg-content2',
            props.className
        )}>
            <ul className='flex flex-col h-full items-center z-30'>
                {props.children}
            </ul>
        </nav>
    );
};
