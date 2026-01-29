export interface SkinConcern {
  id: string;
  name: string;
  description: string;
  severity: "low" | "medium" | "high";
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SkinType {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description?: string;
  price?: number;
  imageUrl?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: Pagination;
}
