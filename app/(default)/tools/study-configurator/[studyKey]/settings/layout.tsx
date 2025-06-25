import SettingsNav from "./_components/SettingsNav";

export default async function Layout(
    props: {
        children: React.ReactNode;
        params: Promise<{
            studyKey: string;
        }>
    }
) {
    const params = await props.params;

    const {
        studyKey
    } = params;

    const {
        children
    } = props;

    return (
        <div className="flex gap-4">
            <SettingsNav
                studyKey={studyKey}
            />
            <>
                {children}
            </>
        </div>
    );
}
