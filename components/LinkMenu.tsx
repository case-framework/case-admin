import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface LinkMenuProps {
    children?: React.ReactNode;
    className?: string;
}

interface LinkMenuItemProps {
    href: string;
    children?: React.ReactNode;
}

export const LinkMenu: React.FC<LinkMenuProps> = (props) => {
    return (
        <nav>
            <ul
                className={cn(
                    'divide-y divide-neutral-200 rounded-lg overflow-hidden border drop-shadow-xs',
                    props.className
                )}
            >
                {props.children}
            </ul>
        </nav>
    );
};

export const LinkMenuItem: React.FC<LinkMenuItemProps> = (props) => {
    return (
        <li>
            <Link
                href={props.href}
                prefetch={false}
                className='flex gap-4 items-center px-6 py-4 bg-white hover:bg-gray-100 transition-colors duration-200 ease-in-out cursor-pointer'
            >
                <div className='grow'>
                    {props.children}
                </div>
                <div>
                    <ChevronRight className="text-neutral-500 size-6" />
                </div>
            </Link>
        </li>
    );
}



