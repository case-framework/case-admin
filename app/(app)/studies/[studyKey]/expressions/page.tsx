import type { Metadata } from "next";
import { PageLayout } from "@/components/common/page-layout";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import { studyPagesBySegment } from "@/lib/config/pages";
import ExpressionEditorPage from "@/components/features/expression-editor/expression-editor-page";

const pageDef = studyPagesBySegment["expressions"]!;

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata(pageDef);

export default function StudyExpressionsPage() {
  return (
    <PageLayout page={pageDef}>
      <ExpressionEditorPage />
    </PageLayout>
  );
}
