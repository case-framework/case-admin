import { ExpressionEditorView } from "@/components/features/expression-editor/expression-editor-view";
import { PageLayout } from "@/components/common/page-layout";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import { globalPagesBySegment } from "@/lib/config/pages";

const pageDef = globalPagesBySegment["expression-editor"]!;

export const generateMetadata = () => generatePageMetadata(pageDef);

export default async function ExpressionEditorPage() {
	return (
		<PageLayout page={pageDef}>
			<ExpressionEditorView />
		</PageLayout>
	);
}
