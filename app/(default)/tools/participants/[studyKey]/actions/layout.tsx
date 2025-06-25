import { Card } from "@/components/ui/card";
import ActionsSidebar from "./_components/actions-sidebar";
import SidebarToggleWithBreadcrumbs from "@/components/sidebar-toggle-with-breadcrumbs";
import { ActionsPageLinkContent } from "../../_components/breacrumbs-contents";

export default async function Layout(
    props: {
        children: React.ReactNode;
        params: Promise<{
            studyKey: string;
        }>;
    }
) {
    const params = await props.params;

    const {
        children
    } = props;

    return (
        <div className="overflow-y-scroll h-full pb-1 flex flex-col">
            <SidebarToggleWithBreadcrumbs
                breadcrumbs={[
                    {
                        href: "/tools/participants",
                        content: params.studyKey
                    },
                    {
                        content: <ActionsPageLinkContent />
                    }
                ]}
            />

            <Card
                className="flex h-fit mx-4 grow overflow-hidden"
                variant={"opaque"}
            >
                <ActionsSidebar
                    studyKey={params.studyKey}
                />
                <div className="overflow-y-auto">
                    {children}
                </div>
            </Card>
        </div>
    );
}
