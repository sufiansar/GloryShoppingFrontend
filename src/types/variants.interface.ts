export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: string;
  images: string[];
  price?: number;
  stock?: number;
  lowStockThreshold?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
  product?: {
    id: string;
    name: string;
  };
}

export interface CreateProductVariant {
  productId: string;
  sku: string;
  size: string;
  images: string[];
  price?: number;
  stock?: number;
  lowStockThreshold?: number;
}
