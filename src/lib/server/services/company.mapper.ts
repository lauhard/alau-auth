import type { InferSelectModel } from "drizzle-orm";
import type { organization } from "../db/schema/auth";
import type { Company, CompanyListItem, CompanyMetadata } from "$lib/types/company";

/***************** Mapper *****************
 * The company service uses the better auth organization as company. 
 * The following mapper functions map the better auth organization schema to the company interface.
 * This way we can keep the better auth organization schema and the company interface separate and independent from each other.
 * The service functions will use the mappers to convert the data from the database to the company interface and vice versa.
 *****************************************/

/**
 * Internal database row type for the `organization` table.
 *
 * This type is derived from the Drizzle schema and stays internal to the
 * service layer. Callers never see it — they receive `Company` or
 * `CompanyListItem` DTOs instead.
 */
type Organization = InferSelectModel<typeof organization>;


/**
 * Maps a database row from the organization table to the Company interface.
 * Conversions:
 * logo: if null or undefined, becomes undefined (optional in Company)
 * metadata: if present, is parsed from JSON string to CompanyMetadata object;
 * createdAt: Unix milliseconds (number) to Date 
 * @param row The database row from the organization table.
 * @returns The mapped Company interface.
 */
export const mapToCompany = (row: Organization): Company => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    webappId: row.webappId,
    logo: row.logo ?? undefined,
    metadata: row.metadata ? (JSON.parse(row.metadata) as CompanyMetadata) : undefined,
    createdAt: row.createdAt instanceof Date ? row.createdAt : new Date(row.createdAt),
});
/**
 * Maps a database row from the organization table to the CompanyListItem interface.
 * This is used for the list function, where we only need a subset of the company data.
 * @param row The database row from the organization table.
 * @returns The mapped CompanyListItem interface.
 */
export const mapToCompanyListItem = (row: Organization): CompanyListItem => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    webappId: row.webappId,
    createdAt: row.createdAt instanceof Date ? row.createdAt : new Date(row.createdAt),
});