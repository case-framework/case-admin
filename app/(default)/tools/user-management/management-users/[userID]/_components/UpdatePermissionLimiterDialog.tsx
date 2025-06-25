import { updatePermissionLimiterForManagementUser } from '@/actions/user-management/permissions';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { permissionInfos } from './AddPermissionDialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LoadingButton from '@/components/loading-button';
import { Badge } from '@/components/ui/badge';
import { ManagementUserPermission } from '@/lib/data/userManagementAPI';


interface UpdatePermissionLimiterDialogProps {
    userID: string;
    permission: ManagementUserPermission;
    children: React.ReactNode;
}

const formSchema = z.object({
    limiter: z.string().refine((value) => {
        if (value === "") {
            return true
        }
        try {
            JSON.parse(value);
            return true;
        } catch (error: unknown) {
            console.error(error);
            return false;
        }
    })
})

const UpdatePermissionLimiterDialog: React.FC<UpdatePermissionLimiterDialogProps> = (props) => {
    const dialogCloseRef = React.useRef<HTMLButtonElement>(null);

    const [isPending, startTransition] = useTransition();

    const [error, setError] = React.useState<string | undefined>(undefined)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            limiter: JSON.stringify(props.permission.limiter, null, 1)
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setError(undefined)
        startTransition(async () => {
            const resp = await updatePermissionLimiterForManagementUser(
                props.userID,
                props.permission.id,
                values.limiter === "" ? undefined : JSON.parse(values.limiter)
            )
            if (resp.error) {
                setError(resp.error)
                return
            }

            toast.success('Permission limiter updated')

            if (dialogCloseRef.current) {
                dialogCloseRef.current.click()
            }
        })
    }


    const limiterFormField = () => {
        let hint = '';
        let canEdit = true;
        const resourceType = props.permission.resourceType;
        if (resourceType === 'study') {
            hint = permissionInfos.study.resources["*"].actions[props.permission.action].limiterHint || '';
            canEdit = permissionInfos.study.resources["*"].actions[props.permission.action].hideLimiter !== true;
        } else {
            hint = permissionInfos[resourceType].resources[props.permission.resourceKey].actions[props.permission.action].limiterHint || '';
            canEdit = permissionInfos[resourceType].resources[props.permission.resourceKey].actions[props.permission.action].hideLimiter !== true;
        }
        return <FormField
            control={form.control}
            name="limiter"
            render={({ field }) => {
                return <FormItem>
                    <FormLabel>Limiter</FormLabel>
                    <FormControl>
                        <Textarea
                            disabled={!canEdit}
                            placeholder='Resource and action specific limiter'
                            rows={5}
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
                {props.children}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Change Permission Limiter
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}
                        className='space-y-6'
                    >
                        <div>
                            <Badge
                                variant={'outline-solid'}
                            >
                                {props.permission.resourceType}
                            </Badge>
                            <p className='font-bold px-3 mt-1'>{props.permission.resourceKey}</p>
                        </div>

                        <div>
                            <p className='text-sm'>Action:</p>
                            <p className='font-bold'>
                                {props.permission.action}
                            </p>
                        </div>

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
                                Save
                            </LoadingButton>
                        </DialogFooter>
                    </form>

                </Form>

            </DialogContent>
        </Dialog>
    );
};

export default UpdatePermissionLimiterDialog;
