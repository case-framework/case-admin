import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import React, { useContext } from 'react';
import { SurveyEditorContext } from '../../../surveyEditorContext';
import { Globe } from 'lucide-react';
import NotificationBadge from '@/components/NotificationBadge';

interface SurveyLanguageToggleProps {
    showBadgeForLanguages?: string[];
}

export const supportedLanguages = process.env.NEXT_PUBLIC_SUPPORTED_LOCALES ? process.env.NEXT_PUBLIC_SUPPORTED_LOCALES.split(',') : [process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE || 'en'];

export const hasOnlySingleLanguage = supportedLanguages.length < 2;


const SurveyLanguageToggle: React.FC<SurveyLanguageToggleProps> = (props) => {
    const { selectedLanguage, setSelectedLanguage } = useContext(SurveyEditorContext);

    const languages = supportedLanguages;

    if (hasOnlySingleLanguage) {
        return null;
    }

    return (
        <div className='w-fit flex items-center gap-1 bg-muted p-0.5 rounded-md border border-neutral-200'>
            <span>
                <Globe className='text-neutral-400 size-4 ms-1' />
            </span>
            <ToggleGroup
                type='single'
                className=''
                size='sm'
                value={selectedLanguage}
            >
                {languages.map((lang) => (
                    <NotificationBadge key={lang}
                        variant={'warning'}
                        animation={'ping'}
                        isInvisible={!props.showBadgeForLanguages || !props.showBadgeForLanguages.includes(lang)}
                    >
                        <ToggleGroupItem
                            key={lang}
                            value={lang}
                            className='h-auto w-auto text-sm py-1 px-2 data-[state=on]:bg-white data-[state=on]:font-bold data-[state=on]:border data-[state=on]:border-slate-200 data-[state=on]:text-accent-foreground'
                            onClick={() => setSelectedLanguage(lang)}
                        >
                            {lang}
                        </ToggleGroupItem>
                    </NotificationBadge>
                ))}
            </ToggleGroup>
        </div>

    );
};

export default SurveyLanguageToggle;
