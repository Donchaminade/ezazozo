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
    image: '/images/menu/dorade.jpg',
    galleryImages: [
      '/images/menu/dorade.jpg',
      '/images/angle-grill-close.jpg',
      '/images/angle-fish-alloco.jpg',
      '/images/community-friends.jpg'
    ],
    rating: 4.9,
    reviewCount: 52,
    marinadeNotes: 'Marinade de 12 heures infusée aux herbes sauvages du Togo, ail rôti, gingembre frais et huile d’olive infusée aux graines de poivre de Penja.',
    cookingTime: '25 à 30 min sur braise ardente d’acacia',
    ingredients: ['Dorade royale fraîche de l’Atlantique', 'Gingembre de Kpalimé', 'Ail rôti au feu', 'Persil & céleri sauvage', 'Piment vert doux', 'Citron vert de Tsévié'],
    recommendedSides: ['Alloco doré au piment écrasé', 'Attiéké graine fine', 'Sauce piment noir Shito maison'],
    reviews: [
      {
        id: 'rev-dr-1',
        author: 'Emmanuel Ayivi',
        avatar: 'EA',
        location: 'Tokoin Habitat, Lomé',
        rating: 5,
        date: 'Il y a 2 jours',
        comment: 'La dorade était succulente, la peau croustillante et l’intérieur ultra juteux. La meilleure marinade de Lomé !',
        verifiedOrder: true
      },
      {
        id: 'rev-dr-2',
        author: 'Séfako Mensah',
        avatar: 'SM',
        location: 'Nyékonakpoè',
        rating: 5,
        date: 'Il y a 5 jours',
        comment: 'Portion très généreuse, servie brûlante avec un alloco sucré bien caramélisé. Mention spéciale au piment noir.',
        verifiedOrder: true
      },
      {
        id: 'rev-dr-3',
        author: 'Patrick K.',
        avatar: 'PK',
        location: 'Bè-Kpota',
        rating: 4.8,
        date: 'La semaine dernière',
        comment: 'Goût fumé incomparable du feu de bois. On sent que le poisson a été pêché le matin même.',
        verifiedOrder: true
      }
    ],
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
    image: '/images/menu/capitaine.jpg',
    galleryImages: [
      '/images/menu/capitaine.jpg',
      '/images/angle-grill-close.jpg',
      '/images/angle-fish-alloco.jpg',
      '/images/chef.jpg'
    ],
    rating: 5.0,
    reviewCount: 68,
    marinadeNotes: 'Baigné dans une émulsion de beurre d’aromates, ciboulette locale, pointe de moutarde douce et poivre noir concassé au mortier traditionnel.',
    cookingTime: '30 à 35 min de grillade progressive',
    ingredients: ['Capitaine sauvage entier frais', 'Oignons rouges confits', 'Ail pilé', 'Feuilles de laurier togolaises', 'Huile parfumée', 'Fleur de sel'],
    recommendedSides: ['Attiéké vapeur moelleux', 'Alloco crousti-fondant', 'Rondelles d’oignons et tomates fraîches'],
    reviews: [
      {
        id: 'rev-cap-1',
        author: 'Dr. Foli Adjamagbo',
        avatar: 'FA',
        location: 'Boulevard Circulaire, Lomé',
        rating: 5,
        date: 'Hier soir',
        comment: 'Le capitaine est tout simplement royal ! Aucun goût d’eau, une chair blanche nacrée qui se détache toute seule.',
        verifiedOrder: true
      },
      {
        id: 'rev-cap-2',
        author: 'Bénédicte Lawson',
        avatar: 'BL',
        location: 'Agoè Téléphone',
        rating: 5,
        date: 'Il y a 3 jours',
        comment: 'Livré à Agoè encore fumant dans son emballage thermique. Toute la famille s’est régalée.',
        verifiedOrder: true
      }
    ],
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
    image: '/images/menu/carpe.jpg',
    galleryImages: [
      '/images/menu/carpe.jpg',
      '/images/menu/shito.jpg',
      '/images/angle-grill-close.jpg'
    ],
    rating: 4.8,
    reviewCount: 39,
    marinadeNotes: 'Recette secrète épicée aux zestes de combava, échalotes torréfiées et piments doux écrasés sur pierre.',
    cookingTime: '25 min au feu vif',
    ingredients: ['Carpe rouge de haute mer', 'Gingembre sauvage', 'Ail en chemise', 'Poivre de Penja', 'Citrons verts'],
    recommendedSides: ['Frites maison croustillantes', 'Sauce verte aux fines herbes'],
    reviews: [
      {
        id: 'rev-cr-1',
        author: 'Roland Akouete',
        avatar: 'RA',
        location: 'Déckon, Lomé',
        rating: 5,
        date: 'Il y a 4 jours',
        comment: 'La peau était croustillante à souhait et le gingembre apporte un peps incroyable.',
        verifiedOrder: true
      }
    ],
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
    image: '/images/menu/bar-xl.jpg',
    galleryImages: [
      '/images/menu/bar-xl.jpg',
      '/images/angle-grill-close.jpg',
      '/images/community-table.jpg',
      '/images/angle-fish-alloco.jpg'
    ],
    rating: 5.0,
    reviewCount: 74,
    marinadeNotes: 'Marinade noble au thym frais de montagne, oignons blancs caramélisés, réduction d’agrumes et piment doux fumé.',
    cookingTime: '35 min de cuisson lente et maîtrisée',
    ingredients: ['Bar / Mérou sauvage XL (+1.2kg)', 'Beurre clarifié aux herbes', 'Thym frais', 'Poivre noir moulu', 'Citron jaune & vert'],
    recommendedSides: ['Double portion alloco', 'Attiéké grand format', 'Poêlée de légumes croquants'],
    reviews: [
      {
        id: 'rev-bar-1',
        author: 'Koffi Mensah',
        avatar: 'KM',
        location: 'Bè-Plage, Lomé',
        rating: 5,
        date: 'Il y a 1 jour',
        comment: 'Un monstre de saveur ! La taille est impressionnante et la chair reste fondante jusqu’à l’arête.',
        verifiedOrder: true
      },
      {
        id: 'rev-bar-2',
        author: 'Afiwa G.',
        avatar: 'AG',
        location: 'Hedzranawoé',
        rating: 5,
        date: 'Il y a 6 jours',
        comment: 'C’est notre commande rituelle du dimanche soir. Mr Adanlete ne déçoit jamais !',
        verifiedOrder: true
      }
    ],
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
    image: '/images/menu/plateau-royal.jpg',
    galleryImages: [
      '/images/menu/plateau-royal.jpg',
      '/images/community-table.jpg',
      '/og-image.jpg',
      '/images/angle-fish-alloco.jpg'
    ],
    rating: 5.0,
    reviewCount: 91,
    marinadeNotes: 'La quintessence du savoir-faire Eza Zozo : marinades personnalisées pour le bar et les gambas royales, braisées côte à côte.',
    cookingTime: '35 à 40 min de préparation artisanale',
    ingredients: ['1 Bar entier braisé XL', '6 Gambas royales grillées', 'Alloco bananes mûres', 'Attiéké frais', 'Frites croustillantes', 'Duo sauces piquante et douce'],
    recommendedSides: ['Tout est déjà inclus avec générosité !'],
    reviews: [
      {
        id: 'rev-pr-1',
        author: 'Marc & Émilie Dosseh',
        avatar: 'MD',
        location: 'Tokoin Casablanca',
        rating: 5,
        date: 'Il y a 2 jours',
        comment: 'Commandé pour l’anniversaire de mon épouse. Tout le monde a été ébloui par la présentation et la qualité des gambas.',
        verifiedOrder: true
      },
      {
        id: 'rev-pr-2',
        author: 'Club des Amis de Lomé',
        avatar: 'CA',
        location: 'Nyékonakpoè',
        rating: 5,
        date: 'Il y a 5 jours',
        comment: 'Rapport qualité-prix imbattable à Lomé pour 4 personnes. Les poissons sont d’une fraîcheur exceptionnelle.',
        verifiedOrder: true
      }
    ],
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
    image: '/images/menu/plateau-plage.jpg',
    galleryImages: [
      '/images/menu/plateau-plage.jpg',
      '/images/community-friends.jpg',
      '/images/angle-grill-close.jpg'
    ],
    rating: 4.9,
    reviewCount: 44,
    marinadeNotes: 'Duo de marinades complémentaires pour faire ressortir le fondant de la dorade et la fermeté du capitaine.',
    cookingTime: '30 à 35 min',
    ingredients: ['1 Dorade entière', '1 Capitaine entier', 'Crevettes marinées', 'Double portion alloco', 'Légumes sautés au wok'],
    recommendedSides: ['Inclus : Alloco et Légumes'],
    reviews: [
      {
        id: 'rev-pl-1',
        author: 'Clarisse Tetteh',
        avatar: 'CT',
        location: 'Zone Portuaire, Lomé',
        rating: 5,
        date: 'Il y a 3 jours',
        comment: 'Parfait pour un dîner en amoureux ou entre collègues. Copieux et savoureux.',
        verifiedOrder: true
      }
    ],
    spicyLevel: 2,
    portion: 'Pour 2 à 3 personnes'
  },
  {
    id: 'combo-solo-grillade',
    name: 'Combo Solo Gourmand Express',
    category: 'plateaux',
    price: 4500,
    description: 'Demi-poisson braisé au choix + Portion généreuse d’Alloco ou Attiéké + Jus de Bissap ou Gingembre artisanal.',
    image: '/images/menu/combo-solo.jpg',
    galleryImages: [
      '/images/menu/combo-solo.jpg',
      '/images/menu/alloco.jpg'
    ],
    rating: 4.8,
    reviewCount: 63,
    marinadeNotes: 'Marinade express minute sur braise intense.',
    cookingTime: '20 min',
    ingredients: ['Demi-poisson braisé frais', 'Alloco ou Attiéké au choix', 'Boisson artisanale 50cl'],
    recommendedSides: ['Piment noir maison'],
    reviews: [
      {
        id: 'rev-solo-1',
        author: 'Arsène K.',
        avatar: 'AK',
        location: 'Assivito, Lomé',
        rating: 5,
        date: 'Il y a 2 jours',
        comment: 'Le repas de midi parfait au bureau. Rapide, chaud et super rassasiant.',
        verifiedOrder: true
      }
    ],
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
    image: '/images/menu/alloco.jpg',
    galleryImages: [
      '/images/menu/alloco.jpg',
      '/images/angle-fish-alloco.jpg'
    ],
    rating: 5.0,
    reviewCount: 110,
    marinadeNotes: 'Sélection des plantains parfaitement mûrs (peau jaune tachetée de noir). Friture dorée à l’huile propre et légère.',
    cookingTime: '10 à 15 min',
    ingredients: ['Bananes plantains locales mûres', 'Pincée de sel pur', 'Huile de friture végétale neuve'],
    recommendedSides: ['Se marie idéalement avec tous les poissons braisés'],
    reviews: [
      {
        id: 'rev-alo-1',
        author: 'Amina B.',
        avatar: 'AB',
        location: 'Tokoin Douane',
        rating: 5,
        date: 'Hier',
        comment: 'L’alloco est fondant et naturellement sucré comme il faut. Ni trop gras ni sec, un 10/10.',
        verifiedOrder: true
      }
    ],
    spicyLevel: 1,
    portion: 'Portion généreuse'
  },
  {
    id: 'attieke-authentique',
    name: 'Attiéké Frais Graine Fine & Oignons',
    category: 'accompagnements',
    price: 1000,
    description: 'Semoule de manioc cuite à la vapeur, légère, acidulée juste comme il faut, arrosée d’un filet de jus de cuisson.',
    image: '/images/menu/attieke.jpg',
    galleryImages: [
      '/images/menu/attieke.jpg',
      '/images/angle-fish-alloco.jpg'
    ],
    rating: 4.9,
    reviewCount: 57,
    cookingTime: 'Prêt immédiatement (vapeur continue)',
    ingredients: ['Manioc fermenté de tradition', 'Dés d’oignons rouges', 'Persil haché', 'Jus de braisage'],
    recommendedSides: ['Indispensable avec la Carpe Rouge et le Bar Sauvage'],
    reviews: [
      {
        id: 'rev-atk-1',
        author: 'Didier T.',
        avatar: 'DT',
        location: 'Kodjoviakopé, Lomé',
        rating: 5,
        date: 'Il y a 3 jours',
        comment: 'Graine très fine, moelleuse, pas sèche du tout. Parfaitement aérée.',
        verifiedOrder: true
      }
    ],
    portion: 'Portion généreuse'
  },
  {
    id: 'frites-maison',
    name: 'Frites Maison Croustillantes au Paprika Doux',
    category: 'accompagnements',
    price: 1000,
    description: 'Pommes de terre fraîches coupées main, double friture dorée et assaisonnées de sel aux épices Eza Zozo.',
    image: '/images/menu/frites.jpg',
    rating: 4.7,
    reviewCount: 32,
    portion: 'Portion généreuse'
  },
  {
    id: 'legumes-sautes',
    name: 'Poêlée de Légumes Croquants à l’Ail',
    category: 'accompagnements',
    price: 1500,
    description: 'Poivrons tricolores, oignons rouges de Lomé, carottes et tomates braisées au wok avec un trait d’huile parfumée.',
    image: '/images/menu/legumes.jpg',
    rating: 4.8,
    reviewCount: 26,
    portion: 'Portion d’accompagnement'
  },
  {
    id: 'piment-noir-shito',
    name: 'Pot de Piment Noir Maison "Spécialité Eza Zozo"',
    category: 'accompagnements',
    price: 1500,
    description: 'Condiment traditionnel mijoté 6 heures à base de crevettes séchées, gingembre, piment rouge et aromates du terroir.',
    image: '/images/menu/shito.jpg',
    rating: 5.0,
    reviewCount: 88,
    spicyLevel: 3,
    portion: 'Pot 150ml à emporter'
  },
  {
    id: 'bissap-menthe',
    name: 'Jus de Bissap Maison & Menthe Fraîche',
    category: 'boissons',
    price: 1000,
    description: 'Fleurs d’hibiscus du Togo infusées avec vanille, feuilles de menthe fraîche et une touche subtile d’ananas. Servi très glacé.',
    image: '/images/menu/bissap.jpg',
    rating: 4.9,
    reviewCount: 65,
    portion: 'Bouteille 50cl'
  },
  {
    id: 'gingembre-citron',
    name: 'Pur Jus de Gingembre & Citron Vert',
    category: 'boissons',
    price: 1000,
    description: 'Pression à froid de racines de gingembre bio de Kpalimé, jus de citron vert et sucre de canne. Tonique et rafraîchissant.',
    image: '/images/menu/gingembre.jpg',
    rating: 5.0,
    reviewCount: 71,
    portion: 'Bouteille 50cl'
  },
  {
    id: 'cocktail-eza-zozo',
    name: 'Mocktail Tropical Eza Zozo',
    category: 'boissons',
    price: 2000,
    description: 'Mélange signature : Fruit de la passion, mangue fraîche écrasée, zeste de citron et pointe de gingembre pétillant.',
    image: '/images/menu/mocktail.jpg',
    rating: 4.9,
    reviewCount: 43,
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
    coverImage: '/images/chef.jpg',
    caption: 'Mr Adanlete vous dévoile comment faire chanter les épices sur la braise ! #EzaZozo #Lome #PoissonGrille #TogoFood',
    tag: 'Tendance #1'
  },
  {
    id: 'tiktok-2',
    title: 'Arrivage du matin au Port de Pêche de Lomé',
    views: '215.8K',
    likes: '29.3K',
    duration: '0:35',
    coverImage: '/images/port-morning.jpg',
    caption: 'Direct de la pirogue à la grille. Pas de congélateur, zéro triche : 100% frais chaque jour. #FraicheurGarantie',
    tag: 'Fraîcheur'
  },
  {
    id: 'tiktok-3',
    title: 'Montage du Plateau Royal 4 Personnes',
    views: '512.0K',
    likes: '74.1K',
    duration: '0:58',
    coverImage: '/images/menu/plateau-royal.jpg',
    caption: 'Quand la table tremble sous la générosité ! Alloco fondant, dorade dorée et grosses gambas. #Gourmandise #LomeFood',
    tag: 'Viral 🔥'
  },
  {
    id: 'tiktok-4',
    title: 'La minute Alloco : le crousti-moelleux parfait',
    views: '198.4K',
    likes: '23.7K',
    duration: '0:30',
    coverImage: '/images/menu/alloco.jpg',
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
