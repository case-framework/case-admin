import { Suspense } from "react";
import ParticipantsAppbarBase from "./ParticipantsAppbarBase";

export default async function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-screen relative overflow-scroll bg-center bg-cover bg-[url(/images/paper_iceberg2.png)]">
            <div className="absolute top-0 left-0 w-full">
                <ParticipantsAppbarBase />
            </div>
            <Suspense>
                <div className="pt-16 h-full">
                    {children}
                </div>
            </Suspense>
        </div>
    )
}
