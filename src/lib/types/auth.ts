export interface BetterAuthError {
    message: string;
    code?: string;
    status?: number;
}
export type UserRole = 'user' | 'admin' | 'platformAdmin';