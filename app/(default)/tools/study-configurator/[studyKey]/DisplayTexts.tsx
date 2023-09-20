'use client';

import LanguageSelector from "@/components/LanguageSelector";
import { getLocalizedString } from "@/utils/getLocalisedString";
import { Study } from "@/utils/server/types/studyInfos";
import { Button } from "@nextui-org/button";
import { Chip } from "@nextui-org/chip";
import React from "react";
import { BsPencil } from "react-icons/bs";

const DisplayTexts: React.FC<{ study: Study }> = ({ study }) => {
    const [selectedLanguage, setSelectedLanguage] = React.useState(process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en');

    const name = getLocalizedString(study.props.name, selectedLanguage);
    const description = getLocalizedString(study.props.description, selectedLanguage);
    const tags = study.props.tags ? study.props.tags.map(tag => getLocalizedString(tag.label, selectedLanguage)) : [];

    return (
        <div>
            <div className="flex items-start">
                <div className="grow flex flex-col gap-unit-md">
                    <div className='flex flex-col text-start'>
                        <span className='text-default-400 text-small'>
                            Study name
                        </span>
                        <span className='text-large'>
                            {name || 'not defined'}
                        </span>
                    </div>
                    <div className='flex flex-col text-start'>
                        <span className='text-default-400 text-small'>
                            Study description
                        </span>
                        <span className='text-large'>
                            {description || 'not defined'}
                        </span>
                    </div>

                    <div className='flex flex-col text-start'>
                        <span className='text-default-400 text-small mb-1'>
                            Study tags
                        </span>
                        <div className='flex flex-wrap gap-unit-sm'>
                            {tags.length < 1 ? 'not defined' : ''}
                            {tags.map((tag, index) => (
                                <Chip key={index}>
                                    {tag || 'not defined'}
                                </Chip>
                            ))}
                        </div>
                    </div>
                </div>
                <LanguageSelector
                    onLanguageChange={setSelectedLanguage}
                />
            </div>

            <div className="mt-unit-md">
                <Button
                    variant="ghost"
                    // size="sm"
                    startContent={<BsPencil className="text-default-400" />}
                    onPress={() => {
                        alert('todo: editor for display texts');
                    }}
                >
                    Edit Display Texts
                </Button>
            </div>
        </div>
    )
}

export default DisplayTexts;
