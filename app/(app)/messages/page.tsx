import { PageLayout } from "@/components/common/page-layout";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import type { Metadata } from "next";
import { globalPagesBySegment } from "@/lib/config/pages";

const pageDef = globalPagesBySegment["messages"]!;

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata(pageDef);

export default function MessagesPage() {
    return <PageLayout page={pageDef} />;
}
