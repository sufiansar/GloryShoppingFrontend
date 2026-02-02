export interface OrderStats {
  last7Days: {
    totalOrders: number;
    totalRevenue: number;
  };
  last15Days: {
    totalOrders: number;
    totalRevenue: number;
  };
  last30Days: {
    totalOrders: number;
    totalRevenue: number;
  };
}

export interface BestProduct {
  productVariantId: string;
  totalSold: number;
  productName: string;
}

export interface CancelledProduct {
  productVariantId: string;
  totalCancelled: number;
}

export interface UserStats {
  totalUsers: number;
  adminUsers: number;
  superAdminUsers: number;
  customerUsers: number;
}

export interface CategoryStat {
  categoryId: string;
  categoryName: string;
  totalSold: number;
}
