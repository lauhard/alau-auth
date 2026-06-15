import { sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
} from "drizzle-orm/sqlite-core";

/**
 * Plan tiers for a customer account.
 * Exported as `as const` array so it can be reused for Zod validation,
 * Drizzle's enum type-narrowing, and the `CustomerPlan` TS type.
 *
 * Note: SQLite has no native ENUM constraint — Zod enforces this at the
 * application layer on every write. The Drizzle `enum` option below only
 * narrows the TypeScript type, it does not generate a CHECK constraint.
 */
export const CUSTOMER_PLANS = ["free", "pro", "enterprise"] as const;
export type CustomerPlan = typeof CUSTOMER_PLANS[number];

/**
 * `customer` — platform-wide, cross-tenant business identity.
 *
 * Represents the contractual partner (e.g. "Red Bull GmbH") that owns one or
 * more companies (Better Auth `organization`s) across one or more webapps.
 *
 * Customer is NOT auth-relevant. Auth state lives in `user`, `session`,
 * `account`, and `organization`. Customer holds Stammdaten only:
 * legal entity, country, contract contact, commercial plan.
 *
 * Global namespace — no `webappId`. One customer can map to multiple
 * companies in multiple webapps. The `organization` table will gain a
 * `customerId` FK in a subsequent story.
 */
export const customer = sqliteTable("customer", {
        id: text("id")
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        legalName: text("legal_name")
            .notNull(),
        displayName: text("display_name")
            .notNull(),
        contactName: text("contact_name"),
        contactEmail: text("contact_email"),
        country: text("country")
            .notNull(),
        registrationNumber: text("registration_number"),
        plan: text("plan", { enum: CUSTOMER_PLANS })
            .notNull()
            .default("free"),
        isActive: integer("is_active", { mode: "boolean" })
            .default(true)
            .notNull(),
        metadata: text("metadata", { mode: "json" })
            .$type<Record<string, unknown>>(),
        createdAt: integer("created_at", { mode: "timestamp_ms" })
            .notNull()
            .default(sql`(cast(unixepoch('subsecond')* 1000 as integer))`),
        updatedAt: integer("updated_at", { mode: "timestamp_ms" })
            .notNull()
            .default(sql`(cast(unixepoch('subsecond')* 1000 as integer))`)
            .$onUpdate(() => /* @__PURE__ */ new Date()),
    },
    (table) => [
        index("customer_name_idx").on(table.displayName),
        index("customer_country_idx").on(table.country),
        index("customer_plan_idx").on(table.plan),
    ]
)