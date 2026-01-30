export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "SUPER_ADMIN" | "ADMIN" | "USER";
}

export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING" | "SUSPENDED";

export interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
  profileImage?: string | null;
  isVerified: boolean;
  isActive: boolean;
  addresses: IAddress[];
  reviews: IReview[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserUpdate {
  name?: string;
  email?: string;
  phone?: string | null;
  role?: "SUPER_ADMIN" | "ADMIN" | "USER";
  profileImage?: string | null;
  isVerified?: boolean;
  isActive?: boolean;
}

export interface IAddress {
  id: string;
  userId: string;
  label?: string | null;
  name: string;
  street: string;
  city: string;
  district: string;
  postalCode?: string | null;
  country: string;
  isDefault: boolean;
  user?: IUser;
}

export interface IReview {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment?: string | null;
  user?: IUser;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsersResponse {
  users: IUser[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface RoleChangeRequest {
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
  reason?: string;
}
