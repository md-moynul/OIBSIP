import { authClient } from "@/lib/auth-client";

export const sessionsClient = () => {
    const { 
        data: session, 
        isPending, //loading state
    } = authClient.useSession() 
    return {
        session,
        isPending,
    }
}