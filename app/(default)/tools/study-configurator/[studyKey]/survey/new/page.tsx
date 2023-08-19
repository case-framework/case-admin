import Breadcrumbs from "@/components/Breadcrumbs";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";


interface PageProps {
    params: {
        studyKey: string
    }
}

export const dynamic = 'force-dynamic';


export default async function Page(props: PageProps) {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        redirect('/auth/login?callbackUrl=/tools/study-configurator');
    }

    return (
        <div className="px-unit-lg bg-white/60 h-full">
            <div className="py-unit-sm">
                <Breadcrumbs
                    homeLink="/tools/study-configurator"
                    links={
                        [
                            {
                                title: props.params.studyKey,
                                href: `/tools/study-configurator/${props.params.studyKey}`,
                            },
                            {
                                title: 'Create a new survey'
                            }
                        ]
                    }
                />
                <main className="py-unit-lg">
                    todo
                </main>
            </div>
        </div>
    )
}
