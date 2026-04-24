import UserPermissions from "@/components/features/user-management/user-detail/user-permissions";
import { requirePageAccess } from "@/lib/auth/access";
import { pageManagementUsers } from "@/lib/config/pages";


interface UserManagementPageProps {
    params: Promise<{
        userId: string;
    }>
}

const UserManagementPage = async ({ params }: UserManagementPageProps) => {
    const { userId } = await params;
    await requirePageAccess(pageManagementUsers);

    return (
        <div className="p-4">
            <h1>User Management {userId}</h1>
            <UserPermissions userId={userId} />
        </div>
    )
}

export default UserManagementPage;