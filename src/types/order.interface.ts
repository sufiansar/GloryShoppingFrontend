export enum OrderStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    SHIPPED = "SHIPPED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED",
}



export interface IOrderItem {
  id: string;
  orderId: string;
  productVariantId: string;
  quantity: number;
  price: number;
  productVariant?: {
    id: string;
    name: string;
    product?: {
      id: string;
      name: string;
    };
  };
}

export interface DeliveryInput {
  name?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode?: string;
  deliveryCharge?: number;
}

export interface DeliveryDetails extends DeliveryInput {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryCharge: number;
}

export interface IOrder {
  id: string;
  userId: string;
  status: OrderStatus;
  amount: number;
  orderDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  items: IOrderItem[];
  deliveryDetails: DeliveryDetails;
}

type CheckoutType = "CART" | "DIRECT";

export interface CheckoutInput {
  type: CheckoutType;
  cartItemIds?: string[];
  variantId?: string;
  quantity?: number;
  delivery: DeliveryInput;
}

// Admin specific interfaces
export interface OrdersApiResponse {
  data: IOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrderStatsResponse {
  totalOrders: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  revenue: number;
  averageOrderValue: number;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: IOrder;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface OrdersListResponse {
  success: boolean;
  message: string;
  data: IOrder[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
