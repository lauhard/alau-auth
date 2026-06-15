/**
 * Generic sort direction. Used by every list/query operation.
 */
export const SORT_ORDERS = ["asc", "desc"] as const;
export type SortOrder = typeof SORT_ORDERS[number];

/**
 * Paginated response envelope for list operations.
 *
 * `total` is the unfiltered count after where-clauses but before
 * limit/offset — used by clients to render pagination controls.
 */
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    limit: number;
    offset: number;
}