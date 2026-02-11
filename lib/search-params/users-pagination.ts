import { useQueryStates } from "nuqs";
import { parseAsInteger } from "nuqs/server";

export const usersPaginationFilter = {
    page: parseAsInteger.withDefault(1),
    limit: parseAsInteger.withDefault(25),
};

export const useUsersPagination = () => {
    return useQueryStates(usersPaginationFilter, {
        shallow: true,
        clearOnDefault: true,
    });
}

export type UsersPaginationFilter = typeof usersPaginationFilter;
