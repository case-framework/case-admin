import { PageLayout } from "@/components/common/page-layout";
import Users from "@/components/features/user-management/users";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import type { Metadata } from "next";
import { globalPagesBySegment } from "@/lib/config/pages";

const pageDef = globalPagesBySegment["management-users"]!;

export const generateMetadata = (): Promise<Metadata> => generatePageMetadata(pageDef);

export default function UserManagementPage() {
    return (
        <PageLayout page={pageDef}>
            <Users />
        </PageLayout>
    );
}