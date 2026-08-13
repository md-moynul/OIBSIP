import { getClientToken } from "../core/clientToken";
import { protectedMutation } from "../core/server"


export const addToCart = async (cartData: object) => {
    console.log(cartData);
    const token = await getClientToken();
    return protectedMutation("/api/cart/add", cartData, token ? token : '', 'POST');
}

export const deleteCartItem = async (userId: string, pizzaId: string, size: string) => {
    const token = await getClientToken();
    return protectedMutation(`/api/cart/delete/${userId}/${pizzaId}/${size}`, null, token ? token : '', 'DELETE');
}

export const clearCart = async (userId: string) => {
    const token = await getClientToken();
    return protectedMutation(`/api/cart/clear/${userId}`, null, token ? token : '', 'DELETE');
}
export const updateCartItemQuantity = async (userId: string, pizzaId: string, size: string, action: 'increase' | 'decrease') => {
    const token = await getClientToken();
    return protectedMutation(`/api/cart/update-quantity/${userId}/${pizzaId}/${size}/${action}`, null, token ? token : '', 'PATCH');
}