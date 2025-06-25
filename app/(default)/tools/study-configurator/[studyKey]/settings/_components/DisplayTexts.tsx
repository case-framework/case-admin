'use client';

import LanguageSelector from "@/components/LanguageSelector";
import { getLocalizedString } from "@/utils/localizedStrings";
import { StudyProps } from "@/utils/server/types/studyInfos";
import { Input } from '@/components/ui/input';
import { Label } from "@/components/ui/label"
import React, { useEffect } from "react";
import { BsCheck, BsPencil, BsPlus, BsX, BsXLg } from "react-icons/bs";
import { ExpressionArg, LocalizedString } from "survey-engine/data_types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { updateStudyDisplayProps } from "@/actions/study/updateStudyProps";
import { toast } from "sonner";

export const StudyCardWithTags = ({
    name, description, tags
}: {
    name?: string,
    description?: string,
    tags: Array<string | undefined>,
}) => {
    return (
        <div className='bg-slate-200 px-6 py-4 rounded-lg drop-shadow-xs'>
            <p className='font-bold'>
                <span className="text-xl">
                    {name || '<study name>'}
                </span>
            </p>
            <p className="italic">
                {description || '<study description>'}
            </p>
            <div className='flex flex-wrap items-center mt-2 gap-3'>
                {tags.length === 0 && <span className='text-gray-500 text-sm'>No tags defined</span>}
                {tags.map((tag, index) => (
                    <Badge
                        key={index}
                        variant={'primaryOutline'}
                    >
                        {tag || '<tag>'}
                    </Badge>
                ))}
            </div>
        </div>
    )
}

