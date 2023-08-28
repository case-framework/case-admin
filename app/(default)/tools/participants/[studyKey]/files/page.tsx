import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import ParticipantFileDownloader from "./ParticipantFileDownloader";


export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        studyKey: string;
    }
}

export default async function Page(props: PageProps) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect(`/auth/login?callbackUrl=/tools/participants`);
    }

    return (
        <div className="py-unit-sm px-unit-lg">
            <Breadcrumbs
                homeLink={`/tools/participants/${props.params.studyKey}`}
                links={
                    [
                        {
                            title: `${props.params.studyKey}`,
                            href: `/tools/participants/${props.params.studyKey}`
                        },
                        {
                            title: `Participant files`
                        }
                    ]
                }
            />
            <main className="py-unit-lg">
                <ParticipantFileDownloader
                    studyKey={props.params.studyKey}
                />
            </main>
        </div>
    );
}
