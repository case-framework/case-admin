import { PageLayout } from "@/components/common/page-layout";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import { globalPagesBySegment } from "@/lib/config/pages";

const pageDef = globalPagesBySegment["app-role-templates"]!;

export const generateMetadata = () => generatePageMetadata(pageDef);

export default function AppRoleTemplatesPage() {
    return <PageLayout page={pageDef} />;
}
