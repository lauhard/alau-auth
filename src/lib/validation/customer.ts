import { CUSTOMER_PLANS } from '$lib/server/db/schema';
import { SORT_ORDERS } from '$lib/types/common';
import { CUSTOMER_SORT_FIELDS, CUSTOMER_STATUS_FILTERS } from '$lib/types/customer';
import { z } from 'zod';
import { emptyToUndefined } from './common';

/**
 * Local helper: normalize empty/whitespace-only strings to undefined.
 *
 * HTML form inputs submit `""` for "field left blank", but the
 * domain semantic is "no value provided" — which should map to SQL
 * NULL via undefined. This preprocess step bridges that gap before
 * the inner validator runs.
 *
 * Without this, `z.email().optional()` would reject `""` as invalid
 * email, breaking forms where the email field is genuinely optional.
 */


export const customerIdSchema = z.uuid("Customer ID must be a valid UUID");
export type CustomerIdData = z.infer<typeof customerIdSchema>;

export const createCustomerSchema = z.object({
    legalName: z.string()
        .min(1, "Legal name is required"),
    displayName: z.string()
        .min(1, "Display name is required"),
    contactName: z.preprocess(
        emptyToUndefined,
        z.string().trim().optional()
    ),
    contactEmail: z.preprocess(
        emptyToUndefined,
        z.email("Contact email must be a valid email address").optional()
    ),
    country: z.string()
        .length(2, "Country is required")
        .uppercase("Country must be a valid ISO 3166-1 alpha-2 code"),
    registrationNumber: z.preprocess(
        emptyToUndefined,
        z.string().trim().optional()
    ),
    plan: z.enum(CUSTOMER_PLANS)
        .default("free"),
    metadata: z.record(z.string(), z.unknown())
        .optional()
}).strict();
export type CreateCustomerData = z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = z.object({
    legalName: z.string()
        .trim()
        .min(1, "Legal name is required")
        .optional(),
    displayName: z.string()
        .trim()
        .min(1, "Display name is required")
        .optional(),
    contactName: z.preprocess(
        emptyToUndefined,
        z.string().trim().optional()
    ),
    contactEmail: z.preprocess(
        emptyToUndefined,
        z.email("Contact email must be a valid email address").optional()
    ),
    country: z.string()
        .length(2, "Country must be a valid ISO 3166-1 alpha-2 code")
        .uppercase("Country must be a valid ISO 3166-1 alpha-2 code")
        .optional(),
    registrationNumber: z.preprocess(
        emptyToUndefined,
        z.string().trim().optional()
    ),
    plan: z.enum(CUSTOMER_PLANS)
        .optional(),
    metadata: z.record(z.string(), z.unknown())
        .nullable()
        .optional()
}).strict()
    // refine after strict because strict returns a zod object. refine generates a zod effect.
    // Zod effects used for transformations etc..  
    .refine((data) => {
        // At least one field must be provided for update
        return Object.keys(data).length > 0;
    }, {
        message: "At least one field must be provided for update",
    });
export type UpdateCustomerData = z.infer<typeof updateCustomerSchema>;

export const updateCustomerInputSchema = z.object({
    id: customerIdSchema,
    data: updateCustomerSchema,
}).strict();
export type UpdateCustomerInput = z.infer<typeof updateCustomerInputSchema>;
export type UpdateCustomerInputData = z.infer<typeof updateCustomerInputSchema>;


export const listCustomerSchema = z.object({
    limit: z.number()
        .int()
        .min(1, "Limit must be at least 1")
        .max(100, "Limit cannot exceed 100")
        .optional(),
    offset: z.number()
        .int()
        .min(0, "Offset must be at least 0")
        .optional(),
    plan: z.enum(CUSTOMER_PLANS)
        .optional(),
    country: z.string()
        .length(2, "Country must be a valid ISO 3166-1 alpha-2 code")
        .uppercase("Country must be a valid ISO 3166-1 alpha-2 code")
        .optional(),
    status: z.enum(CUSTOMER_STATUS_FILTERS)
        .default("active"),
    // Search — case-insensitive substring match on legalName + displayName.
    // Service layer is responsible for the LOWER(...) LIKE comparison.
    search: z.preprocess(
        emptyToUndefined,
        z.string().trim().optional()
    ),
    sortBy: z.enum(CUSTOMER_SORT_FIELDS)
        .default("createdAt"),
    sortOrder: z.enum(SORT_ORDERS)
        .default("desc"),
}).strict();
export type ListCustomerData = z.infer<typeof listCustomerSchema>;