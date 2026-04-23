import { PageLayout } from "@/components/common/page-layout";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import { studyPagesBySegment } from "@/lib/config/pages";

const pageDef = studyPagesBySegment["participants"]!;

export const generateMetadata = () => generatePageMetadata(pageDef);

export default function StudyParticipantsPage() {
    return <PageLayout page={pageDef} />;
}
