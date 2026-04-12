import UserPermissions from "@/components/features/user-management/user-detail/user-permissions";
import { requiredAdminAuth } from "@/lib/auth/utils";


interface UserManagementPageProps {
    params: Promise<{
        userId: string;
    }>
}

const UserManagementPage = async ({ params }: UserManagementPageProps) => {
    const { userId } = await params;
    await requiredAdminAuth();

    return (
        <div className="p-4">
            <h1>User Management {userId}</h1>
            <UserPermissions userId={userId} />
        </div>
    )
}

export default UserManagementPage;