// types/product.ts
export interface Product {
  id?: string;
  name: string;
  slug: string | null;
  description: string | null;
  country: string | null;
  salesCount: number;
  isNew: boolean;
  isFeatured: boolean;
  isTrending: boolean;
  isBestSeller: boolean;
  averageRating: number;
  reviewCount: number;
  brandName: string;
  categoryName: string;
  thumbleImage: string | null;
  price: number;
  discount: number | null;
  stock: number;
  shortDesc: string | null;
  longDesc: string | null;
  tags: string[]; // Array of tag names
  isActive: boolean;
  faquestions?: string | null;
  variants?: {
    id?: string;
    size: string;
    color: string;
    sku: string;
    price: number;
    stock: number;
    images: string[];
  }[];
  reviews?: {
    id?: string;
    userId: string;
    rating: number;
    comment: string;
    createdAt: string;
  }[];
  ingredients?: {
    id?: string;
    name: string;
    quantity: string;
  }[];
  brand?: {
    id?: string;
    name: string;
    country?: string;
  };
  category?: {
    id?: string;
    name: string;
  };
  categoryId: string | null;
  brandId: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductResponse {
  data: Product[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}
