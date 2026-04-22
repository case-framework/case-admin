import { DatabaseIndexesView } from "@/components/features/database-indexes/database-indexes-view";
import { requiredAdminAuth } from "@/lib/auth/utils";

export default async function DatabaseIndexesPage() {
    await requiredAdminAuth();
    return <DatabaseIndexesView />;
}
