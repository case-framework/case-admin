import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import Breadcrumbs from "@/components/Breadcrumbs";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import ReportsDownloader from "./ReportsDownloader";
import { pageTitle } from "@/utils/pageTitle";


export const dynamic = 'force-dynamic';

export const metadata = {
    title: pageTitle('Reports'),
    description: 'Download participant reports from the study.',
}


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
                            title: `Participant reports`
                        }
                    ]
                }
            />
            <main className="py-unit-lg">
                <ReportsDownloader
                    studyKey={props.params.studyKey}
                />
            </main>
        </div>
    );
}
