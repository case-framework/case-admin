import { PageLayout } from "@/components/common/page-layout";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import type { Metadata } from "next";
import { studyPagesBySegment } from "@/lib/config/pages";

const pageDef = studyPagesBySegment["responses"]!;

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata(pageDef);

export default function StudyResponsesPage() {
    return <PageLayout page={pageDef} />;
}
