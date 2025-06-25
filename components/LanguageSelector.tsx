'use client';

import React, { useEffect, useState } from 'react';
import { BsGlobe2 } from 'react-icons/bs';
import { RadioGroup } from '@headlessui/react'
import NotificationBadge from './NotificationBadge';

interface LanguageSelectorProps {
    onLanguageChange?: (lang: string) => void;
    showBadgeForLanguages?: string[];
    initialLanguage?: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    onLanguageChange,
    showBadgeForLanguages,
    initialLanguage = (process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en')
}) => {
    const languages = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES ? process.env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(',') : [process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en'];

    const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage)

    useEffect(() => {
        if (onLanguageChange) {
            onLanguageChange(selectedLanguage);
        }
    }, [selectedLanguage, onLanguageChange])

    return (
        <div className='flex items-center'>
            <RadioGroup value={selectedLanguage} onChange={setSelectedLanguage}>
                <div className='flex items-center bg-neutral-50 p-1 rounded-md gap-1.5 border border-slate-200'>
                    <RadioGroup.Label>
                        <span className='sr-only'>Language</span>
                        <span>
                            <BsGlobe2 className='text-neutral-400 mx-1' />
                        </span>
                    </RadioGroup.Label>
                    {languages.map((lang) => (
                        <NotificationBadge key={lang}
                            variant={'warning'}
                            animation={'ping'}
                            isInvisible={!showBadgeForLanguages || !showBadgeForLanguages.includes(lang)}
                        >
                            <RadioGroup.Option
                                value={lang}
                                className='px-1.5 py-0.5 cursor-pointer rounded-sm text-sm hover:underline ui-checked:font-bold ui-checked:bg-white ui-checked:underline ui-checked:shadow-xs border border-transparent ui-checked:border-slate-200'>
                                {lang}
                            </RadioGroup.Option>

                        </NotificationBadge>
                    ))}
                </div>
            </RadioGroup>

        </div>
    );
};

export default LanguageSelector;
