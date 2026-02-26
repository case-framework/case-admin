import { headers } from 'next/headers';
import { LOCALES, DEFAULT_LOCALE } from './locales';

export function isSupportedLocale(locale: string): locale is LOCALES {
    return Object.values(LOCALES).includes(locale as LOCALES);
}

export async function detectBrowserLocale(): Promise<LOCALES> {
    const headerStore = await headers();
    const acceptLanguage = headerStore.get('accept-language') ?? '';
    const acceptedTags = acceptLanguage.split(',').map((part) => part.split(';')[0].trim().toLowerCase());

    // Standard "Lookup" algorithm:
    // Iterate in user's priority order. For each tag, try to find a match (exact or base).
    for (const tag of acceptedTags) {
        // 1. Exact match?
        if (isSupportedLocale(tag)) {
            return tag;
        }

        // 2. Base match?
        const baseTag = tag.split('-')[0];
        if (baseTag !== tag && isSupportedLocale(baseTag)) {
            return baseTag;
        }
    }

    return DEFAULT_LOCALE;
}
