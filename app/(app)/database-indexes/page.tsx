import { DatabaseIndexesView } from "@/components/features/database-indexes/database-indexes-view";
import { PageLayout } from "@/components/common/page-layout";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import type { Metadata } from "next";
import { globalPagesBySegment } from "@/lib/config/pages";

const pageDef = globalPagesBySegment["database-indexes"]!;

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata(pageDef);

export default async function DatabaseIndexesPage() {
    return (
        <PageLayout page={pageDef}>
            <DatabaseIndexesView />
        </PageLayout>
    );
}
