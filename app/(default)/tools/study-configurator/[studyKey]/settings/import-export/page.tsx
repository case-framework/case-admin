import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import StudyConfigExporter from "./_components/study-config-exporter";
import StudyConfigImporter from "./_components/study-config-importer";


interface PageProps {
    params: Promise<{
        studyKey: string;
    }>
}

export default async function Page(props: PageProps) {

    return (
        (<Card
            variant='opaque'
            className='w-full'
        >
            <CardHeader>
                <div className='flex gap-6'>
                    <div className='space-y-1.5 grow'>
                        <CardTitle
                            className='text-xl'
                        >
                            Import / Export study configuration
                        </CardTitle>
                        <CardDescription>
                            Prepare study configuration for export or override the current configuration with an file exported elsewhere.
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className='space-y-3'>
                <Separator />

                <StudyConfigExporter
                    studyKey={(await props.params).studyKey}
                />

                <Separator />

                <StudyConfigImporter
                    studyKey={(await props.params).studyKey}
                />

            </CardContent>
        </Card>)
    );
}
