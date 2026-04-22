import { PageLayout } from "@/components/common/page-layout";

interface PageProps { params: Promise<{ studyKey: string }> }
export default async function StudyCodeListsPage({ params }: PageProps) {
    const { studyKey } = await params;
    return <PageLayout title={`Code Lists — ${studyKey}`} />;
}
