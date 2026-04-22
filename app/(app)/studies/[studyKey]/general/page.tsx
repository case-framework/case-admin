import { PageLayout } from "@/components/common/page-layout";

interface PageProps { params: Promise<{ studyKey: string }> }
export default async function StudyGeneralPage({ params }: PageProps) {
    const { studyKey } = await params;
    return <PageLayout title={`General — ${studyKey}`} />;
}
