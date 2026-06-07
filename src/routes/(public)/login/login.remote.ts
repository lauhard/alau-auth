import { command, form, getRequestEvent } from "$app/server";
import type { BetterAuthError } from "$lib/types/auth";
import type { Result } from "$lib/types/result";
import { loginSchema } from "$lib/validation/auth";
import { redirect } from "@sveltejs/kit";

const getService = () => {
    const event = getRequestEvent();
    const {auth} = event.locals;
    return {
        auth: auth,
        headers: event.request.headers
    }
}

export const loginWithPassword = command(
    loginSchema,
    async ({ email, password }) => {
        const service = getService();
        const result = await service.auth.api.signInEmail({
            body: {
                email,
                password
            },
            headers: {
                ...service.headers
            },
            asResponse: true
        });

        if (!result.ok) {
            const errorData = await result.json() as BetterAuthError;
            return {
                success: false,
                error: errorData.message || "Login failed",
                code: errorData.code || "LOGIN_FAILED"
            } satisfies Result<never>;
        }

        return {
            success: true,
        } satisfies Result<null>;
    }
);