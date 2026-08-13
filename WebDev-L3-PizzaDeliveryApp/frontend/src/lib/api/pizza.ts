import { serverFetch } from "../core/server";

interface GetAllPizzasArgs {
  q?: string;
  category?: string;
  minPrice?: string;
  maxPrice?: string;
  page?: number; 
  limit?: number; 
}

export const getAllPizzas = async ({ 
  q, 
  category, 
  minPrice, 
  maxPrice, 
  page = 1, 
  limit = 8 
}: GetAllPizzasArgs = {}) => {
  return serverFetch(
    `/api/pizza?q=${q ?? ''}&category=${category ?? ''}&minPrice=${minPrice ?? ''}&maxPrice=${maxPrice ?? ''}&page=${page}&limit=${limit}`
  );
};

export const getPizzaById = async (id: string) => {
  return serverFetch(`/api/pizza/${id}`)
}

// target API: /api/pizza/loved?page=1&limit=4
export const getLovedPizzas = async (page: number = 1, limit: number = 4) => {
  return serverFetch(`/api/pizza/loved?page=${page}&limit=${limit}`);
};
export const getAllPizzaWithoutPagination = async () => {
  return serverFetch(`/api/pizza/all`);
};