import { serverFetch } from "../core/server";

export const getCart = async (userId: string) => {
    return serverFetch(`/api/cart/get/${userId}`);
}