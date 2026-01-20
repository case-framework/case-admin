'use client';

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import React from 'react';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from 'sonner';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { saveStudyNotifications } from '@/actions/study/saveStudyNotifications';
import getErrorMessage from '@/utils/getErrorMessage';

interface NewNotificationSubDialogProps {
    trigger: React.ReactNode;
    studyKey: string;
    subscriptions: Array<{
        messageType: string;
        email: string;
    }>;
}



const newSubSchema = z.object({
    messageType: z.string().min(1).max(50),
    email: z.string().email(),
})

const NewNotificationSubDialog: React.FC<NewNotificationSubDialogProps> = (props) => {
    const [isPending, startTransition] = React.useTransition();
    const closeBtnRef = React.useRef<HTMLButtonElement>(null);

    const form = useForm<z.infer<typeof newSubSchema>>({
        resolver: zodResolver(newSubSchema),
        defaultValues: {
            messageType: "",
            email: "",
        },
    })

    function onSubmit(values: z.infer<typeof newSubSchema>) {
        // check if values are already
        if (props.subscriptions.findIndex(s => s.messageType === values.messageType && s.email === values.email) > -1) {
            toast.error('Subscription already exists');
            return;
        }

        const newSubs = [...props.subscriptions, values];
        startTransition(async () => {
            try {
                const resp = await saveStudyNotifications(props.studyKey, newSubs);
                if (resp.error) {
                    toast.error(`Failed to add subscription: ${resp.error}`);
                    return
                }
                toast.success('Subscription added');
                form.reset();
                closeBtnRef.current?.click();
            } catch (error: unknown) {
                toast.error('Failed to add subscription', { description: getErrorMessage(error) });
            }
        });

        console.log(values)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                {props.trigger}
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        New topic subscription
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="messageType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Message type</FormLabel>
                                    <FormControl>
                                        <Input placeholder="message type" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Receive a notification for this topic. Use <code className="px-1 py-0.5 bg-muted rounded">*</code> to subscribe to all message topics.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        This email will receive notifications for this topic
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <DialogClose
                                ref={closeBtnRef}
                                asChild
                            >
                                <Button variant={'outline'}>
                                    Cancel
                                </Button>
                            </DialogClose>
                            <LoadingButton
                                isLoading={isPending}
                                type="submit">Add</LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default NewNotificationSubDialog;
