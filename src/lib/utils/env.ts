export const isDev = import.meta.env.DEV;
export const isServer = typeof window === 'undefined';

export type Runtime = 'node' | 'cloudflare';
export const runtime: Runtime = isDev ? 'node' : 'cloudflare';

export const hasCFPlatform = (platform: App.Platform | undefined): platform is App.Platform => {
    return platform !== null && platform !== undefined;
};

export const hasCFD1 = (platform: App.Platform | undefined): platform is App.Platform => {
    return hasCFPlatform(platform) && platform.env?.DB !== undefined;
};