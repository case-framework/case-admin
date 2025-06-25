
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
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

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { SurveyEditorContext } from "../../../../surveyEditorContext"
import { useContext, useEffect } from "react"
import { Survey } from "survey-engine/data_types"
import { useDebounceCallback } from "usehooks-ts"

const formSchema = z.object({ "available_for": z.string(), "login_required": z.boolean().optional() })

const initialValues = (survey: Survey | undefined) => ({
    available_for: survey?.availableFor ?? "active_participants",
    login_required: survey?.requireLoginBeforeSubmission ?? false,
});


export function SurveyAccessForm() {
    const runDebounced = useDebounceCallback((f) => f(), 500);
    const { survey, setSurvey } = useContext(SurveyEditorContext);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialValues(survey)
    })

    // Reset form when survey changes (opened another survey)
    useEffect(() => {
        form.reset(initialValues(survey));
    }, [survey, form]);

    // Subscribe to changes in the form and save changes to survey debounced
    useEffect(() => {
        const watcher = form.watch((values) => {
            const hasChanges = JSON.stringify(values) != JSON.stringify(initialValues(survey))
            if (hasChanges) {
                runDebounced(() => {
                    form.handleSubmit(onSubmit)();
                });
            }
        });
        return () => {
            watcher.unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form, survey])

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (survey !== undefined) {
            survey.availableFor = values.available_for;
            survey.requireLoginBeforeSubmission = values.login_required;
            setSurvey({ ...survey });
        }
    }

    return (
        <>
            <div>
                <h3 className="text-lg font-medium  mb-1">Survey Access</h3>
                <p className="text-sm text-muted-foreground">
                    Conditions regarding who can access the survey.
                </p>
            </div>
            <Separator />
            <Form {...form}>
                <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="available_for"
                        render={({ field }) => (
                            <FormItem className="rounded-lg border p-4">
                                <FormLabel>Available for</FormLabel>
                                <Select onValueChange={field.onChange} value={field.value} >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="public">Everyone</SelectItem>
                                        <SelectItem value="temporary_participants">Temporary Participants</SelectItem>
                                        <SelectItem value="active_participants">Active Participants</SelectItem>
                                        <SelectItem value="participants_if_assigned">Assigned Participants</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    Select who can see this survey
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                    <FormField
                        control={form.control}
                        name="login_required"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="">Submission requires Login</FormLabel>
                                    <FormDescription>
                                        If enabled, participants will be required to be logged in to be able to submit the survey.
                                    </FormDescription>
                                </div>
                                <FormControl>
                                    <Switch
                                        checked={field.value}
                                        onCheckedChange={field.onChange} />
                                </FormControl>
                            </FormItem>
                        )} />
                    {/* <div className="flex justify-end"><Button type="submit">Save</Button></div> */}
                </form>
            </Form>
        </>
    )
}

