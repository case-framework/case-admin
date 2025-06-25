import { Suspense } from "react";
import PermissionsCard, { PermissionsCardSkeleton } from "./_components/PermissionsCard";
import { StudyKeyPageParams } from "../../page";

export const dynamic = 'force-dynamic';

export default async function Page(props: StudyKeyPageParams) {

    return (
        (<Suspense fallback={<PermissionsCardSkeleton />}>
            <PermissionsCard
                studyKey={(await props.params).studyKey}
            />
        </Suspense>)
    );
}
