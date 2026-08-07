// components/dashboard/DashboardSidebar.tsx
"use client";

import React from "react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import {
    LayoutSideContentLeft,
    LayoutCellsLarge,
    ShoppingCart,
    // Box,
    Plus,
    ListCheck,
    // Bell,
    Person,
    ArrowRightFromSquare,
} from "@gravity-ui/icons";
import { Button, Drawer } from "@heroui/react";
import { authClient } from "@/lib/auth-client";

interface DashboardSidebarProps {
    user?: {
        id?: string;
        name?: string;
        email?: string;
        role?: "admin" | "user" | string;
        createdAt?: Date | string;
        updatedAt?: Date | string;
    } | null;
    cartCount?: number;
}

interface NavItem {
    icon: React.ElementType;
    label: string;
    href: string;
    badge?: number;
}

export default function DashboardSidebar({ user, cartCount = 0 }: DashboardSidebarProps) {
    const pathname = usePathname();
    const isAdmin = user?.role === "admin";

    const adminNavItems: NavItem[] = [
        { icon: LayoutCellsLarge, label: "Overview", href: "/dashboard/admin" },
        { icon: Person, label: "Users", href: "/dashboard/admin/users" },
        { icon: ShoppingCart, label: "Orders", href: "/dashboard/admin/orders" },
        { icon: Plus, label: "Add Item", href: "/dashboard/admin/items/add" },
        { icon: ListCheck, label: "Manage Items", href: "/dashboard/admin/items" },
        { icon: Person, label: "Profile", href: "/dashboard/profile" },
    ];

    const customerNavItems: NavItem[] = [
        { icon: ListCheck, label: "My Orders & Delivery", href: "/dashboard/user/orders" },
        { icon: Plus, label: "Build Pizza", href: "/dashboard/user/build" },
        { icon: ShoppingCart, label: "Cart", href: "/dashboard/user/cart" },
        { icon: Person, label: "Profile", href: "/dashboard/profile" },
    ];

    const navItems = isAdmin ? adminNavItems : customerNavItems;
    const handleLogout = async () => {
        await authClient.signOut();
        redirect('/');
    };

    // `onLinkClick` lets us close the drawer on mobile when a nav item is tapped.
    const renderNavLinks = (onLinkClick?: () => void) => (
        <nav className="flex w-full flex-col gap-1.5">
            {navItems.map((item) => {
                const IconComponent = item.icon;
                const isActive = pathname === item.href;

                return (
                    <Link key={item.href} href={item.href} onClick={onLinkClick}>
                        <button
                            type="button"
                            className={`group relative flex w-full cursor-pointer items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${isActive
                                ? "bg-primary/10 text-primary"
                                : "text-text-muted hover:bg-surface hover:text-text"
                                }`}
                        >
                            <div className="flex items-center gap-3.5">
                                <IconComponent
                                    className={`h-5 w-5 ${isActive
                                        ? "text-primary"
                                        : "text-text-muted group-hover:text-text"
                                        }`}
                                />
                                <span>{item.label}</span>
                            </div>

                            <div className="flex items-center gap-2">
                                {!!item.badge && item.badge > 0 && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs font-semibold text-white">
                                        {item.badge}
                                    </span>
                                )}
                                {isActive && (
                                    <div className="absolute right-0 top-1/4 h-1/2 w-0.5 rounded-l bg-primary" />
                                )}
                            </div>
                        </button>
                    </Link>
                );
            })}

            {!isAdmin && (

                <button
                    onClick={handleLogout}
                    type="button"
                    className="mt-2 flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-left text-sm font-medium text-text-muted transition-all hover:bg-surface hover:text-primary cursor-pointer"
                >
                    <ArrowRightFromSquare className="h-5 w-5" />
                    <span>Logout</span>
                </button>
            )}
        </nav>
    );

    return (
        <div>
            {/* Mobile Header + Drawer
          IMPORTANT (HeroUI v3): the trigger button must be the FIRST child of
          <Drawer>, with <Drawer.Backdrop> as the second child. If the trigger
          isn't the first child, v3's DialogTrigger wiring breaks and the
          drawer never opens. */}
            <div className="sticky top-0 z-40 flex items-center justify-between border-b border-border p-4 lg:hidden">
                <Drawer>
                    <Button
                        size="sm"
                        className="gap-2 rounded-xl border-border text-text"
                    >
                        <LayoutSideContentLeft className="h-4 w-4" />
                        Menu
                    </Button>

                    {!isAdmin && (
                        <Link href="/cart" className="relative">
                            <ShoppingCart className="h-5 w-5 text-text" />
                            {cartCount > 0 && (
                                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    )}

                    <Drawer.Backdrop>
                        <Drawer.Content
                            placement="left"
                            className="fixed inset-y-0 left-0 z-50 h-screen w-72 max-w-72 overflow-y-auto border-r border-border bg-bg"
                        >
                            <Drawer.Dialog className="p-5 text-text">
                                {({ close }: { close: () => void }) => (
                                    <>
                                        <Drawer.Header className="mb-6 p-0">
                                            <div>
                                                <h2 className="font-display text-2xl font-semibold text-text">
                                                    PizzaPoint
                                                </h2>
                                                <p className="text-sm text-text-muted">
                                                    {isAdmin ? "Admin Dashboard" : "My Account"}
                                                </p>
                                            </div>
                                        </Drawer.Header>

                                        <Drawer.Body className="p-0">
                                            {renderNavLinks(close)}
                                        </Drawer.Body>
                                    </>
                                )}
                            </Drawer.Dialog>
                        </Drawer.Content>
                    </Drawer.Backdrop>
                </Drawer>
            </div>

            {/* Desktop Sidebar */}
            <aside className="sticky top-0 hidden h-screen w-64 flex-col border-r border-border bg-bg p-5 lg:flex">
                <div className="mb-8">
                    <h2 className="font-display text-2xl font-semibold text-text">
                        PizzaPoint
                    </h2>
                    <p className="text-sm text-text-muted">
                        {isAdmin ? "Admin Dashboard" : "My Account"}
                    </p>
                </div>

                {renderNavLinks()}

                <div className="mt-auto rounded-2xl border border-border p-4">
                    <p className="text-sm font-medium text-text">
                        {user?.name ?? (isAdmin ? "Admin" : "Guest")}
                    </p>
                    <p className="mt-1 text-xs text-text-muted">
                        {isAdmin
                            ? `Signed in as ${user?.role ?? "admin"}`
                            : user?.email ?? "Sign in to track your orders"}
                    </p>
                </div>
            </aside>
        </div>
    );
}