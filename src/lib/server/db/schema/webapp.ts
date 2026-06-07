import { relations, sql } from "drizzle-orm";
import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

/**
 * Branding and configuration for the hosted login page.
 * Validated via Zod on application level — no customCss to prevent XSS.
 */
export interface WebappSettings {
  primaryColor?: string;  // Hex color, e.g. "#4f46e5"
  logoUrl?: string;       // URL to company logo (client-side rendering only)
  appName?: string;       // Display name override for login page
  footerText?: string;    // Custom footer text
}

export const webapp = sqliteTable("webapp", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    domain: text("domain").notNull(),
    authBasePath: text("auth_base_path")
        .notNull()
        .default("/auth"),
    callbackUrl: text("callback_url").notNull(),
    settings: text("settings", { mode: "json" })
        .notNull().default("{}")
        .$type<WebappSettings>(),
    isActive: integer("is_active", { mode: "boolean" })
        .default(true)
        .notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
        .notNull(),
}
    // Indexes
        , (table) => [
            uniqueIndex("webapp_slug_uidx").on(table.slug),
            uniqueIndex("webapp_domain_uidx").on(table.domain),
    ]
);
