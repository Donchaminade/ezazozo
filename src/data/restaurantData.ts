import { MenuItem, ReviewItem, TikTokVideo } from '../types';

export const RESTAURANT_INFO = {
  name: 'EZA ZOZO',
  tagline: 'Poissonnerie & Grillade d’Exception',
  city: 'Lomé, Togo',
  address: 'Boulevard Circulaire / Face Plage & Zone Portuaire, Lomé',
  secondaryAddress: 'Point Relais Tokoin Habitat, Lomé',
  whatsappNumber: '+22890123456',
  whatsappDisplay: '+228 90 12 34 56',
  phoneSecondary: '+228 70 88 99 00',
  email: 'contact@ezazozo-lome.tg',
  openingHours: 'Lundi au Dimanche : 11h00 – 23h30 (Non-stop)',
  tiktokHandle: '@ezazozo_officiel',
  tiktokUrl: 'https://www.tiktok.com/@ezazozo_officiel',
  instagramHandle: '@ezazozo.lome',
  currency: 'FCFA',
  deliveryZones: [
    'Bè & Zone Portuaire (500 FCFA)',
    'Tokoin & Nyékonakpoè (1 000 FCFA)',
    'Hedzranawoé & Déckon (1 000 FCFA)',
    'Agoè & Totsi (1 500 FCFA)',
    'Adidogomé & Légbassito (2 000 FCFA)',
    'Baguilda & Avepozo (2 000 FCFA)'
  ]
};

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'dorade-royale',
    name: 'Dorade Royale Braisée au Feu de Bois',
    category: 'poissons',
    price: 6500,
    description: 'Pêche du jour marinée aux herbes fraîches et badigeonnée de la marinade secrète Eza Zozo. Chair tendre et peau croustillante aux braises.',
    image: '/src/assets/images/menu_dorade_braisee_1790838440746.jpg',
    isSpecialty: true,
    spicyLevel: 2,
    weightGrams: '~800g',
    portion: 'Pour 1 à 2 personnes',
    popular: true
  },
  {
    id: 'capitaine-lome',
    name: 'Capitaine Entier Grillé du Port de Lomé',
    category: 'poissons',
    price: 8000,
    description: 'Le poisson noble par excellence. Chair ferme et blanche, grillée à coeur avec son coulis d’oignons caramélisés et piment maison.',
    image: '/src/assets/images/hero_grilled_fish_1790838427559.jpg',
    isSpecialty: true,
    spicyLevel: 2,
    weightGrams: '~950g',
    portion: 'Pour 2 personnes',
    popular: true
  },
  {
    id: 'carpe-rouge',
    name: 'Carpe Rouge Crousti-Fondante aux Épices',
    category: 'poissons',
    price: 7000,
    description: 'Marinée au gingembre sauvage, ail rôti et graines de poivre de Penja. Une saveur fumée intense relevée au citron vert.',
    image: '/src/assets/images/menu_dorade_braisee_1790838440746.jpg',
    spicyLevel: 1,
    weightGrams: '~850g',
    portion: 'Pour 1 à 2 personnes'
  },
  {
    id: 'bar-sauvage-xl',
    name: 'Grand Bar / Mérou Sauvage Braisé XL',
    category: 'poissons',
    price: 9500,
    description: 'Sélection prestige des marins-pêcheurs de Lomé. Grillade lente aux braises de bois d’acacia, arrosé au beurre d’herbes épicé.',
    image: '/src/assets/images/hero_grilled_fish_1790838427559.jpg',
    isSpecialty: true,
    spicyLevel: 2,
    weightGrams: '~1.2kg',
    portion: 'Pour 2 à 3 personnes',
    popular: true
  },
  {
    id: 'plateau-royal-adanlete',
    name: 'Plateau Royal "Signature Mr Adanlete"',
    category: 'plateaux',
    price: 18500,
    description: 'Le festin ultime : 1 Grand Bar braisé, 6 Gambas géantes au piment doux, Alloco fondant, Attiéké moelleux, Frites maison et duo de sauces.',
    image: '/src/assets/images/menu_plateau_royal_1790838452721.jpg',
    isSpecialty: true,
    spicyLevel: 2,
    portion: 'Pour 3 à 4 convives',
    popular: true
  },
  {
    id: 'plateau-lome-by-night',
    name: 'Plateau Festif "Lomé Plage"',
    category: 'plateaux',
    price: 14000,
    description: '1 Dorade Royale + 1 Capitaine braisé + Brochettes d’escargots de mer ou crevettes sautées, avec double portion d’alloco et légumes sautés.',
    image: '/src/assets/images/menu_plateau_royal_1790838452721.jpg',
    spicyLevel: 2,
    portion: 'Pour 2 à 3 personnes'
  },
  {
    id: 'combo-solo-grillade',
    name: 'Combo Solo Gourmand Express',
    category: 'plateaux',
    price: 4500,
    description: 'Demi-poisson braisé au choix + Portion généreuse d’Alloco ou Attiéké + Jus de Bissap ou Gingembre artisanal.',
    image: '/src/assets/images/menu_dorade_braisee_1790838440746.jpg',
    spicyLevel: 1,
    portion: 'Idéal pour le midi',
    popular: true
  },
  {
    id: 'alloco-dore',
    name: 'Alloco Bananes Plantains Caramélisées',
    category: 'accompagnements',
    price: 1000,
    description: 'Plantains mûrs découpés en dés dorés à point, croustillants à l’extérieur et fondants à l’intérieur. Servi avec piment écrasé.',
    image: '/src/assets/images/menu_dorade_braisee_1790838440746.jpg',
    spicyLevel: 1,
    portion: 'Portion généreuse'
  },
  {
    id: 'attieke-authentique',
    name: 'Attiéké Frais Graine Fine & Oignons',
    category: 'accompagnements',
    price: 1000,
    description: 'Semoule de manioc cuite à la vapeur, légère, acidulée juste comme il faut, arrosée d’un filet de jus de cuisson.',
    image: '/src/assets/images/menu_dorade_braisee_1790838440746.jpg',
    portion: 'Portion généreuse'
  },
  {
    id: 'frites-maison',
    name: 'Frites Maison Croustillantes au Paprika Doux',
    category: 'accompagnements',
    price: 1000,
    description: 'Pommes de terre fraîches coupées main, double friture dorée et assaisonnées de sel aux épices Eza Zozo.',
    image: '/src/assets/images/menu_plateau_royal_1790838452721.jpg',
    portion: 'Portion généreuse'
  },
  {
    id: 'legumes-sautes',
    name: 'Poêlée de Légumes Croquants à l’Ail',
    category: 'accompagnements',
    price: 1500,
    description: 'Poivrons tricolores, oignons rouges de Lomé, carottes et tomates braisées au wok avec un trait d’huile parfumée.',
    image: '/src/assets/images/menu_plateau_royal_1790838452721.jpg',
    portion: 'Portion d’accompagnement'
  },
  {
    id: 'piment-noir-shito',
    name: 'Pot de Piment Noir Maison "Spécialité Eza Zozo"',
    category: 'accompagnements',
    price: 1500,
    description: 'Condiment traditionnel mijoté 6 heures à base de crevettes séchées, gingembre, piment rouge et aromates du terroir.',
    image: '/src/assets/images/menu_plateau_royal_1790838452721.jpg',
    spicyLevel: 3,
    portion: 'Pot 150ml à emporter'
  },
  {
    id: 'bissap-menthe',
    name: 'Jus de Bissap Maison & Menthe Fraîche',
    category: 'boissons',
    price: 1000,
    description: 'Fleurs d’hibiscus du Togo infusées avec vanille, feuilles de menthe fraîche et une touche subtile d’ananas. Servi très glacé.',
    image: '/src/assets/images/chef_adanlete_grill_1790838467936.jpg',
    portion: 'Bouteille 50cl'
  },
  {
    id: 'gingembre-citron',
    name: 'Pur Jus de Gingembre & Citron Vert',
    category: 'boissons',
    price: 1000,
    description: 'Pression à froid de racines de gingembre bio de Kpalimé, jus de citron vert et sucre de canne. Tonique et rafraîchissant.',
    image: '/src/assets/images/chef_adanlete_grill_1790838467936.jpg',
    portion: 'Bouteille 50cl'
  },
  {
    id: 'cocktail-eza-zozo',
    name: 'Mocktail Tropical Eza Zozo',
    category: 'boissons',
    price: 2000,
    description: 'Mélange signature : Fruit de la passion, mangue fraîche écrasée, zeste de citron et pointe de gingembre pétillant.',
    image: '/src/assets/images/chef_adanlete_grill_1790838467936.jpg',
    isSpecialty: true,
    portion: 'Grand verre 40cl'
  }
];

