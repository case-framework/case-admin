import { PageLayout } from "@/components/common/page-layout";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import type { Metadata } from "next";
import { studyPagesBySegment } from "@/lib/config/pages";

const pageDef = studyPagesBySegment["rules"]!;

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata(pageDef);

export default function StudyRulesPage() {
    return <PageLayout page={pageDef} />;
}
