'use client'

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardDescription, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { z } from "zod"
import React, { useTransition } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import LoadingButton from '@/components/loading-button';
import { toast } from 'sonner';
import { createStudy } from '@/actions/study/create';
import { useRouter } from 'next/navigation';



export const newStudySchema = z.object({
    studyKey: z.string().min(2).max(50).refine((studyKey) => {
        return /^[a-zA-Z0-9-_]+$/.test(studyKey);
    }, {
        message: "Study key must contain only letters, numbers, hyphens, and underscores."
    }),
    secretKey: z.string().min(5),
    isSystemDefaultStudy: z.boolean()
})

const CreateStudyForm: React.FC = () => {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const form = useForm<z.infer<typeof newStudySchema>>({
        resolver: zodResolver(newStudySchema),
        defaultValues: {
            studyKey: "",
            secretKey: "",
            isSystemDefaultStudy: false,
        },
    })

    function onSubmit(values: z.infer<typeof newStudySchema>) {
        startTransition(async () => {
            try {
                const resp = await createStudy(values);
                console.log(resp)
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }



                toast.success("Study created successfully");
                router.replace('/tools/study-configurator/' + resp.study.key);
            } catch (error) {
                console.error(error)
                toast.error("Failed to create study");
            }
        })
    }

    return (
        <Card
            variant={"opaque"}
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <CardHeader>
                        <CardTitle>
                            Create a New Study
                        </CardTitle>
                        <CardDescription>
                            {"Setup a new study with this form. You can configure the study's settings after creating it."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className='space-y-6'>
                        <FormField
                            control={form.control}
                            name="studyKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Study key</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Define the study key.." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        {"The study key is used to identify the study in the system. It must be unique and can only contain letters, numbers, hyphens, and underscores."}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="secretKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Secret key</FormLabel>
                                    <FormControl>
                                        <Input
                                            autoComplete='off'
                                            placeholder="Enter the secret key..." {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        {"The study secret is used to calculate the participant IDs in combination with a global secret configured in the study system."}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="isSystemDefaultStudy"
                            render={({ field }) => (
                                <FormItem>
                                    <div className='flex gap-3 items-center'>
                                        <FormControl className=''>
                                            <Switch
                                                id='isSystemDefaultStudy'
                                                name='isSystemDefaultStudy'
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormLabel
                                            htmlFor='isSystemDefaultStudy'
                                        >System default study
                                            {field.value ? ' (active)' : ' (inactive)'}
                                        </FormLabel>
                                    </div>
                                    <FormDescription>
                                        {"If checked, this study will be used as a default study for the system. This means that all participants will be assigned to this study by default."}
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                    </CardContent>

                    <CardFooter
                        className='gap-3'
                    >
                        <Button
                            variant={'outline-solid'}
                            type='button'
                            asChild
                        >
                            <Link
                                href='/tools/study-configurator'
                            >
                                Cancel
                            </Link>
                        </Button>
                        <LoadingButton
                            type='submit'
                            isLoading={isPending}
                        >
                            Create Study
                        </LoadingButton>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
};

export default CreateStudyForm;
