import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins/admin';
import { bearer } from 'better-auth/plugins/bearer';
import { magicLink } from 'better-auth/plugins/magic-link';
import { organization } from 'better-auth/plugins/organization';
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
	plugins: [
		admin({
			defaultRole: 'user',
			adminRole: 'platformAdmin',
		}),
		organization({
			teams: { enabled: true },
		}),
		magicLink({
			sendMagicLink: async () => {},
		}),
		bearer(),
	],
});