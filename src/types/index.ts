export type CategoryType = 'all' | 'poissons' | 'plateaux' | 'accompagnements' | 'boissons';

export interface DishReview {
  id: string;
  author: string;
  avatar: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  location: string;
  verifiedOrder?: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryType;
  price: number; // in FCFA (XOF)
  description: string;
  image: string;
  galleryImages?: string[]; // Multiple angles of the dish
  rating?: number; // e.g. 4.9
  reviewCount?: number; // e.g. 48 avis
  reviews?: DishReview[]; // Comments specifically on this dish
  marinadeNotes?: string;
  cookingTime?: string;
  ingredients?: string[];
  recommendedSides?: string[];
  isSpecialty?: boolean;
  spicyLevel?: 0 | 1 | 2 | 3;
  weightGrams?: string;
  portion?: string;
  popular?: boolean;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  selectedSide?: string;
  spicyPreference?: string;
  notes?: string;
}

export interface PlatterConfiguration {
  fishType: string;
  fishPrice: number;
  size: 'Moyen' | 'Grand (+1 500 FCFA)' | 'XL Royal (+3 000 FCFA)';
  sizeExtra: number;
  sides: string[];
  spiceLevel: 'Doux (Sans piment)' | 'Moyen (Légèrement relevé)' | 'Pimenté Lomé (Authentique)';
  drink: string;
  drinkPrice: number;
  totalPrice: number;
}

export interface ReviewItem {
  id: string;
  author: string;
  role: string;
  location: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
  verifiedOrder: string;
}

export interface TikTokVideo {
  id: string;
  title: string;
  views: string;
  likes: string;
  duration: string;
  coverImage: string;
  caption: string;
  tag: string;
}
