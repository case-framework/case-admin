import Login from "@/components/features/auth/login";

interface LoginPageProps {
    searchParams: Promise<{ redirect?: string }>;
}

const LoginPage = async ({ searchParams }: LoginPageProps) => {
    const { redirect } = await searchParams;

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1>Login Page</h1>
            <Login redirectTo={redirect ?? '/'} />
        </div>
    );
};

export default LoginPage;