import QueryFilterInput from "@/components/QueryFilterInput";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import ParticipantFiles, { ParticipantFilesSkeleton } from "./_components/ParticipantFiles";
import SidebarToggleWithBreadcrumbs from "@/components/sidebar-toggle-with-breadcrumbs";
import { FilesPageLinkContent } from "../../_components/breacrumbs-contents";

export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Participant Files',
    description: 'Download participant from the study.',
}


interface PageProps {
    params: Promise<{
        studyKey: string;
    }>
    searchParams?: Promise<{
        filter?: string;
    }>
}

export default async function Page(props: PageProps) {
    const filesCompKey = (await props.params).studyKey + JSON.stringify((await props.searchParams));

    return (
        (<div
            className="h-full w-full flex flex-col" >
            <SidebarToggleWithBreadcrumbs
                breadcrumbs={[
                    {
                        href: "/tools/participants",
                        content: (await props.params).studyKey
                    },
                    {
                        content: <FilesPageLinkContent />
                    }
                ]}
            />
            <main className="grow flex overflow-hidden px-4 pb-1">

                <Card
                    variant={'opaque'}
                    className="w-full h-full flex flex-col overflow-hidden"
                >
                    <CardHeader
                        className="p-4 gap-1 bg-neutral-50"
                    >
                        <CardTitle className="flex items-center">
                            <div className="grow">
                                Files
                            </div>
                        </CardTitle>
                        <CardDescription>
                            If the study accepts file uploads, you can access the files through this page.
                        </CardDescription>

                        <QueryFilterInput
                            id='files-filter'
                        />
                    </CardHeader>
                    <Separator
                        className="bg-neutral-300"
                    />
                    <div className="grow flex overflow-hidden">
                        <Suspense
                            key={filesCompKey}
                            fallback={<ParticipantFilesSkeleton />}>
                            <ParticipantFiles
                                studyKey={(await props.params).studyKey}
                                filter={(await props.searchParams)?.filter}
                            />
                        </Suspense>
                    </div>
                </Card>
            </main>
        </div>)
    );
}
