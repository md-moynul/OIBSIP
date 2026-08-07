// components/menu/PurchasePanel.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@heroui/react";
import { Plus, Minus } from "@gravity-ui/icons";
import { SIZE_OPTIONS, getSizePrice } from "@/lib/constants/pricing";
import { addToCart } from "@/lib/action/cart";
import { toast } from "react-toastify";

interface Pizza {
    _id: string;
    name: string;
    price: string;
}

// One quantity slot per size, indexed the same way as SIZE_OPTIONS
type QuantityMap = Record<number, number>;

export default function PurchasePanel({ pizza ,userId }: { pizza: Pizza , userId: string }) {
    // Default 1 quantity for Small (6") size (index 0)
    const [quantities, setQuantities] = useState<QuantityMap>({ 0: 1 });
    const [isAdding, setIsAdding] = useState(false);
    const [isBuyingNow, setIsBuyingNow] = useState(false);
    const router = useRouter();

    const basePrice = Number(pizza.price) || 0;

    const updateQuantity = (index: number, delta: number) => {
        setQuantities((prev) => {
            const current = prev[index] ?? 0;
            const next = Math.max(0, current + delta);
            const updated = { ...prev, [index]: next };
            if (next === 0) delete updated[index];
            return updated;
        });
    };

    const selectedLines = SIZE_OPTIONS.map((size, i) => ({
        size,
        index: i,
        quantity: quantities[i] ?? 0,
        unitPrice: getSizePrice(basePrice, size.multiplier),
    })).filter((line) => line.quantity > 0);

    const totalItems = selectedLines.reduce((sum, line) => sum + line.quantity, 0);
    const totalPrice = selectedLines.reduce(
        (sum, line) => sum + line.unitPrice * line.quantity,
        0
    );

    const handleAddToCart = async () => {
        if (selectedLines.length === 0) return;
        setIsAdding(true);
        try {
            const cartData = {
                items: selectedLines.map((line) => ({
                    pizzaId: pizza._id,
                    size: line.size.label,
                    inches: line.size.inches,
                    unitPrice: line.unitPrice,
                    quantity: line.quantity,
                })),
                userId : userId,
                totalPrice: totalPrice,
                pizzaId: pizza._id,
            };
            const res = await addToCart(cartData);
            if (res.success) {
                toast.success("Pizza added to cart successfully");
                window.dispatchEvent(new Event("cart-updated"));
            } else {
                toast.error("Failed to add pizza to cart");
            }
        } catch (e) {
            toast.error("An error occurred while adding to cart");
        } finally {
            setIsAdding(false);
        }
    };

    const handleBuyNow = async () => {
        if (selectedLines.length === 0) return;
        setIsBuyingNow(true);
        try {
            const cartData = {
                items: selectedLines.map((line) => ({
                    pizzaId: pizza._id,
                    size: line.size.label,
                    inches: line.size.inches,
                    unitPrice: line.unitPrice,
                    quantity: line.quantity,
                })),
                userId: userId,
                totalPrice: totalPrice,
                pizzaId: pizza._id,
            };
            const res = await addToCart(cartData);
            if (res.success) {
                window.dispatchEvent(new Event("cart-updated"));
                router.push("/checkout");
            } else {
                toast.error("Failed to process direct purchase");
                setIsBuyingNow(false);
            }
        } catch (e) {
            toast.error("An error occurred while processing checkout");
            setIsBuyingNow(false);
        }
    };

    return (
        <div className="mt-auto pt-8">
            {/* Size + quantity picker */}
            <div>
                <p className="font-mono text-xs uppercase tracking-wide text-text-muted">
                    Sizes
                </p>
                <div className="mt-2 space-y-2">
                    {SIZE_OPTIONS.map((size, i) => {
                        const qty = quantities[i] ?? 0;
                        const unitPrice = getSizePrice(basePrice, size.multiplier);
                        const isActive = qty > 0;

                        return (
                            <div
                                key={size.label}
                                className={`flex items-center justify-between rounded-xl border px-4 py-2.5 ${isActive ? "border-primary bg-primary/5" : "border-border"
                                    }`}
                            >
                                <div>
                                    <p className="text-sm font-medium text-text">
                                        {size.inches}&quot; · {size.label}
                                    </p>
                                    <p className="font-mono text-xs text-text-muted">
                                        ৳{unitPrice}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(i, -1)}
                                        disabled={qty === 0}
                                        aria-label={`Decrease ${size.label} quantity`}
                                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-muted hover:border-text hover:text-text disabled:opacity-30"
                                    >
                                        <Minus className="h-3.5 w-3.5" />
                                    </button>
                                    <span className="w-5 text-center font-mono text-sm font-semibold text-text">
                                        {qty}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => updateQuantity(i, 1)}
                                        aria-label={`Increase ${size.label} quantity`}
                                        className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-text-muted hover:border-text hover:text-text"
                                    >
                                        <Plus className="h-3.5 w-3.5" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Summary */}
            {selectedLines.length > 0 && (
                <div className="mt-4 space-y-1 border-t border-border pt-4">
                    {selectedLines.map((line) => (
                        <div
                            key={line.size.label}
                            className="flex items-center justify-between text-sm text-text-muted"
                        >
                            <span>
                                {line.quantity} × {line.size.inches}&quot; {line.size.label}
                            </span>
                            <span className="font-mono">
                                ৳{line.unitPrice * line.quantity}
                            </span>
                        </div>
                    ))}
                </div>
            )}

            <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-text-muted">{totalItems} item(s)</p>
                <p className="font-mono text-2xl font-bold text-primary">
                    ৳{totalPrice}
                </p>
            </div>

            <div className="mt-4 flex gap-3">
                <Button
                    onPress={handleAddToCart}
                    isDisabled={isAdding || isBuyingNow || selectedLines.length === 0}
                    className="flex-1 bg-background rounded-xl border-text py-2.5 font-semibold text-text"
                >
                    {isAdding ? "Adding..." : "Add to cart"}
                </Button>
                <Button
                    onPress={handleBuyNow}
                    isDisabled={isAdding || isBuyingNow || selectedLines.length === 0}
                    className="flex-1 rounded-xl bg-primary py-2.5 font-semibold text-white"
                >
                    {isBuyingNow ? "Processing..." : "Order now"}
                </Button>
            </div>
        </div>
    );
}