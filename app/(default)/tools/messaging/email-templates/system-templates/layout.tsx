import SystemMessagesSidebar from "./_components/SystemMessagesSidebar";

export const dynamic = 'force-dynamic';

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <div className="flex max-w-full">
            {
                <div className='sticky top-0 h-screen shrink'>
                    <SystemMessagesSidebar />
                </div>
            }

            <div className="grow overflow-hidden">
                {children}
            </div>
        </div>
    );
}