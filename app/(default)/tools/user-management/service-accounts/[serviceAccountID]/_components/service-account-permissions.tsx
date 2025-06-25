'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ManagementUserPermission } from '@/lib/data/userManagementAPI';
import React from 'react';
import AddPermissionDialog from '../../../management-users/[userID]/_components/AddPermissionDialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import PermissionActions from '../../../management-users/[userID]/_components/PermissionActions';

interface ServiceAccountPermissionsProps {
    serviceAccountID: string;
    error?: string;
    permissions?: ManagementUserPermission[];
}

const ServiceAccountPermissions: React.FC<ServiceAccountPermissionsProps> = (props) => {

    const hasPermissions = props.permissions && props.permissions.length > 0;

    return (
        <Card
            variant={"opaque"}
        >
            <CardHeader>
                <CardTitle>
                    Service Account Permissions
                </CardTitle>
            </CardHeader>
            <CardContent>
                {props.error && <p className='text-red-600'>{props.error}</p>}

                {(!props.error && !props.permissions) && <p className='text-center font-bold'>This service account has no permissions.</p>}

                {hasPermissions && <Table className='bg-white rounded-lg overflow-hidden'>
                    <TableHeader>
                        <TableRow className='bg-slate-50'>
                            <TableHead>Resource</TableHead>
                            <TableHead>Action</TableHead>
                            <TableHead>Limiter</TableHead>
                            <TableHead className='text-end'></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {props.permissions?.map((permission: ManagementUserPermission) => (
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
                                        userId={props.serviceAccountID}
                                        permission={permission}
                                        userType='service-account'
                                    />
                                </TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>}

                <AddPermissionDialog
                    userId={props.serviceAccountID}
                    userType='service-account'
                />

            </CardContent>

        </Card>
    );
};

export default ServiceAccountPermissions;
