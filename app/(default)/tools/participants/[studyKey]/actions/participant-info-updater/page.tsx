import ParticipantInfoUpdater from "./_components/participant-info-updater";

export default async function Page(
    props: {
        params: Promise<{
            studyKey: string;
        }>
    }
) {
    const params = await props.params;
    return (
        <div>
            <ParticipantInfoUpdater
                studyKey={params.studyKey}
            />
        </div>
    );
}
