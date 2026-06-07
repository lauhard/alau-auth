import type { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core";
import type { Platform } from "../../../app";
import { d1 } from "./d1";
import { local } from "./local";
import * as schema from "./schema";
import { isDev } from "$lib/utils/env";

type DbSchema = typeof schema
export type BaseDb = BaseSQLiteDatabase<DbMode, DbDriverResult, DbSchema>;
export type LocalDb = ReturnType<typeof local>;
export type D1Db = ReturnType<typeof d1>;

export const dbInit = (platform: Platform): BaseDb => {
    console.log("DB Init:", isDev ? "Local" : "D1");
    return isDev ? local(platform) : d1(platform);
}
