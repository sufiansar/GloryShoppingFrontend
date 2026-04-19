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
  isStock?: boolean;
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
  tags: string[];
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
    ingredient: {
      name: string;
      description?: string;
      isActive?: boolean;
      safetyLevel: "SAFE" | "MODERATE" | "RESTRICTED" | "CAUTION" | "UNSAFE";
    };
  }[];
  brand?: {
    id?: string;
    name: string;
    country?: string | null;
    logoUrl?: string | null;
  };
  category?: {
    id?: string;
    name: string;
  };

  concerns?: {
    skinConcern?: {
      name: string;
      description?: string;
    };
  }[];
  skinTypes?: {
    skinType?: {
      name: string;
    };
  }[];
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
