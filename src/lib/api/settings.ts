import { serverFetch } from "../core/server";

export const getSettings = async () => {
  return serverFetch(`/api/settings`);
};
