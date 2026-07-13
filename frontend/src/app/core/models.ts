export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  displayOrder: number;
  active: boolean;
  translations?: TranslationMap;
}

export interface AllergenTag {
  id: number;
  code: string;
  name: string;
  icon: string;
  type: 'ALLERGEN' | 'DIET' | string;
  translations?: TranslationMap;
}

export interface AllergenTagRequest {
  code?: string;
  name?: string;
  icon: string;
  type: 'ALLERGEN' | 'DIET' | string;
  translations: TranslationMap;
}

export interface MenuItem {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl?: string;
  imageAssetId?: number;
  highlighted: boolean;
  active: boolean;
  displayOrder: number;
  category: Category;
  tags: AllergenTag[];
  translations?: TranslationMap;
}

export interface TranslationValue {
  name: string;
  description?: string;
}

export type TranslationMap = Record<string, TranslationValue>;

export interface RestaurantInfo {
  id: number;
  name: string;
  claim: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  openingHours: string;
  instagramUrl: string;
  googleMapsUrl: string;
}

export interface MenuItemRequest {
  name?: string;
  slug?: string;
  description?: string;
  price: number;
  imageUrl?: string;
  imageAssetId?: number | null;
  highlighted: boolean;
  active: boolean;
  displayOrder: number;
  categoryId: number;
  tagCodes: string[];
  translations: TranslationMap;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: 'ADMIN' | string;
}

export interface MediaAsset {
  id: number;
  fileName: string;
  originalFileName: string;
  contentType: string;
  size: number;
  url: string;
  createdAt: string;
}
