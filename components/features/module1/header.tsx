import { useGetUserById } from "@/hooks/useUserManagementRouter";

const ModuleHeader = () => {
    const { data, isLoading, error } = useGetUserById({ id: "1" });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <div>
            <h1>Module Header</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}

export default ModuleHeader;