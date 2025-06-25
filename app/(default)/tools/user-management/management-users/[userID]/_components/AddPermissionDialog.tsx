'use client';

import React, { useTransition } from 'react';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { createPermissionForManagementUser } from '@/actions/user-management/permissions';
import { toast } from 'sonner';
import { createPermissionForServiceAccount } from '@/lib/data/service-accounts';



interface ResourcePermission {
    actions: {
        [key: string]: {
            hideLimiter?: boolean;
            limiterHint?: string;
        };
    };
};

interface PermissionInfos {
    [key: string]: {
        resources: {
            [key: string]: ResourcePermission
        };
    };
}

export const permissionInfos: PermissionInfos = {
    "messaging": {
        resources: {
            "global-email-templates": {
                actions: {
                    "*": {
                        hideLimiter: true,
                    }
                }
            },
            "study-email-templates": {
                actions: {
                    "*": {
                        hideLimiter: true,
                    }
                }
            },
            "scheduled-emails": {
                actions: {
                    "*": {
                        hideLimiter: true,
                    }
                }
            },
            "sms-templates": {
                actions: {
                    "*": {
                        hideLimiter: true,
                    }
                }
            }
        }
    },
    "study": {
        resources: {
            "*": {
                actions: {
                    "*": { hideLimiter: true },
                    "create-study": { hideLimiter: true },
                    "manage-study-permissions": { hideLimiter: true },
                    "read-study-config": { hideLimiter: true },
                    "update-study-props": { hideLimiter: true },
                    "update-study-status": { hideLimiter: true },
                    "manage-study-code-lists": { hideLimiter: true },
                    "delete-study": { hideLimiter: true },
                    "create-survey": { hideLimiter: true },
                    "update-survey": {
                        limiterHint: 'To specify which surveys the user can upload, use the format [{"surveyKey": "<sk1>"}]'
                    },
                    "unpublish-survey": {
                        limiterHint: 'To specify which surveys the user can unpublish, use the format [{"surveyKey": "<sk1>"}]'
                    },
                    "delete-survey-version": {
                        limiterHint: 'To specify which surveys the user can delete, use the format [{"surveyKey": "<sk1>"}]'
                    },
                    "update-study-rules": { hideLimiter: true },
                    "run-study-action": { hideLimiter: true },
                    "update-notification-subscriptions": { hideLimiter: true },
                    "get-responses": {
                        limiterHint: 'To specify which responses the user can access, use the format [{"surveyKey": "<sk1>"}]'
                    },
                    "delete-responses": { hideLimiter: true },
                    "get-confidential-responses": { hideLimiter: true },
                    "get-files": { hideLimiter: true },
                    "get-participant-states": { hideLimiter: true },
                    "get-reports": {
                        limiterHint: 'To specify which reports the user can access, use the format [{"reportKey": "<rk1>"}]'
                    },
                    "delete-reports": { hideLimiter: true },
                }
            }
        }
    },
    "users": {
        resources: {
            "*": {
                actions: {
                    "delete-users": { hideLimiter: true },
                }
            }
        }
    }
}

export const getIfHideLimiter = (resourceType: string, resourceId: string, action: string) => {
    if (resourceType === "study") {
        return permissionInfos[resourceType].resources["*"].actions[action].hideLimiter;
    }
    return permissionInfos[resourceType].resources[resourceId].actions[action].hideLimiter;
}

export const getHint = (resourceType: string, resourceId: string, action: string) => {
    if (resourceType === "study") {
        return permissionInfos[resourceType].resources["*"].actions[action].limiterHint;
    }
    return permissionInfos[resourceType].resources[resourceId].actions[action].limiterHint;
}


