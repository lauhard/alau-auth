import { z } from "zod";

const hexColor = z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/, "Invalid hex color format");

const httpsUrl = z
    .url()
    .refine((url) => url.startsWith("https://"), {
        message: "URL must start with https://",
    });

export const listWebappsSchema = z.object({}).optional();
export type ListWebappsData = z.infer<typeof listWebappsSchema>;

export const webappSettingsSchema = z
    .object({
        primaryColor: hexColor.optional(),
        logoUrl: httpsUrl.optional(),
        appName: z.string().optional(),
        footerText: z.string().optional(),
    })
    .strict();

export const createWebappSchema = z
    .object({
        name: z
            .string()
            .min(3, "Name is required")
            .max(50, "Name must be less than 50 characters"),
        slug: z
            .string()
            .min(3, "Slug is required"),
        domain: z
            .string()
            .min(3, "Domain is required")
            .max(50, "Domain must be less than 50 characters")
            .regex(/^([a-z0-9-]+\.)+[a-z]{2,}$/, 'Must be a valid domain (e.g. www.example.com)'),
        authBasePath: z
            .string()
            .startsWith("/", "Auth base path must start with '/'")
            .default("/auth"),
        callbackUrl: httpsUrl,
        logoutCallbackUrl: httpsUrl.optional(),
        settings: webappSettingsSchema.optional(),
    })
    .strict();

export type CreateWebappData = z.infer<typeof createWebappSchema>;

export const updateWebappSchema = z
    .object({
        name: z
            .string()
            .min(3, "Name is required")
            .max(50, "Name must be less than 50 characters"),
        domain: z
            .string()
            .min(3, "Domain is required")
            .max(50, "Domain must be less than 50 characters")
            .regex(/^([a-z0-9-]+\.)+[a-z]{2,}$/, 'Must be a valid domain (e.g. www.example.com)')
            .optional(),
        authBasePath: z
            .string()
            .startsWith("/", "Auth base path must start with '/'")
            .optional(),
        callbackUrl: httpsUrl.optional(),
        logoutCallbackUrl: httpsUrl.nullable().optional(),
        settings: webappSettingsSchema.nullable().optional(),
    })
    .strict();
export type UpdateWebappData = z.infer<typeof updateWebappSchema>;


export const updateWebappInputSchema = updateWebappSchema.extend({
    id: z.uuid()
});
export type UpdateWebappInputData = z.infer<typeof updateWebappInputSchema>;

export const webappSlugSchema = z.object({
    slug: z
        .string()
        .min(3, "Slug is required")
        .max(50, "Slug must be less than 50 characters")
});
export type WebappSlugData = z.infer<typeof webappSlugSchema>;

export const webappIdSchema = z.object({
    id: z.uuid()
})
export type WebappIdData = z.infer<typeof webappIdSchema>;

