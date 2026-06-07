import adapter from '@sveltejs/adapter-cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) => filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		adapter: adapter({
			//wranger config file 
			config: './wrangler.jsonc',
			routes: {
				include: ["/*"],
				exclude: ["<all>"],
			}
		}),
		typescript: {
			config: (config) => ({
				...config,
				include: [...config.include, '../drizzle.config.ts'],
				exclude: [...(config.exclude ?? []), '../.svelte-kit/output/**']
			})
		},
		experimental: { remoteFunctions: true }
	},
	compilerOptions: {
		experimental: { async: true }
	}
};

export default config;
