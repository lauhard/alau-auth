import type { Result } from "./result";

/**
 * Customer plan tiers.
 *
 * Order matters for tier comparisons (free < pro < enterprise).
 * Adding a new tier: append to the array — never insert in the middle,
 * never reorder. This preserves ordinal semantics for any future
 * `isAtLeast(plan, "pro")` helpers.
 */
export const CUSTOMER_PLANS = ["free", "pro", "enterprise"] as const;
export type CustomerPlan = typeof CUSTOMER_PLANS[number];

/**
 * Fields the customer list can be sorted by.
 *
 * Whitelist enforced at Zod validation layer (rejects malicious input).
 * Service layer maps these symbolic names to actual Drizzle columns —
 * direct user input never touches an ORDER BY clause.
 */
export const CUSTOMER_SORT_FIELDS = [
    "createdAt",
    "legalName",
    "displayName",
    "country",
    "plan",
] as const;
export type CustomerSortField = typeof CUSTOMER_SORT_FIELDS[number];

/**
 * Status filter for customer listing.
 *
 * - `active`:   isActive = true (default — what admins normally want to see)
 * - `inactive`: isActive = false (soft-deleted records, for audit/recovery)
 * - `all`:      no isActive filter applied
 *
 * Not stored in DB — this is a query-time concept that maps to a
 * boolean filter or no filter at the service layer.
 */
export const CUSTOMER_STATUS_FILTERS = ["active", "inactive", "all"] as const;
export type CustomerStatusFilter = typeof CUSTOMER_STATUS_FILTERS[number];

/**
 * Customer types instead of inferred from DB schema because:
 * The Customer interface is used instead of Infer<typeof customer> to be decoupled from the Drizzle schema. 
 * This allows us to evolve the database schema (e.g. add new fields) without affecting the service layer or API contracts, 
 * as long as we maintain the same shape for the existing fields.
 */

/**
 * Customer — platform-wide contractual entity.
 * Customer represents the contractual partner (e.g. "Red Bull GmbH") that owns one or
 * more companies (Better Auth `organization`s) across one or more webapps.
 */
export interface Customer {
    id: string;
    legalName: string;
    displayName: string;
    contactName: string | null;
    contactEmail: string | null;
    country: string;
    registrationNumber: string | null;
    plan: CustomerPlan;
    isActive: boolean;
    metadata: Record<string, unknown> | null;
    createdAt: Date;
    updatedAt: Date;
}

/**
 * CustomerListItem - is a subset of Customer fields used for 
 * listing customers in the admin panel.
 * Compact projection for list views (tables, dropdowns).
 */
export interface CustomerListItem {
    id: string;
    legalName: string;
    displayName: string;
    country: string;
    plan: CustomerPlan;
    isActive: boolean;
    createdAt: Date;
}

export type CustomerError = 
    | 'NOT_FOUND' 
    | 'VALIDATION'
    | 'ALREADY_INACTIVE'
    | 'ALREADY_ACTIVE';
export type CustomerResult<T> = Result<T, CustomerError>;