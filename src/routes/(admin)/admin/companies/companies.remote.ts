import { command, getRequestEvent, query } from "$app/server"
import { requirePlatformAdmin } from "$lib/server/auth/guards";
import { dbInit } from "$lib/server/db"
import { createCompanyService } from "$lib/server/services/company.service";
import type { Company, CompanyListItem } from "$lib/types/company";
import { createCompanySchema, listCompaniesSchema } from "$lib/validation/company";
import { error } from "@sveltejs/kit";


const getService = () => {
    // get the request event
    const event = getRequestEvent();
    const { platform } = event;
    const db = dbInit(platform);
    const auth = event.locals.auth;
    return {
        service: createCompanyService(db, auth),
        event: getRequestEvent()
    };
}

export const listCompanies = query(
    listCompaniesSchema,
    async ({ webappId }): Promise<CompanyListItem[]> => {
        const { service, event } = getService();
        requirePlatformAdmin(event.locals.user);
        return await service.list(webappId);
    }
)

export const createCompany = command(
    createCompanySchema,
    async (companyData): Promise<Company> => {
        const { service, event } = getService();
        const { user } = event.locals;
        requirePlatformAdmin(user);
        const headers = event.request.headers;
        const result = await service.create(companyData, headers);
        if (!result.success) {
            if (result.code === 'SLUG_TAKEN') {
                throw error(409, result.error || "Slug is already taken");
            }
            else {
                throw error(400, result.error || "Failed to create company");
            }
        }
        return result.data;
    }
);