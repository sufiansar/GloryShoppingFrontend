export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  images?: string[];
}

export interface CreateCategory {
  slug?: string;
  name: string;
  description?: string;
  images?: string[];
}

export interface UpdateCategory extends Partial<CreateCategory> {
  id: string;
}

export interface CategoryFilter {
  search?: string;
  page?: number;
  limit?: number;
}
