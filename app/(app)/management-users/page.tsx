import Users from "@/components/features/user-management/users";
import { requiredAdminAuth } from "@/lib/auth/utils";

const UserManagementPage = async () => {
    await requiredAdminAuth();

    return (
        <div className="p-4">
            <h1>User Management</h1>
            <Users />
        </div>
    )
}

export default UserManagementPage;