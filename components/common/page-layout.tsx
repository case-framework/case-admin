import { getTranslations } from "next-intl/server";
import { ReactNode } from "react";
import { type PageDef } from "@/lib/config/pages";
import { requirePageAccess } from "@/lib/auth/access";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
    page: PageDef;
    actions?: ReactNode;
    children?: ReactNode;
    className?: string;
    contentClassName?: string;
    headerClassName?: string;
}

export async function PageLayout({
    page,
    actions,
    children,
    className,
    contentClassName,
    headerClassName,
}: PageLayoutProps) {
    await requirePageAccess(page);
    const t = await getTranslations("Pages");

    return (
        <div className={cn("p-4 sm:p-6 space-y-4", className)}>
            <div className={cn("flex items-start justify-between gap-4", headerClassName)}>
                <div>
                    <h1 className="text-xl font-semibold">{t(page.labelKey)}</h1>
                    {page.descriptionKey && (
                        <p className="text-sm text-muted-foreground mt-1">{t(page.descriptionKey)}</p>
                    )}
                </div>
                {actions ? <div className="shrink-0">{actions}</div> : null}
            </div>
            {children
                ? contentClassName
                    ? <div className={contentClassName}>{children}</div>
                    : children
                : null}
        </div>
    );
}
