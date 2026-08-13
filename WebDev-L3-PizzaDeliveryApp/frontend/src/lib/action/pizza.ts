import { getClientToken } from "../core/clientToken"
import { protectedMutation } from "../core/server"


export const postPizza = async (data :object) => {
    const token = await getClientToken()

    return protectedMutation('/api/pizza/admin/add', data , token ? token : '')
}

export const deletePizza = async (id: string) => {
    const token = await getClientToken()

    return protectedMutation(`/api/pizza/${id}`, null, token ? token : '','DELETE')
}
export const updatePizza = async (id: string, data: object) => {
    const token = await getClientToken()

    return protectedMutation(`/api/pizza/${id}`, data, token ? token : '','PATCH')
}