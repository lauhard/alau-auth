import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from '$lib/server/db/schema';

const sqlite = new Database('local.db');
const db = drizzle(sqlite, { schema });

await db.insert(schema.webapp).values({
    id: crypto.randomUUID(),
    name: 'Test Webapp',
    slug: 'test-webapp',
    domain: 'test.example.com',
    callbackUrl: 'https://test.example.com/auth/callback',
    createdAt: new Date(),
    updatedAt: new Date(),
});

console.log('Seeded webapp');
sqlite.close();