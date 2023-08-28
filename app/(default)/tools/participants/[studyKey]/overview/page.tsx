import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import ParticipantOverviewScreen from "./ParticipantOverviewScreen";
import { pageTitle } from "@/utils/pageTitle";


export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        studyKey: string;
    }
}

export const metadata = {
    title: pageTitle('Participants overview'),
    description: 'View and manage participants in your study.',
}


export default async function Page(props: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect(`/auth/login?callbackUrl=/tools/participants`);
    }

    return (
        <div className="pt-unit-sm px-unit-lg flex flex-col h-full bg-white/40">
            <Breadcrumbs
                homeLink={`/tools/participants/${props.params.studyKey}`}
                links={
                    [
                        {
                            title: `${props.params.studyKey}`,
                            href: `/tools/participants/${props.params.studyKey}`
                        },
                        {
                            title: `Participants overview`
                        }
                    ]
                }
            />
            <main className="pt-unit-lg grow" >
                <ParticipantOverviewScreen
                    studyKey={props.params.studyKey}
                />
            </main>
        </div>
    );
}
