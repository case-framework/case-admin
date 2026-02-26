'use server';

import { cookies } from 'next/headers';
import { LOCALES } from './locales';

const LOCALE_COOKIE = 'locale';
const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year


export async function setLocale(locale: LOCALES) {
    const store = await cookies();
    store.set(LOCALE_COOKIE, locale, {
        path: '/',
        maxAge: LOCALE_COOKIE_MAX_AGE,
    });
}