export const TIKTOK_VIDEOS: TikTokVideo[] = [
  {
    id: 'tiktok-1',
    title: 'Le secret de la marinade secrète Eza Zozo',
    views: '384.2K',
    likes: '48.9K',
    duration: '0:42',
    coverImage: '/src/assets/images/chef_adanlete_grill_1790838467936.jpg',
    caption: 'Mr Adanlete vous dévoile comment faire chanter les épices sur la braise ! #EzaZozo #Lome #PoissonGrille #TogoFood',
    tag: 'Tendance #1'
  },
  {
    id: 'tiktok-2',
    title: 'Arrivage du matin au Port de Pêche de Lomé',
    views: '215.8K',
    likes: '29.3K',
    duration: '0:35',
    coverImage: '/src/assets/images/hero_grilled_fish_1790838427559.jpg',
    caption: 'Direct de la pirogue à la grille. Pas de congélateur, zéro triche : 100% frais chaque jour. #FraicheurGarantie',
    tag: 'Fraîcheur'
  },
  {
    id: 'tiktok-3',
    title: 'Montage du Plateau Royal 4 Personnes',
    views: '512.0K',
    likes: '74.1K',
    duration: '0:58',
    coverImage: '/src/assets/images/menu_plateau_royal_1790838452721.jpg',
    caption: 'Quand la table tremble sous la générosité ! Alloco fondant, dorade dorée et grosses gambas. #Gourmandise #LomeFood',
    tag: 'Viral 🔥'
  },
  {
    id: 'tiktok-4',
    title: 'La minute Alloco : le crousti-moelleux parfait',
    views: '198.4K',
    likes: '23.7K',
    duration: '0:30',
    coverImage: '/src/assets/images/menu_dorade_braisee_1790838440746.jpg',
    caption: 'La technique ancestrale pour des plantains jamais gras et bien caramélisés. #AllocoLome #EzaZozo',
    tag: 'Recette'
  }
];

