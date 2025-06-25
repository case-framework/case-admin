'use client';
import LoadingButton from '@/components/loading-button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ServiceAccount, updateServiceAccount } from '@/lib/data/service-accounts';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface ServiceAccountInfosProps {
    serviceAccount?: ServiceAccount;
    error?: string;
}

const updateServiceAccountFormSchema = z.object({
    label: z.string().min(2),
    description: z.string().optional(),
})


const ServiceAccountInfos: React.FC<ServiceAccountInfosProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();

    const form = useForm<z.infer<typeof updateServiceAccountFormSchema>>({
        resolver: zodResolver(updateServiceAccountFormSchema),
        defaultValues: {
            label: props.serviceAccount?.label || '',
            description: props.serviceAccount?.description || '',
        },
    })

    function onSubmit(values: z.infer<typeof updateServiceAccountFormSchema>) {
        startTransition(async () => {
            if (!props.serviceAccount) {
                return;
            }
            const resp = await updateServiceAccount(
                props.serviceAccount.id,
                values.label,
                values.description
            );
            if (resp.error) {
                console.error(resp.error);
                toast.error('Failed to update service account');
                return;
            }
            toast.success('Service account updated');
        });
    }

    if (props.error) {
        return (
            <Card
                variant={"opaque"}
            >
                <CardContent>
                    <p className='text-red-600'>
                        {props.error}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card
            variant={"opaque"}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>
                            Service Account Infos
                        </CardTitle>
                    </CardHeader>

                    <CardContent>
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The label of the service account.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Optional description of the service account to help users understand what it is used for.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CardContent>

                    <CardFooter>
                        <LoadingButton
                            variant={'outline-solid'}
                            isLoading={isPending}
                        >
                            Update
                        </LoadingButton>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
};

export default ServiceAccountInfos;
