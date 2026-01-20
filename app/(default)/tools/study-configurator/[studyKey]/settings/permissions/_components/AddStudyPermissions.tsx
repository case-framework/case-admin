'use client';

import { getHint, getIfHideLimiter, permissionInfos, permissionSchema } from '@/app/(default)/tools/user-management/management-users/[userID]/_components/AddPermissionDialog';
import { Button } from '@/components/ui/button';
import { PermissionsInfo } from '@/lib/data/studyAPI';
import { Check, ChevronsUpDown, Plus, UserRound } from 'lucide-react';
import React from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import LoadingButton from '@/components/loading-button';
import { toast } from 'sonner';
import { addStudyPermission } from '@/actions/study/permissions';
import getErrorMessage from '@/utils/getErrorMessage';
import { Badge } from '@/components/ui/badge';


interface AddStudyPermissionsProps {
    studyKey: string;
    users: Array<{
        id: string;
        username?: string;
        email?: string;
        imageUrl?: string;
        provider?: string;
    }>;
    permissions?: {
        [key: string]: PermissionsInfo
    }; // to check if exists or not
}

const studyActionInfos = permissionInfos['study'].resources['*'].actions;

const AddStudyPermissions: React.FC<AddStudyPermissionsProps> = (props) => {
    const [editorOpen, setEditorOpen] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();

    const [userSelectionPopoverOpen, setUserSelectionPopoverOpen] = React.useState(false);
    const [actionSelectionPopoverOpen, setActionSelectionPopoverOpen] = React.useState(false);

    const form = useForm<z.infer<typeof permissionSchema>>({
        resolver: zodResolver(permissionSchema),
        defaultValues: {
            subjectId: "",
            resourceType: 'study',
            resourceId: props.studyKey,
            action: "",
            limiter: ""
        },
    })

    function onSubmit(values: z.infer<typeof permissionSchema>) {
        if (props.permissions && props.permissions[values.subjectId] && values.limiter === "") {
            const permission = props.permissions[values.subjectId].permissions.find(p => p.action === values.action);
            if (permission) {
                toast.error('Permission already exists for this user');
                return;
            }
        }


        startTransition(async () => {
            try {
                const resp = await addStudyPermission(
                    props.studyKey,
                    values.subjectId,
                    values.action,
                    values.limiter === "" ? undefined : JSON.parse(values.limiter),
                )
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }

                toast.success('Permission added successfully');
                form.reset()
                setEditorOpen(false)
            } catch (error: unknown) {
                toast.error('Failed to add permission', { description: getErrorMessage(error) });
            }
        });
    }

    if (!editorOpen) {
        return (
            <Button
                className='mt-6'
                onClick={() => setEditorOpen(true)}
            >
                <Plus className='size-4 me-2' />
                Add a new permission
            </Button>
        );
    }

    const userSelectionField = () => <FormField
        control={form.control}
        name="subjectId"
        render={({ field }) => (
            <FormItem className="flex flex-col">
                <FormLabel>User</FormLabel>
                <Popover
                    open={userSelectionPopoverOpen}
                    onOpenChange={setUserSelectionPopoverOpen}
                >
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "w-96 justify-between",
                                    !field.value && "text-muted-foreground"
                                )}
                            >
                                {field.value
                                    ? props.users.find(
                                        (user) => user.id === field.value
                                    )?.username
                                    : "Select a user"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-96 p-0" align='start'>
                        <Command>
                            <CommandInput placeholder="Search for user..." />
                            <CommandList>
                                <CommandEmpty>No users found.</CommandEmpty>
                                <CommandGroup className='max-h-64 overflow-y-scroll'>
                                    {props.users.map((user) => (
                                        <CommandItem
                                            value={user.id}
                                            key={user.id}
                                            className='w-full flex'
                                            onSelect={() => {
                                                form.setValue("subjectId", user.id)
                                                form.clearErrors("subjectId")
                                                setUserSelectionPopoverOpen(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    user.id === field.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            <div className='flex items-center gap-3 grow'>
                                                <div className='grow'>
                                                    <p className='flex items-center gap-2'>
                                                        <span>
                                                            {user.username}
                                                        </span>
                                                        {user.provider ? <Badge variant={"outline"}>{user.provider}</Badge> : null}
                                                    </p>
                                                    <p className='text-xs'>
                                                        {user.email}
                                                    </p>
                                                </div>

                                                <div>
                                                    <Avatar className='size-7'>
                                                        <AvatarImage src={user.imageUrl || ""} />
                                                        <AvatarFallback className="bg-slate-400">
                                                            <UserRound className='text-white size-5' />
                                                        </AvatarFallback>
                                                    </Avatar>
                                                </div>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <FormDescription>
                    The user to whom the permission will be granted.
                </FormDescription>
                <FormMessage />
            </FormItem >
        )}
    />

    const actionSelection = () => <FormField
        control={form.control}
        name="action"
        render={({ field }) => (
            <FormItem className="flex flex-col">
                <FormLabel>Action</FormLabel>
                <Popover
                    open={actionSelectionPopoverOpen}
                    onOpenChange={setActionSelectionPopoverOpen}
                >
                    <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                    "w-72 justify-between",
                                    !field.value && "text-muted-foreground"
                                )}
                            >
                                {field.value
                                    ? field.value
                                    : "Select an action"}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-0"
                        align='start'
                    >
                        <Command>
                            <CommandInput placeholder="Search for action..." />
                            <CommandList>
                                <CommandEmpty>No actions found.</CommandEmpty>
                                <CommandGroup className='max-h-64 overflow-y-scroll'>
                                    {Object.keys(studyActionInfos).map((action) => (

                                        <CommandItem
                                            value={action}
                                            key={action}
                                            onSelect={() => {
                                                form.setValue("action", action)
                                                form.clearErrors("action")
                                                setActionSelectionPopoverOpen(false)
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    action === field.value
                                                        ? "opacity-100"
                                                        : "opacity-0"
                                                )}
                                            />
                                            <p>
                                                {action}
                                            </p>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
                <FormDescription className="max-w-72">
                    Allow this action to be performed on the study. Use <code className="px-1 py-0.5 bg-muted rounded">*</code> to allow all actions.
                </FormDescription>
                <FormMessage />
            </FormItem >
        )}
    />

    const limiterFormField = () => {

        if (form.getValues('action') === "") {
            return null;
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
        <div className='mt-6 p-4 border rounded-md bg-slate-50'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-4'
                >
                    <h3 className='font-bold'>
                        Add a new permission
                    </h3>
                    {userSelectionField()}
                    {actionSelection()}
                    {limiterFormField()}

                    <div className='gap-3 flex'>
                        <Button
                            type='button'
                            variant='outline'
                            onClick={() => {
                                form.reset()
                                setEditorOpen(false)
                            }}
                        >
                            Cancel
                        </Button>

                        <LoadingButton
                            isLoading={isPending}
                            type='submit'
                        >
                            Add permission
                        </LoadingButton>
                    </div>

                </form>
            </Form>
        </div>

    );
};

export default AddStudyPermissions;