const DisplayTexts: React.FC<{ studyKey: string, studyProps: StudyProps }> = ({ studyKey, studyProps }) => {
    const [currentStudyProps, setCurrentStudyProps] = React.useState<StudyProps>(studyProps);
    const [selectedLanguage, setSelectedLanguage] = React.useState(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');
    const [editMode, setEditMode] = React.useState(false);
    const [isPending, startTransition] = React.useTransition();

    useEffect(() => {
        setCurrentStudyProps(studyProps);
    }, [studyProps]);


    const name = getLocalizedString(currentStudyProps.name, selectedLanguage);
    const description = getLocalizedString(currentStudyProps.description, selectedLanguage);
    const tags = currentStudyProps.tags ? currentStudyProps.tags.map(tag => getLocalizedString(tag.label, selectedLanguage)) : [];

    const onChange = (studyProps: StudyProps) => {
        startTransition(async () => {
            try {
                const resp = await updateStudyDisplayProps(studyKey,
                    studyProps.name,
                    studyProps.description,
                    studyProps.tags
                );
                if (resp.error) {
                    toast.error(resp.error);
                    return;
                }
                toast.success('Display texts updated');
            } catch (error) {
                console.error(error);
                return;
            }
        })
    }

    if (editMode) {
        return <div>
            <div className="flex justify-end">
                <LanguageSelector
                    onLanguageChange={setSelectedLanguage}
                />
            </div>

            <div className="space-y-4">
                <h3 className='text-xl font-bold mb-1'>Edit display texts:</h3>

                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="study-name"
                    >
                        Study Name
                    </Label>
                    <Input
                        id='study-name'
                        placeholder='Enter a name for the study'
                        autoComplete="off"
                        value={name || ''}
                        onChange={(e) => {
                            const v = e.target.value;
                            const currentName = currentStudyProps.name;
                            if (!currentName) {
                                setCurrentStudyProps((prev) => ({
                                    ...prev,
                                    name: [{
                                        code: selectedLanguage, parts: [
                                            { str: v, dtype: 'str' }
                                        ]
                                    }]
                                }));
                            } else {
                                const i = currentName.findIndex((l) => l.code === selectedLanguage);
                                if (i === -1) {
                                    currentName.push({ code: selectedLanguage, parts: [{ str: v, dtype: 'str' }] });
                                } else {
                                    ((currentName[i] as LocalizedString).parts[0] as ExpressionArg).str = v;
                                }
                                setCurrentStudyProps((prev) => ({
                                    ...prev,
                                    name: currentName as LocalizedString[]
                                }));
                            }
                        }}
                    />
                    <p className="text-xs text-slate-400">A short title for the study card.</p>
                </div>


                <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="study-name">
                        Study Description
                    </Label>
                    <Input
                        id='study-description'
                        placeholder='Enter a description for the study'
                        autoComplete="off"
                        value={description || ''}
                        onChange={(e) => {
                            const v = e.target.value;
                            const currentDescription = currentStudyProps.description;
                            if (!currentDescription) {
                                setCurrentStudyProps((prev) => ({
                                    ...prev,
                                    description: [{
                                        code: selectedLanguage, parts: [
                                            { str: v, dtype: 'str' }
                                        ]
                                    }]
                                }));
                            } else {
                                const i = currentDescription.findIndex((l) => l.code === selectedLanguage);
                                if (i === -1) {
                                    currentDescription.push({ code: selectedLanguage, parts: [{ str: v, dtype: 'str' }] });
                                } else {
                                    ((currentDescription[i] as LocalizedString).parts[0] as ExpressionArg).str = v;
                                }
                                setCurrentStudyProps((prev) => ({
                                    ...prev,
                                    description: currentDescription as LocalizedString[]
                                }));
                            }
                        }}
                    />
                    <p className="text-xs text-slate-400">A short title for the study card.</p>
                </div>

                <Separator />
                <div>
                    <h4 className="text-xl mb-3 flex items-center">
                        <span className="grow">
                            Tags:
                        </span>
                        <Button
                            size="icon"
                            variant="secondary"
                            type="button"
                            onClick={() => {
                                setCurrentStudyProps((prev) => ({
                                    ...prev,
                                    tags: [
                                        ...(prev.tags || []),
                                        {
                                            label: [{ code: selectedLanguage, parts: [{ str: '', dtype: 'str' }] }]
                                        }
                                    ]
                                }))
                            }}
                        >
                            <BsPlus className="size-6" />

                        </Button>
                    </h4>
                    <div className="flex flex-col gap-3">
                        {tags.length === 0 && <span className='text-gray-400 text-sm h-14 text-center flex items-center justify-center'>No tags defined</span>}
                        {tags.map((tag, index) => (
                            <div key={index}
                                className="flex items-center gap-3  px-3 py-2 rounded-lg bg-slate-50 border border-slate-200"
                            >
                                <Label
                                    htmlFor={`tag-${index}`}
                                >
                                    <span className='text-gray-500 text-sm text-nowrap'>
                                        Tag {index + 1}
                                    </span>
                                </Label>
                                <Input
                                    id={`tag-${index}`}
                                    placeholder='Enter a tag translation'
                                    autoComplete="off"
                                    value={tag || ''}
                                    onChange={(e) => {
                                        const v = e.target.value;
                                        const currentTags = currentStudyProps.tags;
                                        if (!currentTags) {
                                            setCurrentStudyProps((prev) => ({
                                                ...prev,
                                                tags: [{
                                                    label: [{
                                                        code: selectedLanguage, parts: [
                                                            { str: v, dtype: 'str' }
                                                        ]
                                                    }]
                                                }]
                                            }));
                                        } else {
                                            const i = currentTags[index].label.findIndex((l) => l.code === selectedLanguage);
                                            if (i === -1) {
                                                currentTags[index].label.push({ code: selectedLanguage, parts: [{ str: v, dtype: 'str' }] });
                                            } else {
                                                ((currentTags[index].label[i] as LocalizedString).parts[0] as ExpressionArg).str = v;
                                            }
                                            setCurrentStudyProps((prev) => ({
                                                ...prev,
                                                tags: currentTags
                                            }));
                                        }
                                    }}

                                />

                                <Button
                                    size="icon"
                                    disabled={isPending}
                                    variant="ghost"
                                    type="button"
                                    onClick={() => {
                                        if (confirm('Are you sure you want to delete this tag?')) {
                                            setCurrentStudyProps((prev) => ({
                                                ...prev,
                                                tags: [
                                                    ...prev.tags.slice(0, index),
                                                    ...prev.tags.slice(index + 1)
                                                ]
                                            }))
                                        }
                                    }}
                                >
                                    <BsXLg />
                                </Button>

                            </div>
                        ))}

                    </div>
                </div>
                <Separator />

                <div className='flex gap-3'>
                    <Button
                        variant={'ghost'}
                        onClick={() => {
                            setEditMode(false);
                            setCurrentStudyProps(studyProps);
                        }}
                    >
                        <BsX className="mr-2" />
                        Cancel
                    </Button>
                    <Button
                        disabled={isPending}
                        onClick={() => {
                            onChange(currentStudyProps);
                            setEditMode(false);
                        }}
                    ><BsCheck
                            className="mr-2"
                        />
                        Apply
                    </Button>
                </div>
            </div>
        </div >
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <LanguageSelector
                    onLanguageChange={setSelectedLanguage}
                />
            </div>
            <StudyCardWithTags
                name={name}
                description={description}
                tags={tags}
            />
            <div className="">
                <Button
                    onClick={() => {
                        setEditMode(!editMode);
                    }}
                    disabled={isPending}
                    variant='secondary'
                >
                    <BsPencil className="text-slate-600 mr-3" />
                    Edit Display Texts
                </Button>
            </div>
        </div>
    )
}

export default DisplayTexts;
