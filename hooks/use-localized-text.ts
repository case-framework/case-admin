"use client";

import { useLocale } from "next-intl";
import { LocalisedObject } from "@/lib/types/localization";
import { getLocalizedText } from "@/lib/utils/localization";

export function useLocalizedText() {
    const locale = useLocale();
    return (names: LocalisedObject[]) => getLocalizedText(names, locale);
}
