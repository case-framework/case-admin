import { useGetUserById } from "@/hooks/use-user-management-router";
import { User } from "@/lib/types/user";


const DataRenderer = ({ user }: { user: User | null }) => {
	if (!user) return <div>No user found</div>;
	return <div>
		<h2>User</h2>
		<p>Name: {user.name}</p>
		<p>Email: {user.email}</p>
		<p>Role: {user.role}</p>
		<p>Created At: {user.createdAt.toLocaleDateString()}</p>
		<p>Updated At: {user.updatedAt.toLocaleDateString()}</p>
		<pre>{JSON.stringify(user, null, 2)}</pre>
	</div>;
}

const ModuleList = () => {
	const { data: user, isLoading, error } = useGetUserById({ id: "1" });

	if (isLoading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	return (
		<div>
			<h1>Module List</h1>
			<DataRenderer user={user ?? null} />
		</div>
	)
}

export default ModuleList;