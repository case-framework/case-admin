import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import React from 'react';
import AddPermissionDialog from './AddPermissionDialog';
import { Skeleton } from '@/components/ui/skeleton';
import PermissionActions from './PermissionActions';
import { Badge } from '@/components/ui/badge';
import { ManagementUserPermission, getPermissions } from '@/lib/data/userManagementAPI';


interface PermissionsProps {
    userId: string;
}

const CardWrapper: React.FC<{
    children: React.ReactNode;
}> = (props) => {
    return (
        <Card
            variant={"opaque"}
        >
            <TooltipProvider>
                <CardHeader>
                    <h2 className='text-lg font-bold flex items-center'>
                        Permissions
                        <Tooltip
                            delayDuration={0}
                        >
                            <TooltipTrigger>
                                <HelpCircle className='size-4 ms-2' />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>
                                    Admin users have full access to the system and do not need to be granted permissions.
                                </p>
                            </TooltipContent>
                        </Tooltip>
                    </h2>
                </CardHeader>
                <CardContent>
                    {props.children}
                </CardContent>
            </TooltipProvider>
        </Card>
    );
}



const Permissions: React.FC<PermissionsProps> = async (props) => {
    const resp = await getPermissions(props.userId);

    const permissions = resp.permissions;
    const error = resp.error;
    if (error) {
        return (
            <CardWrapper>
                <div className='px-6 py-3 bg-red-100 rounded-md text-red-700'>
                    <h3 className='font-bold'>Unexpected error: </h3>
                    {error}
                </div>
            </CardWrapper>
        );
    }

    if (!permissions || permissions.length === 0) {
        return (
            <CardWrapper>
                <div className='py-3 text-center bg-n-100 rounded-md text-neutral-600'>
                    <h3 className='font-bold'>No permissions added</h3>
                </div>

                <AddPermissionDialog
                    userId={props.userId}
                />
            </CardWrapper>
        );
    }


    return (
        <CardWrapper>
            <Table className='bg-white rounded-lg overflow-hidden'>
                <TableHeader>
                    <TableRow className='bg-slate-50'>
                        <TableHead>Resource</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Limiter</TableHead>
                        <TableHead className='text-end'></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {permissions.map((permission: ManagementUserPermission) => (
                        <TableRow key={permission.id}>
                            <TableCell className=''>
                                <Badge
                                    variant={'outline-solid'}
                                >
                                    {permission.resourceType}
                                </Badge>
                                <p className='font-bold px-3 mt-1'>{permission.resourceKey}</p>

                            </TableCell>

                            <TableCell>
                                {permission.action}
                            </TableCell>
                            <TableCell
                                className='text-xs font-mono'
                            >
                                {JSON.stringify(permission.limiter, null, 1)}
                            </TableCell>
                            <TableCell>
                                <PermissionActions
                                    userId={props.userId}
                                    permission={permission}
                                    userType='management-user'
                                />
                            </TableCell>
                        </TableRow>
                    ))}

                </TableBody>
            </Table>

            <AddPermissionDialog
                userId={props.userId}
                userType='management-user'
            />
        </CardWrapper >
    );
};

export default Permissions;

export const PermissionsSkeleton: React.FC = () => {
    return (
        <CardWrapper>
            <div className='space-y-2'>
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
                <Skeleton className='h-10 w-full' />
            </div>


            <Skeleton className='h-10 w-40 mt-6' />
        </CardWrapper>
    );
}
