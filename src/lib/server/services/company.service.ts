import type { Auth } from "$lib/betterauth/auth";
import { eq, type InferSelectModel } from "drizzle-orm";
import type { BaseDb } from "../db";
import { organization } from "../db/schema/auth";
import type { CreateCompanyData } from "$lib/validation/company";
import type { Result } from "$lib/types/result";
import type { Company, CompanyListItem } from "$lib/types/company";
import { mapToCompany, mapToCompanyListItem } from "./company.mapper";
import { APIError } from "better-auth";


export const createCompanyService = (db: BaseDb, auth: Auth) => {
    /**
     * Returns a list of companies. 
     * If a webappId is provided, it returns only the companies associated with that webappId.
     * @param webappId The ID of the webapp to filter companies by.
     * @returns A list of company list items.
     */
    const list = async (webappId?: string): Promise<CompanyListItem[]> => {
        const rows = webappId
            ? await db.select().from(organization).where(eq(organization.webappId, webappId))
            : await db.select().from(organization);
        return rows.map(mapToCompanyListItem);
    };

    /**
     * Returns a company by its slug.
     * @param slug The slug of the company to retrieve.
     * @returns The company result, which can be either a success with the company data or a failure with an error message and code.
     */
    const getBySlug = async (slug: string): Promise<Result<Company>> => {
        const [row] = await db
            .select()
            .from(organization)
            .where(eq(organization.slug, slug))
            .limit(1);

        if (!row) {
            return {
                success: false,
                error: "Company not found",
                code: "NOT_FOUND" as const,
            }
        }
        return {
            success: true,
            data: mapToCompany(row),
        }
    };

    /**
     * Returns a company by its ID.
     * @param id The ID of the company to retrieve.
     * @returns The company result, which can be either a success with the company data or a failure with an error message and code.
     */
    const getById = async (id: string): Promise<Result<Company>> => {
        const [row] = await db
            .select()
            .from(organization)
            .where(eq(organization.id, id))
            .limit(1);

        if (!row) {
            return {
                success: false,
                error: "Company not found",
                code: "NOT_FOUND" as const,
            }
        }
        return {
            success: true,
            data: mapToCompany(row),
        }
    };


    const create = async (input: CreateCompanyData, headers: Headers): Promise<Result<Company>> => {
        try {
            const existing = await getBySlug(input.slug);
            if (existing.success) {
                return { success: false, error: `Slug ${input.slug} is already taken`, code: 'SLUG_TAKEN' };
            }

            const result = await auth.api.createOrganization({
                body: {
                    name: input.name,
                    slug: input.slug,
                    logo: input.logo,
                    metadata: input.metadata,
                    webappId: input.webappId,
                },
                headers,
            });

            if (!result?.id) {
                return {
                    success: false,
                    error: "Better Auth returned no organization id",
                    code: "CREATE_FAILED",
                };
            }

            // Re-read the canonical Drizzle row — cleaner than mapping BA's
            // API result, which has slightly different field types.
            return await getById(result.id);

        } catch (error) {
            if (error instanceof APIError) {
                const code = error.body?.code;
                if (code === 'SLUG_TAKEN') {
                    return {
                        success: false,
                        error: `Slug ${input.slug} is already taken`,
                        code: 'SLUG_TAKEN'
                    };
                }

            }
            console.error("Failed to create company", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Failed to create company",
                code: "CREATE_FAILED"
            };
        }
    }
    return {
        list,
        getBySlug,
        getById,
        create,
    }
};

export type CompanyService = ReturnType<typeof createCompanyService>;
