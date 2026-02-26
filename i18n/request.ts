import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { LOCALES } from './locales';

const DEFAULT_LOCALE = LOCALES.en;
const SUPPORTED_LOCALES = new Set(Object.values(LOCALES));

function isSupportedLocale(locale: string): locale is LOCALES {
    return SUPPORTED_LOCALES.has(locale as LOCALES);
}

async function detectBrowserLocale(): Promise<LOCALES> {
    const headerStore = await headers();
    const acceptLanguage = headerStore.get('accept-language') ?? '';
    for (const part of acceptLanguage.split(',')) {
        const tag = part.split(';')[0].trim().toLowerCase();
        const baseTag = tag.split('-')[0];
        if (isSupportedLocale(baseTag)) {
            return baseTag;
        }
        if (isSupportedLocale(tag)) {
            return tag;
        }
    }
    return DEFAULT_LOCALE;
}

export default getRequestConfig(async () => {
    const store = await cookies();
    const cookieLocale = store.get('locale')?.value;
    const locale = cookieLocale && isSupportedLocale(cookieLocale)
        ? cookieLocale
        : await detectBrowserLocale();

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
    };
});