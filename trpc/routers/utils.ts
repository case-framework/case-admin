import { z } from "zod";

export const paginationSchema = z.object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).max(1000).default(50),
});

export const limitCurrentPage = (page: number, totalPages: number) => {
    return Math.min(Math.max(1, page), Math.max(1, totalPages));
}

export const hasPreviousPage = (page: number) => {
    return page > 1;
}

export const hasNextPage = (totalCount: number, page: number, limit: number) => {
    return totalCount > (page * limit);
}

export const getTotalPages = (totalCount: number, limit: number) => {
    return Math.ceil(totalCount / limit);
}