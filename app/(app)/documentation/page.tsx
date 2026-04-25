import { PageLayout } from "@/components/common/page-layout";
import { DocsIframe } from "@/components/features/documentation/docs-iframe";
import { Button } from "@/components/ui/button";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import { globalPagesBySegment } from "@/lib/config/pages";
import { getTranslations } from "next-intl/server";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

const DEFAULT_DOCS_URL = "https://case-framework.github.io/case-docs/";

const pageDef = globalPagesBySegment["documentation"]!;

export const generateMetadata = () => generatePageMetadata(pageDef);

export default async function DocumentationPage() {
    const tDoc = await getTranslations("Documentation");
    const docsUrl = process.env.DOCS_URL?.trim() || DEFAULT_DOCS_URL;

    return (
        <PageLayout
            page={pageDef}
            actions={
                <Button variant="outline" size="sm" asChild>
                    <Link href={docsUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        {tDoc("openInNewTab")}
                    </Link>
                </Button>
            }
            className="flex flex-1 min-h-0 flex-col overflow-hidden"
            contentClassName="flex-1 min-h-0"
        >
            <div className="h-full min-h-0 overflow-hidden rounded-xl border bg-background shadow-sm">
                <DocsIframe src={docsUrl} />
            </div>
        </PageLayout>
    );
}
