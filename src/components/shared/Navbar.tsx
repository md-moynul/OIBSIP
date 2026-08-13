"use client";

import { useState, useEffect, useRef } from "react";
import { Avatar, Button } from "@heroui/react";
import {
  Bars,
  Xmark,
  ShoppingCart,
  LayoutHeader,
  ArrowRightFromSquare,
  ListCheck,
  Plus,
  CircleCheckFill,
  Envelope,
  Person,
  Clock,
} from "@gravity-ui/icons";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { sessionsClient } from "@/lib/sessions/clinetSide";
import { getCart } from "@/lib/api/cart";

// --- TypeScript Interfaces ---
interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isPriority?: boolean;
}

interface CustomUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string;
}

interface CartItem {
  pizzaId: string;
  size: string;
  inches: number;
  unitPrice: number;
  quantity: number;
}

interface CartData {
  _id: { $oid: string };
  userId: string;
  items: CartItem[];
  totalPrice: number;
  createdAt: { $date: string };
  updatedAt: { $date: string };
}

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const user = sessionsClient().session?.user as CustomUser | undefined;

  // Base navigation items with icons & priority definitions
  const navItems: NavItem[] = [
    { label: "Menu", href: "/menu", icon: ListCheck },
    {
      label: "Build Pizza",
      href: "/dashboard/user/build",
      icon: Plus,
      isPriority: true,
    },
    { label: "About", href: "/about", icon: CircleCheckFill },
    { label: "Contact Us", href: "/contact", icon: Envelope },
    ...(user && user.role !== "admin"
      ? [
          { label: "Cart", href: "/dashboard/user/cart", icon: ShoppingCart },
          { label: "Profile", href: "/dashboard/profile", icon: Person },
        ]
      : []),
    ...(user?.role === "admin"
      ? [
          { label: "Dashboard", href: `/dashboard/${user.role}`, icon: LayoutHeader, isPriority: true },
          { label: "Profile", href: "/dashboard/profile", icon: Person },
        ]
      : []),
  ];

  // Hook 1: Fetch and safely sum up total item quantities from the cart data
  useEffect(() => {
    const fetchCartData = async () => {
      if (!user?.id) {
        setCartCount(0);
        return;
      }

      try {
        const cart: CartData = await getCart(user.id);
        const totalQuantity = cart?.items?.reduce((acc: number, item) => acc + (item.quantity || 0), 0) || 0;
        setCartCount(totalQuantity);
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setCartCount(0);
      }
    };

    fetchCartData();

    const handleCartUpdate = () => {
      fetchCartData();
    };

    window.addEventListener("cart-updated", handleCartUpdate);
    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate);
    };
  }, [user?.id]);

  // Hook 2: Scroll blocking when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // Hook 3: Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    setIsProfileOpen(false);
    router.push('/');
  };

  const navEnd = (
    <>
      {user ? (
        <div ref={profileRef} className="relative">
          <button
            onClick={() => setIsProfileOpen((v) => !v)}
            aria-label="Your profile"
            aria-expanded={isProfileOpen}
            className="flex items-center gap-2 rounded-full p-0.5 transition-transform hover:scale-105"
          >
            <Avatar className="cursor-pointer">
              <Avatar.Image
                alt={user?.name ?? "Profile"}
                src={user?.image || 'https://heroui-assets.nyc3.cdn.digitaloceanspaces.com/avatars/blue.jpg'}
              />
              <Avatar.Fallback>{user.name?.[0] ?? "U"}</Avatar.Fallback>
            </Avatar>
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-surface p-1 shadow-xl backdrop-blur-md">
              <div className="border-b border-border/50 px-3 py-2">
                <p className="text-xs font-semibold text-text truncate">{user.name}</p>
                <p className="text-[11px] text-text-muted truncate">{user.email}</p>
              </div>

              {user?.role === "admin" ? (
                <Link
                  href={`/dashboard/${user.role}`}
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-text hover:bg-primary/10 hover:text-primary transition-colors"
                >
                  <LayoutHeader className="h-4 w-4" />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/dashboard/user/build"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-primary hover:bg-primary/10 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Build Custom Pizza
                  </Link>
                  <Link
                    href="/dashboard/user/cart"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-text hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Cart
                  </Link>
                  <Link
                    href="/dashboard/user/orders"
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-text hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Clock className="h-4 w-4" />
                    My Orders
                  </Link>
                </>
              )}

              <Link
                href="/dashboard/profile"
                onClick={() => setIsProfileOpen(false)}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-text hover:bg-primary/10 hover:text-primary transition-colors"
              >
                <Person className="h-4 w-4" />
                Profile Settings
              </Link>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <ArrowRightFromSquare className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link href="/auth/signin">
          <Button size="sm" className="bg-primary font-semibold text-white shadow-sm hover:opacity-95">
            Sign in
          </Button>
        </Link>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-border bg-bg/80 backdrop-blur-lg">
      <header className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Brand & Mobile Menu Trigger */}
        <div className="flex items-center gap-4">
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <Xmark className="h-6 w-6 text-text" />
            ) : (
              <Bars className="h-6 w-6 text-text" />
            )}
          </button>

          <Link href="/" className="flex items-center gap-2">
            <Image src="/Pizzapoint.png" alt="PizzaPoint" width={22} height={22} />
            <p className="font-display text-lg font-bold text-text">
              PizzaPoint
            </p>
          </Link>
        </div>

        {/* Desktop Navigation Items with Icons & Priority Styling */}
        <ul className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    item.isPriority
                      ? "bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white shadow-xs font-semibold"
                      : "text-text-muted hover:text-text hover:bg-surface"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Content / Quick Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {user?.role !== "admin" && (
            <Link href="/dashboard/user/cart" aria-label="View Cart">
              <button
                className="relative rounded-full border border-border p-2 text-text transition-colors hover:border-primary hover:text-primary hover:bg-surface"
              >
                <ShoppingCart className="h-4 w-4" />
                {cartCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-xs animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>
            </Link>
          )}
          {navEnd}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="border-t border-border bg-bg/95 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col gap-1.5 p-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                      item.isPriority
                        ? "bg-primary/10 text-primary border border-primary/20 font-semibold"
                        : "text-text hover:bg-surface"
                    }`}
                  >
                    <Icon className="h-4 w-4 text-primary" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
            <li className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
              {navEnd}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}