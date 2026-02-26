export const LOCALES = {
    en: 'en',
    nl: 'nl',
} as const;
export type LOCALES = (typeof LOCALES)[keyof typeof LOCALES];

export const LOCALE_COOKIE = 'locale';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export const DEFAULT_LOCALE = LOCALES.en;
