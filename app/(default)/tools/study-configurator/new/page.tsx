import Breadcrumbs from "@/components/Breadcrumbs";
import { BsHouseFill } from "react-icons/bs";
import NewStudyForm from "./NewStudyForm";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

export default async function Page() {
    const session = await getServerSession();
    if (!session || !session.user?.email) {
        redirect('/auth/login?callbackUrl=/tools/study-configurator/new');
    }

    return (
        <div className="px-unit-lg bg-white/60 h-full">
            <div className="py-unit-sm">
                <Breadcrumbs
                    links={
                        [
                            {
                                href: '/tools/study-configurator',
                                title: <BsHouseFill />
                            },
                            {
                                title: 'Create a new study'
                            }
                        ]
                    }
                />
                <main className="py-unit-lg">
                    <NewStudyForm />
                </main>
            </div>
        </div>
    )
}
