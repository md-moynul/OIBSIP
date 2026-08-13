import { serverFetch } from "../core/server";

export const getAllInventoryItems = async () => {
  return serverFetch(`/api/inventory/all`);
};
