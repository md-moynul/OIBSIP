/* eslint-disable @typescript-eslint/no-unused-expressions */
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Label, ListBox, Select, Slider, Input } from "@heroui/react";
import { Magnifier } from "@gravity-ui/icons";

const categoryOptions = [
  { id: "all", label: "All categories" },
  { id: "veg", label: "Veg" },
  { id: "non-veg", label: "Non-Veg" },
];

const MAX_PRICE = 1000;

interface MenuBrowserProps {
  initialSearch: string;
  initialCategory: string;
  initialMinPrice: number;
  initialMaxPrice: number;
}

export default function MenuBrowser({
  initialSearch,
  initialCategory,
  initialMinPrice,
  initialMaxPrice,
}: MenuBrowserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [priceRange, setPriceRange] = useState<number[]>([
    initialMinPrice,
    initialMaxPrice,
  ]);

  const applyFilters = (next: {
    search?: string;
    category?: string;
    priceRange?: number[];
  }) => {
    const params = new URLSearchParams(searchParams.toString());
    const nextSearch = next.search ?? search;
    const nextCategory = next.category ?? category;
    const [min, max] = next.priceRange ?? priceRange;

    
    params.delete("page");
    nextSearch ? params.set("q", nextSearch) : params.delete("q");
    
    nextCategory && nextCategory !== "all"
      ? params.set("category", nextCategory)
      : params.delete("category");
      
    min > 0 ? params.set("minPrice", String(min)) : params.delete("minPrice");
    max < MAX_PRICE
      ? params.set("maxPrice", String(max))
      : params.delete("maxPrice");

    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (search !== initialSearch) {
        applyFilters({ search });
      }
    }, 400);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleCategoryChange = (key: string) => {
    setCategory(key);
    applyFilters({ category: key });
  };

  const handlePriceChangeEnd = (value: number[]) => {
    setPriceRange(value);
    applyFilters({ priceRange: value });
  };

  return (
    <div className="mt-8 grid grid-cols-1 gap-5 rounded-2xl border border-border bg-surface p-5 md:grid-cols-[1.5fr_1fr_1.5fr]">
      {/* Search Input */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="pizza-search" className="text-sm font-medium text-text">
          Search
        </label>
        <div className="relative">
          <Magnifier className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <Input
            id="pizza-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search pizzas..."
            className="w-full rounded-xl border border-border bg-bg py-2.5 pl-10 pr-3 text-sm text-text placeholder:text-text-muted focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Category Select */}
      <Select
        selectedKey={category}
        onSelectionChange={(key) => handleCategoryChange(String(key))}
        placeholder="Select category"
        className="flex flex-col gap-1.5"
      >
        <Label className="text-sm font-medium text-text">Category</Label>
        <Select.Trigger className="w-full rounded-xl border border-border bg-bg py-2.5 px-3 text-sm text-text focus:border-primary focus:outline-none">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>
        <Select.Popover>
          <ListBox>
            {categoryOptions.map((opt) => (
              <ListBox.Item key={opt.id} id={opt.id} textValue={opt.label}>
                {opt.label}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      {/* Price Slider */}
      <Slider
        className="flex flex-col gap-1.5"
        value={priceRange}
        onChange={(value) => setPriceRange(value as number[])}
        onChangeEnd={(value) => handlePriceChangeEnd(value as number[])}
        formatOptions={{ currency: "BDT", style: "currency" }}
        maxValue={MAX_PRICE}
        minValue={0}
        step={50}
      >
        <Label className="text-sm font-medium text-text">Price range</Label>
        <Slider.Output className="text-xs text-text-muted" />
        <Slider.Track className="relative mt-2 h-1 rounded-full bg-border">
          {({ state }) => (
            <>
              <Slider.Fill className="h-full rounded-full bg-primary" />
              {state.values.map((_, i) => (
                <Slider.Thumb
                  key={i}
                  index={i}
                  className="h-4 w-4 rounded-full border-2 border-primary bg-bg"
                />
              ))}
            </>
          )}
        </Slider.Track>
      </Slider>
    </div>
  );
}