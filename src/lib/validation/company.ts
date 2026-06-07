import { z } from 'zod';

export const createCompanySchema = z.object({
    name: z.string().min(1, 'Company name is required'),
    slug: z.string().min(2).max(50).regex(/^[a-z0-9-]+$/, {
        message: 'Nur Kleinbuchstaben, Zahlen und Bindestriche erlaubt',
    }),
    webappId: z.uuid(),
    logo: z.url().optional(),
    metadata: z.record(z.string(), z.unknown()).optional(),
}).strict();
export type CreateCompanyData = z.infer<typeof createCompanySchema>;

export const listCompaniesSchema = z.object({
  webappId: z.uuid().optional(),
}).strict();
export type ListCompaniesData = z.infer<typeof listCompaniesSchema>;

export const companySlugSchema = z.object({
    slug: z.string(),
    webappId: z.uuid(),
}).strict();
export type CompanySlugData = z.infer<typeof companySlugSchema>;

export const companyIdSchema = z.object({
    id: z.uuid(),
}).strict();
export type CompanyIdData = z.infer<typeof companyIdSchema>;