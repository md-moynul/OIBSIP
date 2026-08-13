import { redirect } from "next/navigation";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

export const serverMutation = async (path: string, data: object, method: string = 'POST') => {
    if (!baseUrl || baseUrl === 'undefined') {
        console.error('NEXT_PUBLIC_BASE_URL is not set. Cannot mutate', path);
        return { success: false, error: "Base URL missing" };
    }
    try {
        const res = await fetch(`${baseUrl}${path}`, {
            method: method,
            headers: {
                'content-type': 'application/json',
            },
            ...(data && { body: JSON.stringify(data) }),
        });
        if (!res.ok) {
            console.error('serverMutation failed', path, res.status);
            // Optionally handle text response if not JSON
            const text = await res.text();
            try { return JSON.parse(text); } catch { return { success: false, error: text }; }
        }
        return await res.json();
    } catch (e) {
        console.error('serverMutation error', path, e);
        return { success: false, error: String(e) };
    }
};

export const protectedMutation = async (path: string, data :object | null, token : string, method: string = 'POST') => {
    if (!baseUrl || baseUrl === 'undefined') {
        console.error('NEXT_PUBLIC_BASE_URL is not set. Cannot mutate', path);
        return { success: false, error: "Base URL missing" };
    }
    try {
        const res = await fetch(`${baseUrl}${path}`, {
            method: method,
            headers: {
                'content-type': 'application/json',
                'authorization': token
            },
            ...(data && { body: JSON.stringify(data) }),
        });
        if (res.status === 401) {
            redirect('/auth/signin');
        }
        if (res.status === 403) {
            redirect('/unauthorized');
        }
        if (!res.ok) {
            const text = await res.text();
            try { return JSON.parse(text); } catch { return { success: false, error: text }; }
        }
        return await res.json();
    } catch (e) {
        if (e && typeof e === 'object' && 'message' in e && (e.message as string).includes('NEXT_REDIRECT')) {
            throw e; // rethrow Next.js redirect errors
        }
        console.error('protectedMutation error', path, e);
        return { success: false, error: String(e) };
    }
};

export const serverFetch = async (path :string) => {
    if (!baseUrl || baseUrl === 'undefined') {
        console.error('NEXT_PUBLIC_BASE_URL is not set. Cannot fetch', path);
        return { data: [], success: false, error: "Base URL missing" };
    }
    try {
        const res = await fetch(`${baseUrl}${path}`);
        if (!res.ok) {
            console.error('serverFetch failed', path, res.status);
            const text = await res.text();
            try { return JSON.parse(text); } catch { return { data: [], success: false, error: text }; }
        }
        return await res.json();
    } catch (e) {
        console.error('serverFetch error', path, e);
        return { data: [], success: false, error: String(e) };
    }
};

export const protectedFetch = async (path: string, token: string) => {
    if (!baseUrl || baseUrl === 'undefined') {
        console.error('NEXT_PUBLIC_BASE_URL is not set. Cannot fetch', path);
        return { data: [], success: false, error: "Base URL missing" };
    }
    try {
        const res = await fetch(`${baseUrl}${path}`, {
            headers: {
                'authorization': token
            },
        });
        if (res.status === 401) {
            redirect('/auth/signin');
        }
        if (res.status === 403) {
            redirect('/unauthorized');
        }
        if (!res.ok) {
            const text = await res.text();
            try { return JSON.parse(text); } catch { return { data: [], success: false, error: text }; }
        }
        return await res.json();
    } catch (e) {
        if (e && typeof e === 'object' && 'message' in e && (e.message as string).includes('NEXT_REDIRECT')) {
            throw e;
        }
        console.error('protectedFetch error', path, e);
        return { data: [], success: false, error: String(e) };
    }
};