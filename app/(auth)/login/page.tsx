import Login from "@/components/features/auth/login";

interface LoginPageProps {
    searchParams: Promise<{ redirect?: string }>;
}

const LoginPage = async ({ searchParams }: LoginPageProps) => {
    const { redirect } = await searchParams;
    return <Login redirectTo={redirect ?? "/"} />;
};

export default LoginPage;