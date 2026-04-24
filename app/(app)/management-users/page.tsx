import Users from "@/components/features/user-management/users";
import { requirePageAccess } from "@/lib/auth/access";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import { globalPagesBySegment } from "@/lib/config/pages";

const pageDef = globalPagesBySegment["management-users"]!;

export const generateMetadata = () => generatePageMetadata(pageDef);

const UserManagementPage = async () => {
    await requirePageAccess(pageDef);

    return (
        <div className="p-4">
            <h1>User Management</h1>
            <Users />
        </div>
    )
}

export default UserManagementPage;