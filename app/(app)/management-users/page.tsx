import { PageLayout } from "@/components/common/page-layout";
import Users from "@/components/features/user-management/users";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import { globalPagesBySegment } from "@/lib/config/pages";

const pageDef = globalPagesBySegment["management-users"]!;

export const generateMetadata = () => generatePageMetadata(pageDef);

export default function UserManagementPage() {
    return (
        <PageLayout page={pageDef}>
            <Users />
        </PageLayout>
    );
}