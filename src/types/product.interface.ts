// types/product.ts
export interface Product {
  name: string; // Acts as the identifier
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
  tags: string[]; // Array of tag names
  isActive: boolean;
}
