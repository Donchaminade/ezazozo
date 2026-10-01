export type CategoryType = 'all' | 'poissons' | 'plateaux' | 'accompagnements' | 'boissons';

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryType;
  price: number; // in FCFA (XOF)
  description: string;
  image: string;
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
