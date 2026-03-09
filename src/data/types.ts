export interface WeightVariant {
  price: number;
  oldPrice: number;
}

export interface Nutrition {
  calories: string;
  protein: string;
  fat: string;
  carbs: string;
  fiber: string;
}

export interface Product {
  id: number;
  name: string;
  category: string;
  type: string;
  price: number;
  oldPrice: number;
  weight: string;
  weightVariants: Record<string, WeightVariant>;
  badge: string | null;
  badgeColor: string | null;
  description: string;
  fullDescription: string;
  benefits: string[];
  nutrition: Nutrition;
  image: string;
  images: string[];
  emoji: string;
  useEmoji: boolean;
  packagingType?: string;
}

export interface ProductData {
  heroImage: string;
  weightOptions: string[];
  products: Product[];
}
