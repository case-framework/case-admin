import StudyDashboard from "./_components/StudyDashboard";

export interface StudyKeyPageParams {
    params: Promise<{
        studyKey: string
    }>
}

export const dynamic = 'force-dynamic';


export default async function Page(props: StudyKeyPageParams) {
    return (
        (<StudyDashboard
            studyKey={(await props.params).studyKey}
        />)
    );
}
