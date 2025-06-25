import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPermissions, getServiceAccount, getServiceAccountAPIKeys } from "@/lib/data/service-accounts";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import ServiceAccountInfos from "./_components/service-account-infos";
import ApiKeys from "./_components/api-keys";
import DeleteServiceAccount from "./_components/delete-service-account";
import ServiceAccountPermissions from "./_components/service-account-permissions";

export default async function Page(
    props: {
        params: Promise<{
            serviceAccountID: string;
        }>;
    }
) {
    const params = await props.params;
    const serviceAccountID = params.serviceAccountID;

    const [
        serviceAccountResp,
        apiKeysResp,
        permissionsResp,
    ] = await Promise.all([
        getServiceAccount(serviceAccountID),
        getServiceAccountAPIKeys(serviceAccountID),
        getPermissions(serviceAccountID),
    ]);

    return (
        <div className="space-y-6">
            <div className="flex" >
                <Card
                    variant={"opaque"}
                    className="p-1"
                >
                    <Button
                        variant={"ghost"}
                        asChild
                    >
                        <Link
                            prefetch={false}
                            href={`/tools/user-management/service-accounts`}
                        >
                            <ArrowLeftIcon className="size-5 me-1" />
                            Back
                        </Link>
                    </Button>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ServiceAccountInfos
                    serviceAccount={serviceAccountResp.serviceAccount}
                    error={serviceAccountResp.error}
                />

                <ApiKeys
                    serviceAccountId={serviceAccountID}
                    apiKeys={apiKeysResp.apiKeys}
                    error={apiKeysResp.error}
                />
            </div>
            <ServiceAccountPermissions
                serviceAccountID={serviceAccountID}
                permissions={permissionsResp.permissions}
                error={permissionsResp.error}
            />
            <DeleteServiceAccount
                serviceAccountID={serviceAccountID}
            />
        </div>
    );
}
