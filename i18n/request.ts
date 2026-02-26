import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { LOCALES } from './locales';
import { isSupportedLocale, detectBrowserLocale } from './utils';

export default getRequestConfig(async () => {
    const store = await cookies();
    const cookieLocale = store.get('locale')?.value;
    const locale = cookieLocale && isSupportedLocale(cookieLocale)
        ? cookieLocale as LOCALES
        : await detectBrowserLocale();

    return {
        locale,
        messages: (await import(`./messages/${locale}.json`)).default
    };
});