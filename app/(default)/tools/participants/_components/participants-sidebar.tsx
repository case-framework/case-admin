'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarGroup, SidebarContent, SidebarGroupLabel, SidebarGroupContent, SidebarHeader, SidebarFooter, SidebarSeparator, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { User } from 'next-auth';
import { ChevronsUpDown, ClipboardListIcon, FileIcon, HomeIcon, Layers2Icon, SquareArrowRightIcon, TableIcon, UserRound, UsersRoundIcon } from 'lucide-react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { logout } from '@/actions/auth/logout';

interface ParticipantsSidebarProps {
    user?: User;
    expires?: number;
}



const ParticipantsSidebar: React.FC<ParticipantsSidebarProps> = (props) => {
    const params = useParams();
    const pathname = usePathname();
    const [remainingTime, setRemainingTime] = useState<string | null>(null);

    useEffect(() => {
        if (props.expires !== null) {
            const expirationTime = props.expires;
            const interval = setInterval(async () => {
                if (!expirationTime) return;

                const now = (new Date()).getTime() / 1000;
                const timeDifference = expirationTime - now;
                if (timeDifference > 0) {
                    const hours = Math.floor((timeDifference % (60 * 60 * 24)) / (60 * 60));
                    const minutes = Math.floor((timeDifference % (60 * 60)) / 60);
                    const seconds = Math.floor((timeDifference % 60));
                    setRemainingTime(`${hours}h ${minutes}m ${seconds}s`);
                } else {
                    setRemainingTime('Session expired');
                    const redirectTo = `/auth/login?callback=${pathname}&auto-login=false`;
                    await logout(redirectTo);
                    clearInterval(interval);
                }
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [props.expires, pathname]);

    if (!props.user) return null;

    const menuItems = [
        {
            icon: <UsersRoundIcon />,
            title: 'Participants',
            href: `/tools/participants/${params.studyKey}/participants`,
        },
        {
            icon: <TableIcon />,
            title: 'Responses',
            href: `/tools/participants/${params.studyKey}/responses`,
        },
        {
            icon: <Layers2Icon />,
            title: 'Reports',
            href: `/tools/participants/${params.studyKey}/reports`,
        },
        {
            icon: <FileIcon />,
            title: 'Files',
            href: `/tools/participants/${params.studyKey}/files`,
        },
        {
            icon: <SquareArrowRightIcon />,
            title: 'Actions',
            href: `/tools/participants/${params.studyKey}/actions`,
        }
    ]

    const appName = process.env.NEXT_PUBLIC_APP_NAME || 'Editor Tools';

    const disableNavs = params.studyKey === undefined;

    return (
        <Sidebar
            variant='sidebar'
            side='left'
            collapsible='icon'
        >
            <SidebarHeader>
                <div className='flex items-center gap-2 justify-start group-data-[collapsible=icon]:px-0 px-2'>
                    <div
                        className={cn(
                            'shadow-xs rounded-md flex items-center justify-center text-center',
                            'bg-linear-to-b from-orange-400 to-orange-600 text-white',
                            'group-data-[collapsible=icon]:p-1 p-2'
                        )}>
                        <ClipboardListIcon
                            className='group-data-[collapsible=icon]:size-6 size-7'
                        />
                    </div>
                    <div className='group-data-[collapsible=icon]:hidden'>
                        <p className="font-bold text-cyan-800">
                            Participants
                        </p>
                        <span className='font-semibold tracking-wider text-xs'>{appName}</span>
                    </div>
                </div>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        Modules
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((project) => (
                                <SidebarMenuItem key={project.href}                                >
                                    <SidebarMenuButton
                                        asChild
                                        tooltip={project.title}
                                        isActive={pathname.startsWith(project.href)}
                                        disabled={disableNavs}
                                        className='data-[active=true]:border border-border'

                                    >
                                        <Link
                                            href={disableNavs ? "/tools/participants" : project.href}
                                        >
                                            {project.icon}
                                            <span>{project.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>

                    </SidebarGroupContent>

                </SidebarGroup>
            </SidebarContent>
            <SidebarSeparator />

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage src={props.user?.image || ""} />
                                        <AvatarFallback className="bg-slate-500">
                                            <UserRound className='text-white size-6' />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <p className='max-w-[156px] truncate text-start text-sm'>
                                            {props.user?.name}
                                        </p>
                                        {remainingTime && (<p className='text-start text-xs text-neutral-500 min-h-4'>
                                            {remainingTime}
                                        </p>)}
                                        {!remainingTime && <Skeleton className='h-4 w-20' />}
                                    </div>
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                                side="right"
                                align="end"
                                sideOffset={10}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage src={props.user?.image || ""} />
                                            <AvatarFallback className="bg-slate-500">
                                                <UserRound className='text-white size-6' />
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <p className='max-w-[156px] truncate text-start text-sm'>
                                                {props.user?.name}
                                            </p>
                                            {remainingTime && (<p className='text-start text-xs text-neutral-500 min-h-4'>
                                                {remainingTime}
                                            </p>)}
                                            {!remainingTime && <Skeleton className='h-4 w-20' />}
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    asChild
                                >
                                    <Link
                                        href={'/'}
                                        className='flex gap-2 items-center'
                                    >
                                        <HomeIcon className='size-4 text-neutral-500' />
                                        Exit tool
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
};

export default ParticipantsSidebar;
