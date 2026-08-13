import { authClient } from "../auth-client"

export const getClientToken = async (): Promise<string | null> => {
  try {
    const { data } = await authClient.token();
    if (!data || !data.token) {
      console.warn("No token found in Better Auth session");
      return null;
    }

    return `Bearer ${data.token}`;
  } catch (error) {
    console.error("Failed to fetch client token:", error);
    return null;
  }
}