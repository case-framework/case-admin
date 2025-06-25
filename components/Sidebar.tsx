import clsx from 'clsx';
import React from 'react';
import { Button } from './ui/button';
import Link from 'next/link';


interface SidebarLinkItemProps {
    children?: React.ReactNode;
    className?: string;
    tooltip?: string;
    href: string;
    isActive?: boolean;
    isDisabled?: boolean;
}

export const SidebarLinkItem: React.FC<SidebarLinkItemProps> = ({
    href,
    ...props
}) => {
    return (
        <SidebarItem
            {...props}
        >
            <Link
                href={href}
                prefetch={false}
            >
                {props.children}
            </Link>
        </SidebarItem>
    );
}


interface SidebarItemProps {
    children?: React.ReactNode;
    className?: string;
    tooltip?: string;
    onClick?: () => void;
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
                'w-full h-full flex items-center justify-center  p-1',
                {
                    'bg-slate-200': props.isActive,
                }
            )}

            >
                <div className={clsx('absolute bg-cyan-800 h-full w-[5px] left-0 top-0',
                    {
                        'hidden': !props.isActive,
                    }
                )}></div>
                <Button
                    type='button'
                    className={clsx(
                        'w-12 h-12 text-2xl rounded-full hover:rounded-md transition-all duration-200 [&_svg]:size-5',
                        {
                            'rounded-md': props.isActive,
                        }
                    )}
                    variant='ghost'
                    size={'icon'}
                    asChild
                    onClick={props.onClick}
                    disabled={props.isDisabled}
                >

                    {props.children}
                </Button>
            </div>
            {props.tooltip &&
                <div className={clsx('absolute w-auto px-3 py-1 m-2 min-w-max left-14 rounded-sm shadow-xs text-sm font-bold transition-all duration-100 scale-0 origin-left group-hover:scale-100',
                    'bg-slate-100 z-50 h-10 flex items-center'
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
            'h-full border-r border-black/20 z-30 bg-white',
            props.className
        )}>
            <ul className='flex flex-col h-full items-center z-30'>
                {props.children}
            </ul>
        </nav>
    );
};
