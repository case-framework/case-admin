import { PageLayout } from "@/components/common/page-layout";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import type { Metadata } from "next";
import { globalPagesBySegment } from "@/lib/config/pages";

const pageDef = globalPagesBySegment["app-role-templates"]!;

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata(pageDef);

export default function AppRoleTemplatesPage() {
    return <PageLayout page={pageDef} />;
}
