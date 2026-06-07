import { createAuthClient } from 'better-auth/svelte';
import { adminClient, inferAdditionalFields, inferOrgAdditionalFields } from 'better-auth/client/plugins';
import { organizationClient } from 'better-auth/client/plugins';
import { magicLinkClient } from 'better-auth/client/plugins';
import { goto, invalidateAll } from '$app/navigation';
import type { Pathname } from '$app/types';
import type { Auth } from './auth';

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_AUTH_URL ?? 'http://localhost:5173',

  plugins: [
    inferAdditionalFields<Auth>(),  // ← brings the `webappId` field into the client types
    adminClient(),
    organizationClient({
      schema: inferOrgAdditionalFields<Auth>(), // ← brings the `webappId` field into the Organization-Type
    }),
    magicLinkClient(),
  ],
});

export const signout = async (url?: string) => {
  authClient.signOut({
    fetchOptions: {
      onSuccess: async () => {
        await invalidateAll();
        goto((url ?? '/') as Pathname);
      },
    },
  });
};

export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;