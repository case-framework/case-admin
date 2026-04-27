import { requireAccess } from "@/lib/auth/access";
import type { Metadata } from "next";
import { studyService } from "@/lib/db/service/study";
import { getLocalizedText } from "@/lib/utils/localization";
import { getLocale } from "@/i18n/actions";
import { appName } from "@/lib/config/page-metadata";
import { currentStudyAnyAccess } from "@/lib/types/access";

interface StudyKeyLayoutProps {
    children: React.ReactNode;
    params: Promise<{ studyKey: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ studyKey: string }> }): Promise<Metadata> {
    const { studyKey } = await params;
    await requireAccess(currentStudyAnyAccess(), { studyKey });

    const [study, locale] = await Promise.all([
        studyService.getStudyByKey(studyKey),
        getLocale(),
    ]);
    const studyName = (study?.name.length ? getLocalizedText(study.name, locale) : null) || studyKey;
    return {
        title: {
            template: `%s - ${studyName} | ${appName}`,
            default: studyName,
        },
    };
}

export default async function StudyKeyLayout({ children, params }: StudyKeyLayoutProps) {
    const { studyKey } = await params;
    await requireAccess(currentStudyAnyAccess(), { studyKey });

    return <>{children}</>;
}
