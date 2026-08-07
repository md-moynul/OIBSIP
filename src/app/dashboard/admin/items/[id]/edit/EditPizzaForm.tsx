// app/dashboard/admin/items/[id]/edit/EditPizzaForm.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Form,
  TextField,
  Label,
  Input,
  FieldError,
  Button,
} from "@heroui/react";
import { CircleDollar, Star, Picture } from "@gravity-ui/icons";
import { toast } from "react-toastify";
import { updatePizza } from "@/lib/action/pizza";
import { getAllInventoryItems } from "@/lib/api/inventory";
import { useEffect } from "react";

const cheeseOptions = ["Mozzarella", "Cheddar", "Parmesan"];

interface Pizza {
  _id: string;
  name: string;
  shortDescription?: string;
  fullDescription?: string;
  price: string | number;
  rating?: string | number;
  category: "veg" | "non-veg";
  cheeses?: string[];
  imageUrl: string;
  ingredients?: { inventoryId: string; quantityUsed: number }[];
}

export default function EditPizzaForm({ pizza }: { pizza: Pizza }) {
  const router = useRouter();
  const [category, setCategory] = useState<"veg" | "non-veg">(pizza.category);
  const [selectedCheeses, setSelectedCheeses] = useState<string[]>(pizza.cheeses || []);
  const [imagePreview, setImagePreview] = useState<string | null>(pizza.imageUrl);
  const [imageUrl, setImageUrl] = useState<string | null>(pizza.imageUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [inventoryItems, setInventoryItems] = useState<any[]>([]);
  const [recipe, setRecipe] = useState<{ inventoryId: string; quantityUsed: number }[]>(pizza.ingredients || []);

  useEffect(() => {
    getAllInventoryItems().then((res) => {
      if (res?.success) setInventoryItems(res.data);
    }).catch(console.error);
  }, []);

  const addRecipeItem = (inventoryId: string) => {
    if (!inventoryId) return;
    if (recipe.some((r) => r.inventoryId === inventoryId)) return;
    setRecipe([...recipe, { inventoryId, quantityUsed: 1 }]);
  };

  const updateRecipeQuantity = (inventoryId: string, quantityUsed: number) => {
    setRecipe(recipe.map((r) => (r.inventoryId === inventoryId ? { ...r, quantityUsed } : r)));
  };

  const removeRecipeItem = (inventoryId: string) => {
    setRecipe(recipe.filter((r) => r.inventoryId !== inventoryId));
  };

  const toggleCheese = (name: string) => {
    setSelectedCheeses((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const uploadToImgbb = async (file: File) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      { method: "POST", body: formData }
    );
    const data = await res.json();
    return data.success ? (data.data.url as string) : null;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    setUploadError(null);
    setIsUploading(true);

    try {
      const url = await uploadToImgbb(file);
      if (!url) throw new Error("Upload failed");
      setImageUrl(url);
    } catch {
      setUploadError("Couldn't upload image. Try again.");
      setImageUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!imageUrl) {
      setUploadError("Please add a pizza photo before saving.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {    
      name: formData.get("name"),  
      shortDescription: formData.get("shortDescription"),
      fullDescription: formData.get("fullDescription"),
      price: formData.get("price"),
      rating: formData.get("rating"),
      category,
      cheeses: selectedCheeses,
      imageUrl,
      ingredients: recipe,
    };
    const res = await updatePizza(pizza._id, data);
    
    if (res?.success || res?.modifiedCount > 0) {
      toast.success("Pizza updated successfully");
      router.push("/dashboard/admin/items"); 
      router.refresh();
    } else {
      toast.error("Failed to update pizza changes.");
    }
  };

  return (
    <div className="flex-1 px-6 py-8 md:px-10 mx-auto flex max-w-4xl flex-col gap-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-text">Edit Pizza</h1>
        <p className="mt-1 text-sm text-text-muted">
          Modify your pizza configuration details, categories, and photos.
        </p>
      </div>

      <Form onSubmit={handleSubmit} className="mt-8 flex max-w-4xl flex-col gap-5">
        {/* Image upload preview */}
        <div className="flex flex-col items-center gap-3">
          <label
            htmlFor="pizzaImage"
            className={`relative flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-surface hover:border-primary ${
              uploadError && !imageUrl ? "border-primary" : "border-border"
            }`}
          >
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Pizza preview"
                fill
                className={`object-cover ${isUploading ? "opacity-50" : ""}`}
              />
            ) : (
              <Picture className="h-6 w-6 text-text-muted" />
            )}
            {isUploading && (
              <span className="absolute inset-0 flex items-center justify-center bg-text/30">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-bg border-t-transparent" />
              </span>
            )}
          </label>
          <input
            id="pizzaImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
          <p className="text-xs text-text-muted">
            {isUploading ? "Uploading..." : "Click to modify your photo"}
          </p>
          {uploadError && <p className="text-xs text-primary">{uploadError}</p>}
        </div>

        <TextField name="name" type="text" isRequired defaultValue={pizza.name} className="flex flex-col gap-1.5">
          <Label className="text-sm font-medium text-text">Pizza name</Label>
          <Input
            placeholder="e.g. Chicken Paradise"
            className="w-full rounded-xl border border-border bg-surface py-2.5 px-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
          <FieldError className="text-xs text-primary" />
        </TextField>

        <TextField
          name="shortDescription"
          type="text"
          isRequired
          maxLength={120}
          defaultValue={pizza.shortDescription}
          className="flex flex-col gap-1.5"
        >
          <Label className="text-sm font-medium text-text">Short description</Label>
          <Input
            placeholder="1-2 line teaser shown on the menu card"
            className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
          <FieldError className="text-xs text-primary" />
        </TextField>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="fullDescription" className="text-sm font-medium text-text">
            Full description
          </label>
          <textarea
            id="fullDescription"
            name="fullDescription"
            required
            rows={4}
            defaultValue={pizza.fullDescription}
            placeholder="Ingredients, taste notes, what makes it special..."
            className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-5">
          <TextField name="price" type="number" isRequired defaultValue={String(pizza.price)} className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-text">Price </Label>
            <div className="relative">
              <CircleDollar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Input
                placeholder="450"
                min={0}
                className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
            </div>
            <FieldError className="text-xs text-primary" />
          </TextField>

          <TextField name="rating" type="number" defaultValue={pizza.rating ? String(pizza.rating) : ""} className="flex flex-col gap-1.5">
            <Label className="text-sm font-medium text-text">Rating (optional)</Label>
            <div className="relative">
              <Star className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <Input
                placeholder="4.5"
                min={0}
                max={5}
                step={0.1}
                className="w-full rounded-xl border border-border bg-surface py-2.5 pl-10 pr-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
              />
            </div>
          </TextField>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">Category</span>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setCategory("veg")}
              className={`rounded-xl border px-4 py-2 text-sm font-medium ${
                category === "veg"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-text-muted"
              }`}
            >
              Veg
            </button>
            <button
              type="button"
              onClick={() => setCategory("non-veg")}
              className={`rounded-xl border px-4 py-2 text-sm font-medium ${
                category === "non-veg"
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-text-muted"
              }`}
            >
              Non-Veg
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text">Cheese</span>
          <div className="flex flex-wrap gap-2">
            {cheeseOptions.map((cheese) => {
              const isSelected = selectedCheeses.includes(cheese);
              return (
                <button
                  key={cheese}
                  type="button"
                  onClick={() => toggleCheese(cheese)}
                  className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-text-muted"
                  }`}
                >
                  {cheese}
                </button>
              );
            })}
          </div>
        </div>

        {/* Recipe / Ingredients Section */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
          <div>
            <h3 className="text-sm font-bold text-text">Pizza Recipe (Inventory)</h3>
            <p className="text-xs text-text-muted">Select ingredients that will be deducted from stock when ordered.</p>
          </div>
          <div className="flex gap-2">
            <select 
              className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm text-text focus:border-primary focus:outline-none"
              id="ingredientSelect"
              defaultValue=""
            >
              <option value="" disabled>Select an ingredient...</option>
              {inventoryItems.map((item) => (
                <option key={item._id} value={item._id}>{item.name} ({item.unit})</option>
              ))}
            </select>
            <Button 
              type="button" 
              onClick={() => {
                const select = document.getElementById('ingredientSelect') as HTMLSelectElement;
                if (select.value) addRecipeItem(select.value);
              }}
              className="rounded-xl bg-bg border border-border px-4 text-sm font-semibold"
            >
              Add
            </Button>
          </div>
          {recipe.length > 0 && (
            <div className="mt-2 flex flex-col gap-2">
              {recipe.map((r) => {
                const item = inventoryItems.find((i) => i._id === r.inventoryId);
                if (!item) return null;
                return (
                  <div key={r.inventoryId} className="flex items-center justify-between rounded-lg border border-border p-2">
                    <span className="text-sm font-medium text-text">{item.name}</span>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          min={0.1}
                          step={0.1}
                          value={r.quantityUsed.toString()}
                          onChange={(e) => updateRecipeQuantity(r.inventoryId, parseFloat(e.target.value) || 0)}
                          className="w-16 rounded-lg border border-border bg-bg px-2 py-1 text-center text-sm"
                        />
                        <span className="text-xs text-text-muted">{item.unit}</span>
                      </div>
                      <button type="button" onClick={() => removeRecipeItem(r.inventoryId)} className="text-xs text-primary hover:underline">Remove</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button
            type="button"
            onClick={() => router.back()}
            className="rounded-xl border border-border px-6 text-text bg-background cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            isDisabled={isUploading || !imageUrl}
            className="rounded-xl bg-primary px-6 font-semibold text-white cursor-pointer"
          >
            {isUploading ? "Uploading..." : "Save changes"}
          </Button>
        </div>
      </Form>
    </div>
  );
}