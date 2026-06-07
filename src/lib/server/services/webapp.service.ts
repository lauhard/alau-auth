import { eq } from "drizzle-orm";
import type { BaseDb } from "../db";
import { webapp } from "../db/schema";
import type { Webapp, WebappListItem, WebappResult } from "$lib/types/webapp";
import type { CreateWebappData, UpdateWebappData } from "$lib/validation/webapp";
import type { Result } from "$lib/types/result";

export const createWebappService = (db: BaseDb) => {
    const list = async (): Promise<WebappListItem[]> => {
        const rows = await db
            .select({
                id: webapp.id,
                name: webapp.name,
                slug: webapp.slug,
                domain: webapp.domain,
                isActive: webapp.isActive,
                createdAt: webapp.createdAt,
            })
            .from(webapp);
        return rows;
    };

    const getBySlug = async (slug: string): Promise<WebappResult<Webapp>> => {
        const [row] = await db
            .select()
            .from(webapp)
            .where(eq(webapp.slug, slug))
            .limit(1);
        if (!row) {
            return { success: false, error: "Webapp not found", code: "NOT_FOUND" };
        }
        return { success: true, data: row as Webapp };
    };

    const getById = async (id: string): Promise<WebappResult<Webapp>> => {
        const [row] = await db
            .select()
            .from(webapp)
            .where(eq(webapp.id, id))
            .limit(1);
        if (!row) {
            return { success: false, error: "Webapp not found", code: "NOT_FOUND" };
        }
        return { success: true, data: row as Webapp };
    };

    const create = async (input: CreateWebappData): Promise<WebappResult<Webapp>> => {
        // Check for duplicate slug or domain
        const [slugConflict] = await db
            .select({ id: webapp.id })
            .from(webapp)
            .where(eq(webapp.slug, input.slug))
            .limit(1);
        if (slugConflict) {
            return { success: false, error: 'Slug already in use', code: 'DUPLICATE' };
        }

        const [domainConflict] = await db
            .select({ id: webapp.id })
            .from(webapp)
            .where(eq(webapp.domain, input.domain))
            .limit(1);
        if (domainConflict) {
            return { success: false, error: 'Domain already in use', code: 'DUPLICATE' };
        }

        const [created] = await db
            .insert(webapp)
            .values(input)
            .returning();
        return { success: true, data: created as Webapp };
    };

    const update = async (id: string, input: UpdateWebappData): Promise<WebappResult<Webapp>> => {
        // Check if webapp exists
        const [existing] = await db
            .select({ id: webapp.id })
            .from(webapp)
            .where(eq(webapp.id, id))
            .limit(1);
        if (!existing) {
            return { success: false, error: "Webapp not found", code: "NOT_FOUND" };
        }

        // Check for duplicate  domain if they are being updated
        if (input.domain) {
            const [conflict] = await db
                .select({ id: webapp.id })
                .from(webapp)
                .where(eq(webapp.domain, input.domain))
                .limit(1);

            if (conflict && conflict.id !== id) {
                return { success: false, error: 'Domain already in use', code: 'DUPLICATE' };
            }
        }

        // Filter out undefined values — only update what's provided
        const updates = Object.fromEntries(
            Object.entries(input).filter(([, v]) => v !== undefined)
        );

        if (Object.keys(updates).length === 0) {
            return await getById(id);
        }

        const [updated] = await db
            .update(webapp)
            .set({ ...updates, updatedAt: new Date() })
            .where(eq(webapp.id, id))
            .returning();

        return { success: true, data: updated as Webapp };
    };

    const deactivate = async (id: string): Promise<WebappResult<Webapp>> => {
        const [deactivated] = await db
            .update(webapp)
            .set({ isActive: false })
            .where(eq(webapp.id, id))
            .returning();

        if (!deactivated) {
            return { success: false, error: "Webapp not found", code: "NOT_FOUND" };
        }

        return { success: true, data: deactivated as Webapp };
    }

    return {
        list,
        getBySlug,
        getById,
        create,
        update,
        deactivate,
    };
};
