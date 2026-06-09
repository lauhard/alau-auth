import { json, error, type RequestHandler } from '@sveltejs/kit';
import { dbInit } from '$lib/server/db';
import { user as userTable, account as accountTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const POST: RequestHandler = async ({ platform, locals }) => {
    const db = dbInit(platform);
    const { auth } = locals;

    // Guard: nur ausführbar wenn noch kein platformAdmin existiert
    const existing = await db.query.user.findFirst({
        where: eq(userTable.role, 'platformAdmin')
    });
    if (existing) error(403, 'Platform Admin already exists');

    // Bootstrap: direct insert — bypasses signUpEmail to atomically
    // satisfy the user_webapp_id_check constraint (role set on INSERT,
    // not via UPDATE afterwards).
    const adminId = crypto.randomUUID();
    
    // Use Better Auth's internal password hasher to stay compatible
    // with the rest of the auth flow (credential login will work).
    const context = await auth.$context;
    const passwordHash = await context.password.hash('admin123456');

    await db.transaction(async (tx) => {
        await tx.insert(userTable).values({
            id: adminId,
            name: 'Platform Admin',
            email: 'admin@alau.at',
            emailVerified: true,
            role: 'platformAdmin',
            // webappId stays null — allowed because role = 'platformAdmin'
        });

        await tx.insert(accountTable).values({
            id: crypto.randomUUID(),
            accountId: adminId,
            providerId: 'credential',
            userId: adminId,
            password: passwordHash,

        });
    });

    return json({ success: true, userId: adminId });
};