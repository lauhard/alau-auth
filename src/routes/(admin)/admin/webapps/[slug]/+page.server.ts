// src/routes/(admin)/admin/webapps/[slug]/+page.server.ts
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { dbInit } from '$lib/server/db';
import { createWebappService } from '$lib/server/services/webapp.service';

export const load: PageServerLoad = async ({ params, platform }) => {
    // Validate slug format before even hitting the DB
    const db = dbInit(platform);
    const service = createWebappService(db);
    const result = await service.getBySlug(params.slug);

    if (!result.success) {
        throw error(404, 'Webapp nicht gefunden');
    }

    return { webapp: result.data };
};