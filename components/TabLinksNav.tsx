'use client';

import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface TabLinksNavProps {
    className?: string;
    links: Array<{
        title: string | React.ReactNode;
        href: string;
        exact?: boolean;
    }>
}

const TabLinksNav: React.FC<TabLinksNavProps> = (props) => {
    const pathname = usePathname();

    return (
        <nav className='flex'>
            <Card
                variant={"opaque"}
                className={cn('p-1', props.className)}
            >
                <ul className='flex gap-1'>
                    {
                        props.links.map((link, index) => (
                            <TabNavLink
                                key={index}
                                href={link.href}
                                label={link.title}
                                isActive={link.exact ? pathname === link.href : pathname.startsWith(link.href)}
                            />
                        ))
                    }
                </ul>

            </Card>
        </nav>
    );
};

export default TabLinksNav;

interface TabNavLinkProps {
    href: string;
    label: string | React.ReactNode;
    isActive?: boolean;
}

export const TabNavLink: React.FC<TabNavLinkProps> = (props) => {
    return (
        <li>
            <Button asChild
                variant={props.isActive ? 'outline-solid' : 'link'}
                className={cn('font-semibold h-9',
                    {
                        'underline font-bold': props.isActive,
                    }
                )}
            >
                <Link
                    href={props.href}
                    prefetch={false}
                >
                    {props.label}
                </Link>
            </Button>
        </li>
    );
};
