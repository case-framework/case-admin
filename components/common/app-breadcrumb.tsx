"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useGetStudyByKey } from "@/hooks/use-studies-router";
import { useLocalizedText } from "@/hooks/use-localized-text";
import { globalPagesBySegment, studyPagesBySegment } from "@/lib/config/pages";
import React from "react";

export function AppBreadcrumb() {
    const pathname = usePathname() ?? "/";
    const t = useTranslations("Pages");
    const localizedText = useLocalizedText();

    const segments = pathname.split("/").filter(Boolean);

    const rawStudyKey = segments[0] === "studies" ? (segments[1] ?? null) : null;
    const studyKey = rawStudyKey !== "new" ? rawStudyKey : null;
    const { data: currentStudy } = useGetStudyByKey(studyKey);
    const studyDisplayName = currentStudy?.name
        ? localizedText(currentStudy.name)
        : (studyKey ?? "");

    if (segments.length === 0) return null;

    function getLabelForSegment(segment: string, index: number): string {
        if (segments[0] === "studies" && index === 1) {
            return segment === "new" ? t("newStudy") : studyDisplayName;
        }
        if (segments[0] === "studies" && index >= 2) {
            const pageDef = studyPagesBySegment[segment];
            return pageDef ? t(pageDef.labelKey) : segment;
        }
        const pageDef = globalPagesBySegment[segment];
        return pageDef ? t(pageDef.labelKey) : segment;
    }

    const items = segments.map((segment, i) => ({
        href: "/" + segments.slice(0, i + 1).join("/"),
        label: getLabelForSegment(segment, i),
        isLast: i === segments.length - 1,
    }));

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, i) => (
                    <React.Fragment key={item.href}>
                        {i > 0 && <BreadcrumbSeparator />}
                        <BreadcrumbItem>
                            {item.isLast ? (
                                <BreadcrumbPage>{item.label}</BreadcrumbPage>
                            ) : (
                                <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                            )}
                        </BreadcrumbItem>
                    </React.Fragment>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
}


