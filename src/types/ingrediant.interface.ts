export type SafetyLevel = "SAFE" | "MODERATE" | "RESTRICTED" | "CAUTION" | "UNSAFE";

export interface ProductIngredient {
  id?: string;
  productId: string;
  ingredientId: string;
  product?: {
    id: string;
    name: string;
  };
  ingredient?: IIngredient;
}

export interface IIngredient {
  id?: string;
  name: string;
  description?: string;
  isActive?: boolean;
  safetyLevel: SafetyLevel;
  products?: ProductIngredient[];
}

export interface IngredientFormData {
  name: string;
  description?: string;
  safetyLevel: SafetyLevel;
  isActive: boolean;
}
