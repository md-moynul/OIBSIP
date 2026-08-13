import { protectedFetch } from "../core/server";
import { getServerToken } from "../core/serverToken";

export const getUser = async () => {
    const token = await getServerToken();
    return protectedFetch(`/api/users`, token);

}