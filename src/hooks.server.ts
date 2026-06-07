import type { Handle } from '@sveltejs/kit';
import { building } from '$app/environment';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { sequence } from '@sveltejs/kit/hooks';
import { dbInit } from '$lib/server/db';
import { createAuth } from '$lib/betterauth/auth';

const handleBetterAuth: Handle = async ({ event, resolve }) => {

	if (building) return resolve(event);

	// create DB (D1 or local)
	const db = dbInit(event.platform)
	event.locals.auth = createAuth(db, event.platform!.env);

	const { auth } = event.locals;
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user;
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = sequence(handleBetterAuth);
