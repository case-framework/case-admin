'use server';

import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, LOCALES, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from './locales';

export async function setLocale(locale: LOCALES) {
    const store = await cookies();
    store.set(LOCALE_COOKIE, locale, {
        path: '/',
        maxAge: LOCALE_COOKIE_MAX_AGE,
    });
}

export async function getLocale(): Promise<LOCALES> {
    const store = await cookies();
    const locale = store.get(LOCALE_COOKIE)?.value as LOCALES;
    if (locale && Object.values(LOCALES).includes(locale)) {
        return locale;
    }
    return DEFAULT_LOCALE;
}