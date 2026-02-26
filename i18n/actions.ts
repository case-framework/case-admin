'use server';

import { cookies } from 'next/headers';
import { LOCALES, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE } from './locales';
import { detectBrowserLocale, isSupportedLocale } from './utils';

export async function setLocale(locale: LOCALES) {
    const store = await cookies();
    store.set(LOCALE_COOKIE, locale, {
        path: '/',
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: 'lax',
    });
}

export async function getLocale(): Promise<LOCALES> {
    const store = await cookies();
    const locale = store.get(LOCALE_COOKIE)?.value;
    if (locale && isSupportedLocale(locale)) {
        return locale as LOCALES;
    }
    return detectBrowserLocale();
}