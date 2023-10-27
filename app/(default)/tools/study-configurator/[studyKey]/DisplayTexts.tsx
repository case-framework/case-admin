'use client';

import LanguageSelector from "@/components/LanguageSelector";
import { getLocalizedString } from "@/utils/getLocalisedString";
import { StudyProps } from "@/utils/server/types/studyInfos";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import { Input } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { BsCheck, BsPencil, BsPlus, BsX, BsXLg } from "react-icons/bs";
import { ExpressionArg, LocalizedString } from "survey-engine/data_types";
import { updateStudyProps } from "./actionUpdateStudyProps";

const DisplayTexts: React.FC<{ studyKey: string, studyProps: StudyProps }> = ({ studyKey, studyProps }) => {
    const [currentStudyProps, setCurrentStudyProps] = React.useState<StudyProps>(studyProps);
    const [selectedLanguage, setSelectedLanguage] = React.useState(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');
    const [editMode, setEditMode] = React.useState(false);
    const router = useRouter();
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
                await updateStudyProps(studyKey, studyProps);
                router.refresh();
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
            <div className="space-y-unit-sm">
                <h3 className='text-large font-bold mb-1'>Edit display texts:</h3>

                <Input
                    id='study-name'
                    label='Study Name'
                    labelPlacement='outside'
                    placeholder='Enter a name for the study'
                    variant='bordered'
                    description='A short title for the study card.'
                    autoComplete="off"
                    classNames={{
                        inputWrapper: 'bg-white'
                    }}
                    value={name || ''}
                    onValueChange={(v) => {
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

                <Input
                    id='study-description'
                    label='Study Description'
                    labelPlacement='outside'
                    placeholder='Enter a description for the study'
                    variant='bordered'
                    description='A description for the study card.'
                    autoComplete="off"
                    classNames={{
                        inputWrapper: 'bg-white'
                    }}
                    value={description || ''}
                    onValueChange={(v) => {
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

                <div>
                    <h4 className="text-small mb-2">
                        Tags:
                    </h4>
                    <div className="flex flex-wrap gap-unit-md items-center">
                        {tags.length === 0 && <span className='text-default-400 text-small'>No tags defined</span>}
                        {tags.map((tag, index) => (
                            <div key={index}
                                className="flex items-center border p-1 rounded-md bg-content2"
                            >
                                <Input
                                    id={`tag-${index}`}
                                    variant='bordered'
                                    size='sm'
                                    placeholder='Enter a tag'
                                    autoComplete="off"
                                    classNames={{
                                        inputWrapper: 'bg-white'
                                    }}
                                    value={tag || ''}
                                    onValueChange={(v) => {
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
                                    isIconOnly
                                    size="sm"
                                    isDisabled={isPending}
                                    variant="light"
                                    onPress={() => {
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
                        <Button
                            size="sm"
                            variant="flat"
                            startContent={<BsPlus />}
                            onPress={() => {
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
                            Add tag
                        </Button>
                    </div>
                </div>

                <div className='flex gap-unit-sm'>
                    <Button
                        variant='light'
                        color='danger'
                        startContent={<BsX />}
                        onPress={() => {
                            setEditMode(false);
                            setCurrentStudyProps(studyProps);
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant='flat'
                        color='primary'
                        startContent={<BsCheck />}
                        isLoading={isPending}
                        onPress={() => {
                            onChange(currentStudyProps);
                            setEditMode(false);
                        }}
                    >
                        Apply
                    </Button>
                </div>
            </div>
        </div>
    }

    return (
        <div>
            <div className="flex justify-end">
                <LanguageSelector
                    onLanguageChange={setSelectedLanguage}
                />
            </div>
            <div className='bg-content3 p-unit-sm rounded-small  my-unit-sm'>
                <p className='font-bold'>
                    <span className="text-xl">
                        {name || '<study name>'}
                    </span>
                </p>
                <p className="italic">
                    {description || '<study description>'}
                </p>
                <div className='flex flex-wrap items-center mt-2 gap-unit-sm'>
                    {tags.length === 0 && <span className='text-default-400 text-small'>No tags defined</span>}
                    {tags.map((tag, index) => (
                        <Chip key={index}
                            variant='bordered'
                            color='primary'
                        >
                            {tag || '<tag>'}
                        </Chip>
                    ))}
                </div>
            </div>
            <div className="mt-unit-md">
                <Button
                    startContent={<BsPencil className="text-default-600" />}
                    onPress={() => {
                        setEditMode(!editMode);
                    }}
                    isDisabled={isPending}
                >
                    Edit Display Texts
                </Button>
            </div>
        </div>
    )
}

export default DisplayTexts;
