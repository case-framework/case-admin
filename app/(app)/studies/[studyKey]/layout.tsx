import { studyService } from "@/lib/db/service/study";
import { getLocalizedText } from "@/lib/utils/localization";
import { getLocale } from "@/i18n/actions";
import { appName } from "@/lib/config/page-metadata";

interface StudyKeyLayoutProps {
    children: React.ReactNode;
    params: Promise<{ studyKey: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ studyKey: string }> }) {
    const { studyKey } = await params;
    const [study, locale] = await Promise.all([
        studyService.getStudyByKey(studyKey),
        getLocale(),
    ]);
    const studyName = (study?.name.length ? getLocalizedText(study.name, locale) : null) || studyKey;
    return {
        title: {
            template: `%s - ${studyName} | ${appName}`,
            default: `${studyName} | ${appName}`,
        },
    };
}

export default function StudyKeyLayout({ children }: StudyKeyLayoutProps) {
    return <>{children}</>;
}
