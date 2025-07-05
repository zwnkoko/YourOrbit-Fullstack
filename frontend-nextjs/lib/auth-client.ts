import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
});

export const { signIn, signOut, useSession } = authClient;
