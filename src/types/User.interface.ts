export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role?: "SUPER_ADMIN" | "ADMIN" | "USER";
}
