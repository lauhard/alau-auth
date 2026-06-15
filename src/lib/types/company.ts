 /**
  * This file defines the types for the company module.
  * A company represents an organization that can have multiple users and is associated with a webapp.
  * The company data is stored in the better auth organization schema
  */
import type { Result } from "./result";

export interface CompanyMetadata {
    [key: string]: unknown;
}

export interface Company {
    id: string;
    name: string;
    slug: string;
    webappId: string;
    logo?: string;
    metadata?: CompanyMetadata;
    createdAt: Date;// Drizzle converts timestamp_ms to Date automatically.
}

export interface CompanyListItem {
    id: string;
    name: string;
    slug: string;
    webappId: string;
    createdAt: Date; // Drizzle converts timestamp_ms to Date automatically.
}

export type CompanyError = 'NOT_FOUND' |'SLUG_TAKEN' | 'CREATE_FAILED';
export type CompanyResult<T> = Result<T, CompanyError>;




