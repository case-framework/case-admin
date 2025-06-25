'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, Cog, FolderCogIcon, ListIcon, LucideIcon, Users } from 'lucide-react';
import { usePathname } from 'next/navigation';
import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

interface SettingsNavProps {
    studyKey: string;
}



const SettingsNav: React.FC<SettingsNavProps> = (props) => {
    const pathname = usePathname();

    const settingsNavLinks = [
        {
            title: 'General',
            href: `/tools/study-configurator/${props.studyKey}/settings`,
            icon: Cog,
        },
        {
            title: 'Code lists',
            href: `/tools/study-configurator/${props.studyKey}/settings/code-lists`,
            icon: ListIcon,
        },
        {
            title: 'Notifications',
            href: `/tools/study-configurator/${props.studyKey}/settings/notifications`,
            icon: Bell,
        },
        {
            title: 'Access Control',
            href: `/tools/study-configurator/${props.studyKey}/settings/permissions`,
            icon: Users,
        },
        {
            title: 'Import / Export',
            href: `/tools/study-configurator/${props.studyKey}/settings/import-export`,
            icon: FolderCogIcon,
        },
        {
            title: 'Advanced',
            href: `/tools/study-configurator/${props.studyKey}/settings/danger-zone`,
            icon: AlertTriangle,
        }

    ];

    return (
        <Card
            variant={"opaque"}
            className='p-1 bg-neutral-50 min-w-44 h-full'
        >
            <h3 className='text-lg font-bold px-2 pt-1 mb-2'>Settings</h3>
            <Separator />
            <nav className='w-full pt-2'>
                <ul className='w-full space-y-1'>
                    {settingsNavLinks.map((link, index) => (
                        <NavLink
                            key={index}
                            href={link.href}
                            label={link.title}
                            isActive={pathname === link.href}
                            icon={link.icon}
                        />
                    ))}
                </ul>
            </nav>
        </Card>
    );
};

export default SettingsNav;

interface NavLinkProps {
    href: string;
    label: string;
    icon: LucideIcon;
    isActive?: boolean;
}

export const NavLink: React.FC<NavLinkProps> = (props) => {
    return (
        <li>
            <Button
                asChild
                variant={props.isActive ? 'outline-solid' : 'link'}
                className={cn('font-semibold h-9 w-full justify-start',
                    {
                        'underline font-bold': props.isActive,
                    }
                )}

            >
                <Link href={
                    props.href
                } prefetch={false}
                >
                    <div className='flex gap-2 items-center'>
                        <div>
                            <props.icon className="text-neutral-500 size-5" />
                        </div>
                        {props.label}
                    </div>
                </Link>
            </Button>
        </li >
    );
}
