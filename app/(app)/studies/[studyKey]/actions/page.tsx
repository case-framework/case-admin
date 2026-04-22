import { PageLayout } from "@/components/common/page-layout";

interface PageProps { params: Promise<{ studyKey: string }> }
export default async function StudyActionsPage({ params }: PageProps) {
    const { studyKey } = await params;
    return <PageLayout title={`Actions — ${studyKey}`} />;
}
