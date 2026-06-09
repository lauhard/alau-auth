import { getRequestEvent } from '$app/server';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { admin } from 'better-auth/plugins/admin';
import { bearer } from 'better-auth/plugins/bearer';
import { magicLink } from 'better-auth/plugins/magic-link';
import { organization } from 'better-auth/plugins/organization';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from 'process';

// CLI-only auth config for Better Auth schema generation.
export const auth = betterAuth({
	database: drizzleAdapter({} as never, {
		provider: 'sqlite',
	}),
	baseURL: 'http://localhost:5173',
	secret: env.BETTER_AUTH_SECRET,
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			webappId: {
				type: 'string',
				required: false,
				input: false,
			},
		},
	},

	hooks: {
		before: createAuthMiddleware(
			async (ctx) => {

				if (ctx.path !== "/organization/create") return;
				const body = ctx.body as { slug?: string; webappId?: string } | undefined;
				const slug = body?.slug;
				const webappId = body?.webappId;

				// If either is missing, let BA's own validation handle it
				if (!slug || !webappId) return;

				const existing = await ctx.context.adapter.findOne({
					model: 'organization',
					where: [
						{ field: 'slug', value: slug },
						{ field: 'webappId', value: webappId },
					],
				});

				if (existing) {
					throw new APIError('CONFLICT', {
						message: `Slug "${slug}" is already taken in this webapp`,
						// ts-expect-error — BA's APIError body is typed as `message: string` only,
						// but the runtime passes the full object through. Service catches on `code`.
						code: 'SLUG_TAKEN',
					});
				}

			}
		),
	},

	plugins: [
		admin({
			defaultRole: 'user',
			adminRole: ['admin', 'platformAdmin'],
		}),

		organization({
			schema: {
				organization: {
					additionalFields: {
						webappId: {
							type: "string",
							input: true,
							required: true,
						},
					},
				},
			},
			teams: { enabled: true },
			allowUserToCreateOrganization: false,
		}),

		magicLink({
			sendMagicLink: async ({ email, url }) => {
				console.log(`[DEV] Magic link for ${email}: ${url}`);
			},
		}),

		bearer(),

		// MUST be last — needs getRequestEvent to set cookies in server-side calls
		sveltekitCookies(getRequestEvent),
	],
});