import { PageLayout } from "@/components/common/page-layout";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import type { Metadata } from "next";
import { studyPagesBySegment } from "@/lib/config/pages";

const pageDef = studyPagesBySegment["notifications"]!;

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata(pageDef);

export default function StudyNotificationsPage() {
    return <PageLayout page={pageDef} />;
}
