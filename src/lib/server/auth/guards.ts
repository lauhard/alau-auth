import type { User } from "$lib/betterauth/auth";
import { error } from "@sveltejs/kit";

export const requirePlatformAdmin = (user: User | undefined) => {
    if (!user || user.role !== "platformAdmin") {
        throw error(403, { message: 'Keine Berechtigung'});
    }
}

export const requireAuth = (user: User | undefined) => {
    if (!user) {
        throw error(401, { message: 'Nicht authentifiziert'});
    }
}