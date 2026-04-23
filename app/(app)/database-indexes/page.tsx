import { DatabaseIndexesView } from "@/components/features/database-indexes/database-indexes-view";
import { requiredAdminAuth } from "@/lib/auth/utils";
import { PageLayout } from "@/components/common/page-layout";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import { globalPagesBySegment } from "@/lib/config/pages";

const pageDef = globalPagesBySegment["database-indexes"]!;

export const generateMetadata = () => generatePageMetadata(pageDef);

export default async function DatabaseIndexesPage() {
    await requiredAdminAuth();
    return (
        <PageLayout page={pageDef}>
            <DatabaseIndexesView />
        </PageLayout>
    );
}
