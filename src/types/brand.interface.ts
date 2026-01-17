export interface Brand {
  id: string;
  name: string;
  slug?: string;
  country?: string | null;
  logoUrl?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface ICreateBrand {
  name: string;
  slug?: string;
  country?: string | null;
  logoUrl?: string | null;
}

export interface BrandResponse {
  data: Brand[];
  meta: {
    total: number;
    totalPages: number;
    currentPage: number;
    limit: number;
  };
}
