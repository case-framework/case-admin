import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import React from 'react';

interface TabNavProps {
    activeTab?: string;
}

interface TabNavLinkProps {
    href: string;
    label: string;
    isActive?: boolean;
}

export const TabNavLink: React.FC<TabNavLinkProps> = (props) => {
    return (
        <li>
            <Button asChild
                variant={props.isActive ? 'outline-solid' : 'link'}
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

const TabNav: React.FC<TabNavProps> = (props) => {
    return (
        <nav className='flex'>
            <Card
                variant={"opaque"}
                className='p-1'
            >
                <ul className='flex gap-1'>
                    <TabNavLink
                        href={'/tools/user-management/participant-users'}
                        label={'Participant Users'}
                        isActive={props.activeTab === 'participant-users'}
                    />
                    <TabNavLink
                        href='/tools/user-management/management-users'
                        label={'Management Users'}
                        isActive={props.activeTab === 'management-users'}
                    />
                    <TabNavLink
                        href={'/tools/user-management/service-accounts'}
                        label={'Service Accounts'}
                        isActive={props.activeTab === 'service-accounts'}
                    />
                </ul>

            </Card>
        </nav>
    );
};

export default TabNav;
