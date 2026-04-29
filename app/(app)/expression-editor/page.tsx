import type { Metadata } from "next";
import { PageLayout } from "@/components/common/page-layout";
import { ExpressionEditorPrototype } from "@/components/features/expression-editor/expression-editor-prototype";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import { globalPagesBySegment } from "@/lib/config/pages";

const pageDef = globalPagesBySegment["expression-editor"]!;

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata(pageDef);

export default function ExpressionEditorPage() {
    return (
        <PageLayout page={pageDef} contentClassName="min-w-0">
            <ExpressionEditorPrototype />
        </PageLayout>
    );
}