export const REVIEWS: ReviewItem[] = [
  {
    id: 'rev-1',
    author: 'Koffi Mensah',
    role: 'Client Régulier',
    location: 'Lomé - Tokoin',
    avatar: 'KM',
    rating: 5,
    comment: 'Franchement, le goût de la braise est unique. Mr Adanlete et son équipe respectent le poisson. L’alloco est toujours chaud et croustillant. C’est devenu notre QG du vendredi soir.',
    date: 'Il y a 3 jours',
    verifiedOrder: 'Plateau Royal Mr Adanlete'
  },
  {
    id: 'rev-2',
    author: 'Afiwa Delali',
    role: 'Créatrice de contenu & Foodie',
    location: 'Lomé - Agoè',
    avatar: 'AD',
    rating: 5,
    comment: 'J’ai vu les vidéos sur TikTok et j’ai commandé via WhatsApp : livré à Agoè en 40 minutes, encore fumant ! La marinade a pénétré la chair jusqu’aux arêtes. 10/10 sans hésiter.',
    date: 'La semaine dernière',
    verifiedOrder: 'Capitaine Grillé + Alloco + Jus de Bissap'
  },
  {
    id: 'rev-3',
    author: 'Jean-Baptiste D.',
    role: 'Diaspora en vacances',
    location: 'Paris / Lomé Bè',
    avatar: 'JB',
    rating: 5,
    comment: 'Dès que j’atterris à l’aéroport de Lomé, mon premier arrêt c’est Eza Zozo. L’ambiance est conviviale, le poisson est impeccablement vidé et assaisonné. Merci à Mr Adanlete pour cette fierté togolaise.',
    date: 'Il y a 2 semaines',
    verifiedOrder: 'Dorade Royale + Attiéké'
  }
];

export const formatPrice = (price: number): string => {
  return price.toLocaleString('fr-FR') + ' FCFA';
};

export const createWhatsAppOrderLink = (
  items: { name: string; quantity: number; price: number; notes?: string }[],
  total: number,
  deliveryType: string,
  customerName?: string,
  customerAddress?: string
): string => {
  let message = `*COMMANDE EZA ZOZO (Lomé)* 🐟🔥\n`;
  message += `------------------------------\n`;
  if (customerName) message += `*Client :* ${customerName}\n`;
  message += `*Mode :* ${deliveryType}\n`;
  if (customerAddress) message += `*Adresse/Zone :* ${customerAddress}\n`;
  message += `------------------------------\n*Plats commandés :*\n`;

  items.forEach((it, idx) => {
    message += `${idx + 1}. ${it.quantity}x ${it.name} - ${formatPrice(it.price * it.quantity)}\n`;
    if (it.notes) {
      message += `   _Préférence : ${it.notes}_\n`;
    }
  });

  message += `------------------------------\n`;
  message += `*TOTAL ESTIMÉ :* ${formatPrice(total)}\n\n`;
  message += `Bonjour Mr Adanlete & l'équipe Eza Zozo, je souhaite confirmer cette commande. Merci de me préciser le délai de préparation !`;

  return `https://wa.me/22890123456?text=${encodeURIComponent(message)}`;
};
