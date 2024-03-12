import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, HardDriveDownload } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import ReportFilter from "./_components/ReportFilter";
import ReportViewer, { ReportViewerSkeleton } from "./_components/ReportViewer";



export const dynamic = 'force-dynamic';

export const metadata = {
    title: 'Reports',
    description: 'Download participant reports from the study.',
}


interface PageProps {
    params: {
        studyKey: string;
    }
    searchParams?: {
        filter?: string;
    }
}

export default async function Page(props: PageProps) {
    const reportsCompKey = props.params.studyKey + JSON.stringify(props.searchParams);

    return (
        <div
            className="h-full w-full py-6 flex flex-col gap-4" >
            <div className="grow flex overflow-hidden">
                <Card
                    variant={'opaque'}
                    className="w-full h-full flex flex-col overflow-hidden"
                >
                    <CardHeader
                        className="p-4 gap-1 bg-neutral-50"
                    >
                        <CardTitle className="flex items-center">
                            <div className="grow">
                                Reports
                            </div>
                            <Button
                                variant='link'
                                asChild
                                className="font-bold"
                            >
                                <Link
                                    href={`/tools/participants/${props.params.studyKey}/responses/exporter`}
                                >
                                    <HardDriveDownload className="size-4 me-2" />
                                    Open Exporter
                                    <ArrowRight className="ml-2 size-4" />
                                </Link>
                            </Button>
                        </CardTitle>
                        <CardDescription>
                            Participant reports are generated by certain study rules if present in the study configuration. If they are used, you can access reports from here.
                        </CardDescription>

                        <ReportFilter />

                    </CardHeader>
                    <Separator
                        className="bg-neutral-300"
                    />
                    <div className="grow flex overflow-hidden">
                        <Suspense
                            key={reportsCompKey}
                            fallback={<ReportViewerSkeleton />}>
                            <ReportViewer
                                studyKey={props.params.studyKey}
                            />
                        </Suspense>
                    </div>
                </Card>
            </div>
        </div>
    );
}
