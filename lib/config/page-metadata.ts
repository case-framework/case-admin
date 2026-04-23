import { getTranslations } from "next-intl/server";
import { type PageDef } from "@/lib/config/pages";

/** Creates Next.js metadata for a page from its PageDef. */
export async function generatePageMetadata(page: PageDef) {
    const [t, tCommon] = await Promise.all([
        getTranslations("Pages"),
        getTranslations("Common"),
    ]);
    return {
        title: `${t(page.labelKey)} | ${tCommon("appName")}`,
    };
}
