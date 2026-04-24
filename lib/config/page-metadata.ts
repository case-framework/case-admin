import { getTranslations } from "next-intl/server";
import { type PageDef } from "@/lib/config/pages";

/** The application name, driven by NEXT_PUBLIC_APP_NAME. */
export const appName = process.env.NEXT_PUBLIC_APP_NAME || 'CASE Admin';

/** Creates Next.js metadata for a page from its PageDef. */
export async function generatePageMetadata(page: PageDef) {
    // We can consider adding an access check here if we want to prevent leaking data via the title.
    // But we already perform access checks elsewhere, so check if it is redundant.
    const t = await getTranslations("Pages");
    return {
        title: t(page.labelKey),
    };
}
