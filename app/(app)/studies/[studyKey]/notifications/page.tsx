import { PageLayout } from "@/components/common/page-layout";

interface PageProps { params: Promise<{ studyKey: string }> }
export default async function StudyNotificationsPage({ params }: PageProps) {
    const { studyKey } = await params;
    return <PageLayout title={`Notifications — ${studyKey}`} />;
}
