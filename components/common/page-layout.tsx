import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";
import { type PageDef } from "@/lib/config/pages";
import { requireAuth } from "@/lib/auth/utils";

interface PageLayoutProps {
    page: PageDef;
    children?: ReactNode;
}

export async function PageLayout({ page, children }: PageLayoutProps) {
    if (!page.skipAuth) {
        await requireAuth();
    }
    const t = await getTranslations("Pages");
    return (
        <div className="p-4 sm:p-6 space-y-4">
            <div>
                <h1 className="text-xl font-semibold">{t(page.labelKey)}</h1>
                {page.descriptionKey && (
                    <p className="text-sm text-muted-foreground mt-1">{t(page.descriptionKey)}</p>
                )}
            </div>
            {children}
        </div>
    );
}
