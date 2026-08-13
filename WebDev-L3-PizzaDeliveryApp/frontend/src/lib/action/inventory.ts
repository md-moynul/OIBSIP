import { getClientToken } from "../core/clientToken";
import { protectedMutation } from "../core/server";

export const addInventoryItem = async (data: object) => {
  const token = await getClientToken();
  return protectedMutation("/api/inventory/add", data, token ? token : "", "POST");
};

export const deleteInventoryItem = async (id: string) => {
  const token = await getClientToken();
  return protectedMutation(`/api/inventory/${id}`, null, token ? token : "", "DELETE");
};

export const updateInventoryItem = async (id: string, data: object) => {
  const token = await getClientToken();
  return protectedMutation(`/api/inventory/${id}`, data, token ? token : "", "PATCH");
};
