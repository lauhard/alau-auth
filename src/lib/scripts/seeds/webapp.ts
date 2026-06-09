import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '$lib/server/db/schema';

const sqlite = new Database('local.db');
sqlite.pragma('foreign_keys = ON');
const db = drizzle(sqlite, { schema });

await db.insert(schema.webapp).values({
    id: crypto.randomUUID(),
    name: 'Test Webapp',
    slug: 'test-webapp',
    domain: 'test.example.com',
    authBasePath: '/auth',
    callbackUrl: 'https://test.example.com/auth/callback',
    settings: {},
    isActive: true,
});

console.log('Seeded webapp');
sqlite.close();