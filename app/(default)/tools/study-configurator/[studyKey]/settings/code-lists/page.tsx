import { Suspense } from "react";
import CodeListsOverview, { CodeListOverviewLoader } from "./_components/code-lists-overview";

export default async function Page(
    props: {
        params: Promise<{ studyKey: string }>;
    }
) {
    const params = await props.params;
    const studyKey = params.studyKey;
    return (
        <Suspense fallback={<CodeListOverviewLoader />}>
            <CodeListsOverview
                studyKey={studyKey}
            />
        </Suspense>
    );
}
