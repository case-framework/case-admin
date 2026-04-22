import { PageLayout } from "@/components/common/page-layout";

interface PageProps { params: Promise<{ studyKey: string }> }
export default async function StudyFilesPage({ params }: PageProps) {
    const { studyKey } = await params;
    return <PageLayout title={`Files — ${studyKey}`} />;
}
