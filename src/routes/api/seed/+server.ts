import { json, error, type RequestHandler } from '@sveltejs/kit';
import { dbInit } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm/sql';

export const POST: RequestHandler = async ({ platform, locals }) => {
    const db = dbInit(platform);
    
    // Guard: nur ausführbar wenn noch kein platformAdmin existiert
    const existing = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.role, 'platformAdmin')
    });
    
    if (existing) {
        error(403, 'Platform Admin already exists');
    }

    const { auth } = locals;

    const result = await auth.api.signUpEmail({
        body: {
            email: 'admin@alau.at',
            password: 'admin123456',
            name: 'Platform Admin',
        },
    });

    await db.update(userTable)
        .set({ role: 'platformAdmin' })
        .where(eq(userTable.id, result.user.id));

    return json({ success: true, userId: result.user.id });
};