"use client";

import { LoadingButton } from "@/components/c-ui/loading-button";
import { Button } from "@/components/ui/button";
import { useGetUsers } from "@/hooks/useUserManagementRouter";
import { useUsersPagination } from "@/lib/search-params/users-pagination";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";


const Users = () => {
	const [pagination, setPagination] = useUsersPagination();

	const { data, isLoading, error } = useGetUsers({
		page: pagination.page,
		limit: pagination.limit,
	});

	return (
		<div className="border bg-zinc-50  rounded-md p-4">
			<h1>Users</h1>
			{error && <div className="text-red-500">{error.message}</div>}
			{data?.items.map((user) => (
				<div key={user.id}>
					<Button asChild
						variant="ghost"
					>
						<Link
							href={`/user-management/${user.id}`}
						>
							<h2>{user.name}</h2>
							<p>{user.email}</p>
							<p>{user.role}</p>
						</Link>
					</Button>
				</div>
			))}
			{isLoading && <div className="text-center">Loading...</div>}

			<div className="flex justify-between items-center">
				<div className="flex gap-2 items-center">
					<span>Page {data?.currentPage} of {data?.totalPages}</span>
					<span>Total {data?.totalCount} users</span>
				</div>
				<div className="flex gap-2 items-center">
					<LoadingButton
						isLoading={isLoading}
						variant="outline"
						disabled={data?.hasPreviousPage === false}
						onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
					>
						<ChevronLeftIcon className="size-4" />
						Previous
					</LoadingButton>
					<LoadingButton
						isLoading={isLoading}
						variant="outline"
						disabled={data?.hasNextPage === false}
						onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
					>
						Next
						<ChevronRightIcon className="size-4" />
					</LoadingButton>
				</div>
			</div>
		</div>
	)
}

export default Users;
