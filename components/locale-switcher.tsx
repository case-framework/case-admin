'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Languages } from 'lucide-react';
import { setLocale } from '@/i18n/actions';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LOCALES } from '@/i18n/locales';
import { toast } from 'sonner';



export function LocaleSwitcher() {
    const locale = useLocale();
    const router = useRouter();
    const t = useTranslations('LocaleSwitcher');

    async function handleLocaleChange(newLocale: LOCALES) {
        try {
            await setLocale(newLocale);
            router.refresh();
        } catch (error) {
            console.error('Failed to change locale:', error);
            toast.error(String(error));
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label={t('label')}
                >
                    <Languages className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {Object.values(LOCALES).map((loc) => (
                    <DropdownMenuItem
                        key={loc}
                        onClick={() => handleLocaleChange(loc)}
                        className={locale === loc ? 'bg-accent' : undefined}
                    >
                        {t(loc)}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
