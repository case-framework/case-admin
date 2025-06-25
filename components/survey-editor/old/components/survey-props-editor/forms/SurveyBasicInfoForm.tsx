
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
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useContext, useEffect } from "react"
import { SurveyEditorContext } from "../../../../surveyEditorContext"
import { LocalizedString, Survey } from "survey-engine/data_types"
import React from "react"
import { useDebounceCallback } from "usehooks-ts"
import SurveyLanguageToggle from "../../general/SurveyLanguageToggle"
import { getLocalizedString, updateLocalizedString } from "@/utils/localizedStrings"

const formSchema = z.object({ "name": z.string().max(255), "description": z.string(), "duration_notice": z.string() })

const initialValues = (survey: Survey | undefined, selectedLanguage: string) => ({
    name: getLocalizedString(survey?.props?.name, selectedLanguage) ?? "",
    description: getLocalizedString(survey?.props?.description, selectedLanguage) ?? "",
    duration_notice: getLocalizedString(survey?.props?.typicalDuration, selectedLanguage) ?? "",
});

export function SurveyBasicInfoForm() {
    const runDebounced = useDebounceCallback((f) => f(), 500);
    const { survey, setSurvey, selectedLanguage } = useContext(SurveyEditorContext);
    const form = useForm<z.infer<typeof formSchema>>({
        mode: 'onSubmit',
        resolver: zodResolver(formSchema),
        defaultValues: initialValues(survey, selectedLanguage)
    })

    // Reset form when survey changes (opened another survey) or language is switched.
    useEffect(() => {
        form.reset(initialValues(survey, selectedLanguage));
    }, [survey, selectedLanguage, form])

    // Subscribe to changes in the form and save changes to survey debounced
    useEffect(() => {
        const watcher = form.watch((values) => {
            const hasChanges = JSON.stringify(values) != JSON.stringify(initialValues(survey, selectedLanguage))
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
    }, [form, survey, selectedLanguage])

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (survey !== undefined) {
            if (survey.props == undefined) {
                survey.props = {};
            }
            survey.props.name = updateLocalizedString(survey.props.name as LocalizedString[], selectedLanguage, values.name);
            survey.props.description = updateLocalizedString(survey.props.description as LocalizedString[], selectedLanguage, values.description);
            survey.props.typicalDuration = updateLocalizedString(survey.props.typicalDuration as LocalizedString[], selectedLanguage, values.duration_notice);
            setSurvey({ ...survey });
        }
    }

    return (
        <>
            <div className="flex flex-row justify-between grow">
                <div>
                    <h3 className="text-lg font-medium  mb-1">Basic Info</h3>
                    <p className="text-sm text-muted-foreground">
                        How the survey is represented.
                    </p>
                </div>
                <div className="flex justify-end self-start">
                    <SurveyLanguageToggle />
                </div>
            </div>
            <Separator />
            <Form {...form}>
                <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem className="rounded-lg border p-4">
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    The display name of the survey.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="rounded-lg border p-4">
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    The survey description should be a brief summary of the survey&apos;s purpose.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />

                    <FormField
                        control={form.control}
                        name="duration_notice"
                        render={({ field }) => (
                            <FormItem className="rounded-lg border p-4">
                                <FormLabel>Duration notice</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    This text will be displayed to the user to indicate the estimated time to complete the survey.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                    {/* <div className="flex justify-end"><Button type="submit">Save</Button></div> */}
                </form>
            </Form>
        </>
    )
}
