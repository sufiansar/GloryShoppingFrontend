export interface Category {
  id?: string;
  name: string;
  description?: string | null;
  images?: string[] | { url: string; alt?: string }[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface CategoryResponse {
  data: Category[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}
