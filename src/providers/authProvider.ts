import { AuthProvider } from "@refinedev/core";
import { authClient } from "../lib/auth-client";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const { data, error } = await authClient.signIn.email({ email, password });
    if (error)
      return {
        success: false,
        error: { message: error.message, name: "LoginError" },
      };
    return { success: true, redirectTo: "/" };
  },

  logout: async () => {
    await authClient.signOut();
    return { success: true, redirectTo: "/login" };
  },

  check: async () => {
    const session = await authClient.getSession();
    if (session?.data) return { authenticated: true };
    return { authenticated: false, redirectTo: "/login" };
  },

  getIdentity: async () => {
    const session = await authClient.getSession();
    return session?.data?.user ?? null;
  },

  onError: async (error) => {
    if (error.status === 401) return { logout: true };
    return { error };
  },

  register: async ({ email, password, name }) => {
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      // Better Auth will use the default 'operator' role you set in the backend
    });

    if (error) {
      return {
        success: false,
        error: { message: error.message, name: "Registration Error" },
      };
    }

    return {
      success: true,
      redirectTo: "/",
    };
  },
};
