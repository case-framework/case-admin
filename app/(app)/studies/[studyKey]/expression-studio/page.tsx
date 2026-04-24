import { PageLayout } from "@/components/common/page-layout";
import { ExpressionStudioPrototype } from "@/components/features/expression-studio/expression-studio-prototype";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import { studyPagesBySegment } from "@/lib/config/pages";

const pageDef = studyPagesBySegment["expression-studio"]!;

export const generateMetadata = () => generatePageMetadata(pageDef);

export default function StudyExpressionStudioPage() {
    return (
        <PageLayout page={pageDef}>
            <ExpressionStudioPrototype />
        </PageLayout>
    );
}