export const permissionSchema = z.object({
    subjectId: z.string().min(1),
    resourceType: z.enum(["study", "messaging", "users"]),
    resourceId: z.string().min(1).trim(),
    action: z.string().min(1),
    limiter: z.string().refine((value) => {
        if (value === "") {
            return true
        }
        try {
            JSON.parse(value);
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    })
})

interface AddPermissionDialogProps {
    userId: string;
    userType?: 'service-account' | 'management-user';
}


const AddPermissionDialog: React.FC<AddPermissionDialogProps> = (props) => {
    const dialogCloseRef = React.useRef<HTMLButtonElement>(null);

    const [isPending, startTransition] = useTransition();
    const [resourceIdList, setResourceIdList] = React.useState<string[] | undefined>(undefined)
    const [selectedResourcePermissionInfo, setSelectedResourcePermissionInfo] = React.useState<ResourcePermission | undefined>(undefined)
    const [error, setError] = React.useState<string | undefined>(undefined)

    const form = useForm<z.infer<typeof permissionSchema>>({
        resolver: zodResolver(permissionSchema),
        defaultValues: {
            subjectId: props.userId,
            resourceType: undefined,
            resourceId: "",
            action: "",
            limiter: ""
        },
    })

    function onSubmit(values: z.infer<typeof permissionSchema>) {
        setError(undefined)
        startTransition(async () => {
            if (props.userType === 'service-account') {
                const resp = await createPermissionForServiceAccount(
                    props.userId,
                    values.resourceType,
                    values.resourceId,
                    values.action,
                    values.limiter === "" ? undefined : JSON.parse(values.limiter),
                )
                if (resp.error) {
                    setError(resp.error)
                    return
                }
                toast.success('Permission added successfully');
                dialogCloseRef.current?.click();
                return;
            } else {
                const resp = await createPermissionForManagementUser(
                    props.userId,
                    values.resourceType,
                    values.resourceId,
                    values.action,
                    values.limiter === "" ? undefined : JSON.parse(values.limiter),
                )
                if (resp.error) {
                    setError(resp.error)
                    return
                }

                toast('Permission added')
            }

            if (dialogCloseRef.current) {
                dialogCloseRef.current.click()
            }
        })
    }


    const resourceIdFormField = () => {
        if (resourceIdList === undefined) {
            return (<div>
                <p className='text-sm mb-1.5'>Resource Key</p>
                <p className='text-sm px-3 py-2 text-neutral-400 border rounded-md -'>
                    Select a resource type first
                </p>
            </div>)
        }

        if (resourceIdList.length === 0) {
            return (<FormField
                control={form.control}
                name="resourceId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Resource Key</FormLabel>
                        <FormControl>
                            <Input placeholder='Study key'
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                            Specify the study key or * for all studies.
                        </FormDescription>
                    </FormItem>
                )}
            />)
        }

        return (
            <FormField
                control={form.control}
                name="resourceId"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel
                            htmlFor={field.name}
                        >Resource ID</FormLabel>
                        <FormControl>
                            <Select
                                name={field.name}
                                onValueChange={(value) => {
                                    form.resetField('limiter')
                                    form.resetField('action')
                                    if (form.getValues('resourceType') !== 'study') {
                                        setSelectedResourcePermissionInfo(permissionInfos[form.getValues('resourceType')].resources[value])
                                    }
                                    field.onChange(value)
                                }} value={field.value}>
                                <SelectTrigger
                                    id={field.name}
                                >
                                    <SelectValue placeholder="Select a resource ID" />
                                </SelectTrigger>
                                <SelectContent>
                                    {resourceIdList.map((id) => (
                                        <SelectItem key={id} value={id}>{id}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        )

    }

    const actionFormField = () => {
        if (form.getValues('resourceId') === "" || !selectedResourcePermissionInfo) {
            return (<div>
                <p className='text-sm mb-1.5'>Action</p>
                <p className='text-sm px-3 py-2 text-neutral-400 border rounded-md -'>
                    Select a resource first
                </p>
            </div>)
        }
        const actionList = selectedResourcePermissionInfo ? Object.keys(selectedResourcePermissionInfo.actions) : []

        return (
            <FormField
                control={form.control}
                name="action"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel
                            htmlFor={field.name}
                        >Action</FormLabel>
                        <FormControl>
                            <Select onValueChange={(value) => {
                                form.resetField('limiter')
                                field.onChange(value)
                            }} value={field.value}>
                                <SelectTrigger
                                    id={field.name}
                                >
                                    <SelectValue placeholder="Select an action" />
                                </SelectTrigger>
                                <SelectContent className='max-h-80'>
                                    {actionList.map((action) => (
                                        <SelectItem key={action} value={action}>{action}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        )
    }


    const limiterFormField = () => {

        if (form.getValues('action') === "") {
            return (<div>
                <p className='text-sm mb-1.5'>Limiter</p>
                <p className='text-sm px-3 py-2 text-neutral-400 border rounded-md -'>
                    Select an action first
                </p>
            </div>)
        }

        const hint = getHint(form.getValues('resourceType'), form.getValues('resourceId'), form.getValues('action'));
        const hideLimiter = getIfHideLimiter(form.getValues('resourceType'), form.getValues('resourceId'), form.getValues('action'));

        if (hideLimiter) {
            return null
        }

        return <FormField
            control={form.control}
            name="limiter"
            render={({ field }) => {
                return <FormItem>
                    <FormLabel>Limiter</FormLabel>
                    <FormControl>
                        <Textarea
                            placeholder='Resource and action specific limiter'
                            {...field}
                        />
                    </FormControl>
                    <FormDescription>
                        {hint}
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            }}
        />
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className='mt-6'
                    variant={'outline-solid'}
                >
                    <Plus className='size-4 me-2' />
                    Add Permission
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add Permission
                    </DialogTitle>
                    <DialogDescription>
                        Fill out the form to add a new permission to this user.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-6'
                    >
                        <FormField
                            control={form.control}
                            name="resourceType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        htmlFor={field.name}
                                    >Resource Type</FormLabel>
                                    <FormControl>
                                        <Select

                                            name={field.name}
                                            onValueChange={(value) => {
                                                if (value === 'study') {
                                                    setResourceIdList([])
                                                    setSelectedResourcePermissionInfo(permissionInfos.study.resources["*"])
                                                } else if (value === 'messaging') {
                                                    setResourceIdList(
                                                        Object.keys(permissionInfos.messaging.resources)
                                                    )
                                                    setSelectedResourcePermissionInfo(undefined)
                                                } else if (value === 'users') {
                                                    setResourceIdList(
                                                        Object.keys(permissionInfos.users.resources)
                                                    )
                                                    setSelectedResourcePermissionInfo(permissionInfos.users.resources["*"])
                                                }
                                                form.resetField('resourceId')
                                                form.resetField('limiter')
                                                form.resetField('action')
                                                field.onChange(value)
                                            }} value={field.value}>
                                            <SelectTrigger id={field.name}>
                                                <SelectValue placeholder="Select a resource type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="study">Study</SelectItem>
                                                <SelectItem value="messaging">Messaging</SelectItem>
                                                <SelectItem value="users">Participant Users</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />


                        {resourceIdFormField()}

                        {actionFormField()}

                        {limiterFormField()}

                        {error && <p
                            role='alert'
                            className='text-red-600 text-sm font-bold'
                        >
                            {error}
                        </p>}


                        <DialogFooter>
                            <DialogClose
                                // className='hidden'
                                ref={dialogCloseRef}
                                asChild
                            >
                                <Button
                                    variant={'outline-solid'}
                                    type='button'
                                >
                                    Cancel
                                </Button>
                            </DialogClose>

                            <LoadingButton
                                isLoading={isPending}
                                type='submit'

                            >
                                Add Permission
                            </LoadingButton>
                        </DialogFooter>
                    </form>

                </Form>

            </DialogContent>
        </Dialog>
    );
};

export default AddPermissionDialog;
