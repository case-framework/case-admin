import Users from "@/components/features/user-management/users";
import { requiredAdminAuth } from "@/lib/auth/utils";
import { generatePageMetadata } from "@/lib/config/page-metadata";
import { globalPagesBySegment } from "@/lib/config/pages";

export const generateMetadata = () => generatePageMetadata(globalPagesBySegment["management-users"]!);

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