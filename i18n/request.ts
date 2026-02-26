import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { LOCALES, DEFAULT_LOCALE } from './locales';


function isSupportedLocale(locale: string): locale is LOCALES {
    return Object.values(LOCALES).includes(locale as LOCALES);
}

async function detectBrowserLocale(): Promise<LOCALES> {
    const headerStore = await headers();
    const acceptLanguage = headerStore.get('accept-language') ?? '';

    const acceptedTags = acceptLanguage.split(',').map((part) => part.split(';')[0].trim().toLowerCase());
    for (const tag of acceptedTags) {
        if (isSupportedLocale(tag)) {
            return tag;
        }
    }

    for (const tag of acceptedTags) {
        const baseTag = tag.split('-')[0];
        if (isSupportedLocale(baseTag)) {
            return baseTag;
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