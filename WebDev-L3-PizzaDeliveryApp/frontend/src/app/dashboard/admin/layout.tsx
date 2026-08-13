import { requireRole } from '@/lib/sessions/serverSession';
import React from 'react';

const layout = async ({ children }: Readonly<{
    children: React.ReactNode;
}>) => {
    await requireRole("admin");
    return children;
};

export default layout;