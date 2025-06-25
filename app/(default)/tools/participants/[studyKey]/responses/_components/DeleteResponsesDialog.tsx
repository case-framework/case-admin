'use client'
import LoadingButton from '@/components/loading-button';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import React from 'react';

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from '@/components/ui/input';


const confirmWithStudyKeySchema = z.object({
    studyKey: z.string().min(2).max(50),
})

interface DeleteResponsesDialogProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading?: boolean;

    studyKey: string;
    totalResponses: number;
    onPerformDelete: () => void;
}

const DeleteResponsesDialog: React.FC<DeleteResponsesDialogProps> = (props) => {
    const form = useForm<z.infer<typeof confirmWithStudyKeySchema>>({
        resolver: zodResolver(confirmWithStudyKeySchema),
        defaultValues: {
            studyKey: "",
        },
    })

    function onSubmit(values: z.infer<typeof confirmWithStudyKeySchema>) {
        if (values.studyKey !== props.studyKey) {
            form.setError('studyKey', {
                message: 'Study key does not match'
            })
            return
        }
        props.onPerformDelete();
        form.reset();
    }

    return (
        <Dialog
            open={props.isOpen}
            onOpenChange={(open) => {
                form.reset();
                if (!open) {
                    props.onClose();
                }
            }}
        >
            <DialogContent
                closeBtnAriaLabel='Close'
            >
                <DialogHeader>
                    <DialogTitle>
                        Delete responses
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete the selected responses?
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} >
                        <div className="space-y-4 mb-8">
                            <div className='px-4 py-2 bg-yellow-100 rounded-md flex items-center gap-4 text-yellow-800'>
                                <span>
                                    <AlertTriangle className='size-8' />
                                </span>
                                <p>
                                    This action will result in the permanent deletion of the responses for the current filter,
                                    <br />
                                    <span className='font-bold ms-1'>
                                        in total: {props.totalResponses} responses</span>.
                                </p>
                            </div>

                            <FormField
                                control={form.control}
                                name="studyKey"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Study key</FormLabel>
                                        <FormControl>
                                            <Input
                                                autoComplete='off'
                                                placeholder="study key" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Enter the study key to confirm
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>
                        <DialogFooter>
                            <DialogClose
                                asChild
                            >
                                <Button variant={'outline-solid'}
                                    type='button'
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <LoadingButton
                                variant={'destructive'}
                                type='submit'
                                isLoading={props.isLoading}
                            >
                                Delete responses
                            </LoadingButton>
                        </DialogFooter>
                    </form>
                </Form>

            </DialogContent>


        </Dialog>
    );
};

export default DeleteResponsesDialog;
