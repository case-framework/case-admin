import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";


interface NewSurveyProps {
    open: boolean;
    onClose: () => void;
}

const formSchema = z.object({
    surveyKey: z.string()
        .min(1, "Survey key is required")
        .refine((value) => {
            return !/[.-]/.test(value);
        }, {
            message: "Survey key must not contain . or - characters"
        }),
    template: z.string().min(1, "Please select a template"),
});

type FormData = z.infer<typeof formSchema>;

interface Template {
    id: string;
    name: string;
    description: string;
    image: string;
    category: string;
}

const templates: Template[] = [
    {
        id: "blank",
        name: "Blank Survey",
        description: "Start from scratch with an empty survey.",
        image: "/placeholder.svg?height=120&width=200",
        category: "Custom",
    },
    // Add more templates here in the future
];


const TemplateCard = ({ template, selectedTemplate, setSelectedTemplate }: { template: Template, selectedTemplate: string, setSelectedTemplate: (id: string) => void }) => {
    return (
        <Card
            key={template.id}
            className={`cursor-pointer p-0 transition-all grow ${selectedTemplate === template.id
                ? "ring-2 ring-primary border-primary"
                : "hover:ring-2 hover:ring-primary/60"
                }`}
            onClick={() => setSelectedTemplate(template.id)}
        >
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <Badge variant="secondary" className="text-xs">
                        {template.category}
                    </Badge>
                    {selectedTemplate === template.id && (
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                            <Check className="h-3 w-3" />
                        </div>
                    )}
                </div>
                <h3 className="font-semibold text-base mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{template.description}</p>
            </CardContent>
        </Card>
    )
}

const NewSurvey: React.FC<NewSurveyProps> = ({ open, onClose }) => {
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            surveyKey: "mySurvey",
            template: "blank",
        },
    });

    function onSubmit(values: FormData) {
        console.log("Creating survey with:", values);
        // TODO: Implement survey creation logic
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Create New Survey</DialogTitle>
                    <DialogDescription>
                        Create a new survey to get started.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="surveyKey"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Survey Key</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="mySurvey"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter a unique identifier for your survey. No dots (.) or hyphens (-) allowed.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="template"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Choose Template</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="grid grid-cols-3 gap-4 mt-2 p-2 bg-muted border border-border focus-within:ring-2 focus-within:ring-primary/20 rounded-2xl"
                                        >
                                            {templates.map((template) => (
                                                <div key={template.id} className="flex flex-col items-center h-full">
                                                    <RadioGroupItem
                                                        key={template.id}
                                                        value={template.id}
                                                        id={template.id}
                                                        className="sr-only"
                                                    />
                                                    <Label
                                                        htmlFor={template.id}
                                                        className="flex-1 cursor-pointer flex flex-col"
                                                    >
                                                        <TemplateCard
                                                            template={template}
                                                            selectedTemplate={field.value}
                                                            setSelectedTemplate={field.onChange}
                                                        />
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-3 pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Create Survey
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog >
    )
}

export default NewSurvey;
