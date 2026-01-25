// types/order.ts
export interface ICartItem {
  id?: string;
  variantId: string;
  quantity: number;
  productName?: string;
  price?: number;
}

export interface DeliveryInput {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryCharge?: number;
}

export interface CheckoutInput {
  type: "CART" | "DIRECT";
  cartItemIds?: string[];
  variantId?: string;
  quantity?: number;
  delivery: DeliveryInput;
}

export interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  productVariantId: string;
  product: string;
  variant?: {
    product: {
      name: string;
    };
  };
}

export interface Delivery {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  deliveryCharge: number;
  status: string;
}

export interface Order {
  id: string;
  status: "PENDING" | "SHIPPED" | "COMPLETED" | "CANCELLED" | "PAID";
  amount: number;
  userId?: string;
  guestId?: string;
  items: OrderItem[];
  delivery?: Delivery;
  productTotal?: number;
  deliveryCharge?: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderResponse {
  success: boolean;
  message: string;
  data: Order;
}

export interface OrdersResponse {
  success: boolean;
  message: string;
  data: {
    data: Order[];
    meta: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}
