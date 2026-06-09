import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from '../schema/index.ts';
import type { Platform } from '../../../../app';


export const local = (platform: Platform): ReturnType<typeof drizzle<typeof schema>> => {
    const client = new Database(platform.env.DATABASE_URL);
    client.pragma('foreign_keys = ON');
    return drizzle(client, {schema} );
}