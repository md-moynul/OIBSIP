import { getClientToken } from "../core/clientToken";
import { protectedMutation } from "../core/server";

export const updateSettings = async (data: Record<string, unknown>) => {
  const token = await getClientToken();
  return protectedMutation(`/api/settings`, data, token ? token : "", "PATCH");
};
