
// event holen mit getRequestEvent()
// init the the database 

import { command, getRequestEvent, query, requested } from "$app/server";
import { dbInit } from "$lib/server/db";
import { createWebappService } from "$lib/server/services/webapp.service";
import { createWebappSchema, listWebappsSchema, updateWebappInputSchema, updateWebappSchema, webappIdSchema, webappSlugSchema } from "$lib/validation/webapp";
import { error } from "@sveltejs/kit";

// init the webapp service (repo)
const getService = () => {
    const event = getRequestEvent();
    const db = dbInit(event.platform);
    return createWebappService(db);
}

export const listWebapps = query(
    listWebappsSchema,
    async (_input) => {
        const service = getService();
        return await service.list();
    }
);

export const getWebapp = query(
    // use schema
    webappSlugSchema,
    async ({ slug }) => {
        const service = getService();
        const result = await service.getBySlug(slug);
        if (!result.success) {
            if (result.code === 'NOT_FOUND') {
                throw error(404, result.error || "Webapp not found");
            } else {
                throw error(400, result.error || "Failed to get webapp");
            }
        }
        return result.data
    }
);

export const createWebapp = command(
    createWebappSchema,
    async (input) => {
        const service = getService();
        const result = await service.create(input);
        if (!result.success) {
            if (result.code === 'DUPLICATE') {
                throw error(409, result.error || "Webapp with this slug or domain already exists");
            }
            else {
                throw error(400, result.error || "Failed to create webapp");
            }
        }
        return result.data;
    }
);

export const updateWebapp = command(
    updateWebappInputSchema,
    async ({ id, ...input }) => {
        const service = getService();
        const result = await service.update(id, input);
        if (!result.success) {
            if (result.code === 'NOT_FOUND') {
                throw error(404, result.error || "Webapp not found");
            } else {
                throw error(400, result.error || "Failed to update webapp");
            }
        }
        return result.data;
    }
);

export const deactivateWebapp = command(
    webappIdSchema,
    async ({ id }) => {
        const service = getService();
        const result = await service.deactivate(id);
        if (!result.success) {
            if (result.code === 'NOT_FOUND') {
                throw error(404, result.error || "Webapp not found");
            } else {
                throw error(400, result.error || "Failed to deactivate webapp");
            }
        }
        return result.data;
    }
);