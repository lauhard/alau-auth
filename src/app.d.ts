import type { Auth, User, Session } from '$lib/betterauth/auth';

// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Platform {
			env: Env;
			ctx: ExecutionContext;
			caches: CacheStorage;
			cf?: IncomingRequestCfProperties
		}

		interface Locals {
			user?: User;
			session?: Session;
			auth: Auth
		}
		interface Error {
			message: string;
			code?: string;
		}
		// interface PageData {}
		// interface PageState {}
	}
}

export {Locals, Platform} from './app';