import { getClientToken } from "../core/clientToken";
import { protectedMutation } from "../core/server";

export const createOrder = async (orderData: object) => {
  const token = await getClientToken();
  return protectedMutation("/api/orders", orderData, token ? token : "", "POST");
};

export const updateOrderStatus = async (orderId: string, deliveryStatus: string) => {
  const token = await getClientToken();
  return protectedMutation(`/api/orders/status/${orderId}`, { deliveryStatus }, token ? token : "", "PATCH");
};
