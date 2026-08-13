import { serverFetch, protectedFetch } from "../core/server";
import { getServerToken } from "../core/serverToken";

export const getOrdersByUserId = async (userId: string) => {
  const token = await getServerToken();
  return protectedFetch(`/api/orders/user/${userId}`, token);
};

export const getAllOrders = async () => {
  return serverFetch(`/api/orders/all`);
};
