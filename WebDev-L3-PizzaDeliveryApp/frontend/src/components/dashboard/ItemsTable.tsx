// components/dashboard/ItemsTable.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Table, Button, AlertDialog } from "@heroui/react";
import { PencilToSquare, TrashBin } from "@gravity-ui/icons";
import { deletePizza } from "@/lib/action/pizza";
import { toast } from "react-toastify";

interface Pizza {
    _id: string;
    name: string;
    category: "veg" | "non-veg";
    price: string;
    rating?: string;
    imageUrl: string;
}

export default function ItemsTable({
    initialPizzas,
}: {
    initialPizzas: Pizza[];
}) {
    const [pizzas, setPizzas] = useState<Pizza[]>(initialPizzas);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    // Track the specific pizza being considered for deletion
    const [pizzaToDelete, setPizzaToDelete] = useState<Pizza | null>(null);
    const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

    const openDeleteDialog = (pizza: Pizza) => {
        setPizzaToDelete(pizza);
        setIsAlertDialogOpen(true);
    };

    const closeDeleteDialog = () => {
        setPizzaToDelete(null);
        setIsAlertDialogOpen(false);
    };

    const handleDeleteConfirm = async () => {
        if (!pizzaToDelete) return;

        const id = pizzaToDelete._id;


        setDeletingId(id);
        closeDeleteDialog();

        try {
            console.log("Delete pizza:", id);
            const result = await deletePizza(id)
            console.log(result)
            if (result.result.deletedCount) {
                toast.success("Pizza deleted successfully")
                setPizzas((prev) => prev.filter((p) => p._id !== id));
            }

        } catch (error) {
            console.error("Failed to delete pizza:", error);
        } finally {
            setDeletingId(null);
        }
    };

    if (pizzas.length === 0) {
        return (
            <div className="rounded-2xl border border-border bg-surface p-10 text-center">
                <p className="text-sm text-text-muted">No pizzas added yet.</p>
                <Link href="/dashboard/admin/items/add">
                    <Button className="mt-4 rounded-xl bg-primary px-6 font-semibold text-white">
                        Add your first pizza
                    </Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-border">
            <Table>
                <Table.ScrollContainer>
                    <Table.Content aria-label="Pizzas" className="min-w-180">
                        <Table.Header>
                            <Table.Column isRowHeader>Pizza</Table.Column>
                            <Table.Column>Category</Table.Column>
                            <Table.Column>Price</Table.Column>
                            <Table.Column>Rating</Table.Column>
                            <Table.Column>Actions</Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {pizzas.map((pizza) => (
                                <Table.Row key={pizza._id}>
                                    <Table.Cell>
                                        <div className="flex items-center gap-3">
                                            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-bg">
                                                <Image
                                                    src={pizza.imageUrl}
                                                    alt={pizza.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <span className="font-medium text-text">
                                                {pizza.name}
                                            </span>
                                        </div>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <span
                                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${pizza.category === "veg"
                                                ? "bg-accent/15 text-text"
                                                : "bg-primary/10 text-primary"
                                                }`}
                                        >
                                            {pizza.category === "veg" ? "Veg" : "Non-Veg"}
                                        </span>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <span className="font-mono text-text">৳{pizza.price}</span>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <span className="font-mono text-text-muted">
                                            {pizza.rating ? `★ ${pizza.rating}` : "—"}
                                        </span>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <div className="flex items-center gap-2">
                                            <Link href={`/dashboard/admin/items/${pizza._id}/edit`}>
                                                <button
                                                    type="button"
                                                    aria-label={`Edit ${pizza.name}`}
                                                    className="flex h-8 w-10 items-center cursor-pointer justify-center rounded-full border border-border text-text-muted hover:border-text hover:text-text"
                                                >
                                                    <PencilToSquare className="h-4 w-4" />
                                                </button>
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => openDeleteDialog(pizza)}
                                                disabled={deletingId === pizza._id}
                                                aria-label={`Delete ${pizza.name}`}
                                                className="flex h-8 w-10 cursor-pointer items-center justify-center rounded-full border border-border text-text-muted hover:border-primary hover:text-primary disabled:opacity-50"
                                            >
                                                <TrashBin className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>

            {/* Configured AlertDialog for Pizza Deletion */}
            <AlertDialog isOpen={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
                <AlertDialog.Backdrop>
                    <AlertDialog.Container>
                        <AlertDialog.Dialog className="sm:max-w-100">
                            <AlertDialog.CloseTrigger onClick={closeDeleteDialog} />
                            <AlertDialog.Header>
                                <AlertDialog.Icon status="danger" />
                                <AlertDialog.Heading>Delete item permanently?</AlertDialog.Heading>
                            </AlertDialog.Header>
                            <AlertDialog.Body>
                                <p>
                                    Are you sure you want to delete <strong>{pizzaToDelete?.name}</strong>? This action cannot be undone.
                                </p>
                            </AlertDialog.Body>
                            <AlertDialog.Footer>
                                <Button slot="close" variant="tertiary" onClick={closeDeleteDialog}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={handleDeleteConfirm}>
                                    Delete
                                </Button>
                            </AlertDialog.Footer>
                        </AlertDialog.Dialog>
                    </AlertDialog.Container>
                </AlertDialog.Backdrop>
            </AlertDialog>
        </div>
    );
}