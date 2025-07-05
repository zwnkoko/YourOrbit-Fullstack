import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: "http://localhost:3001",
});

export const { signIn, signOut, useSession } = authClient;
