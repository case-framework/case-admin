import { PageLayout } from "@/components/common/page-layout";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import { globalPagesBySegment } from "@/lib/config/pages";

const pageDef = globalPagesBySegment["settings"]!;

export const generateMetadata = () => generatePageMetadata(pageDef);

export default function SettingsPage() {
    return <PageLayout page={pageDef} />;
}
