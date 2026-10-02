export type PropertyType = 
  | 'Luxury Modern Villa' 
  | 'KAFD Sky Penthouse' 
  | 'Contemporary Palace' 
  | 'Modern Townhome' 
  | 'Architectural Duplex' 
  | 'Executive Residence';

export type TransactionStatus = 'Available' | 'Hot Deal' | 'Price Drop' | 'Under Offer';

export interface VirtualTourHotspot {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  title: string;
  description: string;
  spec?: string;
}

export interface VirtualTourRoom {
  id: string;
  name: string;
  sqft: number; // in sqm or sqft
  imageUrl: string;
  ambientSoundTitle?: string;
  narration: string;
  hotspots: VirtualTourHotspot[];
}

export interface Agent {
  id: string;
  name: string;
  title: string;
  brokerage: string;
  phone: string;
  email: string;
  avatar: string;
  rating: number;
  reviewsCount: number;
  salesVolume: string;
  activeListingsCount: number;
  languages: string[];
  responseTime: string;
  bio: string;
  falLicense: string; // REGA Fal License number
}

export interface MarketMetrics {
  neighborhoodRating: number;
  walkScore: number;
  transitScore: number;
  schoolsScore: number;
  historicalAnnualAppreciation: number;
  forecast12mAppreciation: number;
  medianDaysOnMarket: number;
  saleToListRatio: number;
  estimatedRentalIncome: number; // monthly in SAR
  capRate: number;
  propertyTaxAnnual: number; // or maintenance/RETT
  hoaMonthly: number;
}

export interface Property {
  id: string;
  title: string;
  titleAr?: string;
  tagline: string;
  price: number; // In Saudi Riyals (SAR)
  originalPrice?: number;
  address: string;
  district: string; // e.g. Hittin, Al Malqa, Al Nakheel, KAFD
  city: string; // Riyadh
  zip: string;
  coordinates: {
    lat: number;
    lng: number;
    mapX: number; // 0-100
    mapY: number; // 0-100
  };
  beds: number;
  baths: number;
  sqm: number; // Built-up area in square meters
  pricePerSqm: number;
  landAreaSqm: number; // Land area in square meters
  yearBuilt: number;
  propertyType: PropertyType;
  status: TransactionStatus;
  images: string[];
  tags: string[];
  description: string;
  features: string[];
  marketMetrics: MarketMetrics;
  virtualTourRooms: VirtualTourRoom[];
  agent: Agent;
  aiMatchScore?: number;
  aiMatchReason?: string;
  warranties: {
    structuralYears: number; // e.g. 10 years Malath insurance
    plumbingYears: number;
    electricalYears: number;
  };
}

export interface BuyerProfile {
  budgetMin: number; // in SAR
  budgetMax: number;
  downPaymentPercent: number;
  preferredDistricts: string[];
  minBeds: number;
  minBaths: number;
  propertyTypes: PropertyType[];
  mustHaveAmenities: string[];
  purchaseTimeline: string;
  targetMonthlyPayment: number;
  priority: 'luxury_lifestyle' | 'investment_roi' | 'kafd_proximity' | 'family_schools';
}

export interface MortgageQuote {
  id: string;
  lenderName: string;
  lenderNameAr: string;
  lenderLogo: string;
  financeType: 'Murabaha (مرابحة)' | 'Ijara (إجارة)' | 'Subsidized Sakani (سكني)';
  profitRate: number; // Annual profit rate %
  apr: number;
  monthlyInstallment: number; // SAR
  downPaymentRequiredPercent: number;
  termYears: number;
  recommendedTag?: string;
}

export interface LegalDocument {
  id: string;
  docType: 'rega_purchase_agreement' | 'araboon_deposit_receipt' | 'letter_of_intent' | 'structural_warranty_addendum';
  title: string;
  createdAt: string;
  status: 'Draft' | 'Ready for Signature' | 'Signed' | 'Ejar / REGA Registered';
  propertyAddress: string;
  buyerName: string;
  sellerName: string;
  offerPriceSAR: number;
  earnestMoneySAR: number;
  rettTaxSAR: number; // 5% Real Estate Transaction Tax
  content: string;
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  text: string;
  timestamp: string;
  actionPayload?: {
    type: 'tour_booked' | 'offer_drafted' | 'fal_verified' | 'call_requested';
    data?: any;
  };
}

export interface PriceAlert {
  id: string;
  type: 'property' | 'criteria';
  propertyId?: string;
  propertyTitle?: string;
  propertyImage?: string;
  district?: string;
  propertyType?: string;
  initialPrice: number;
  currentPrice: number;
  targetPrice: number;
  targetDropPercent: number;
  email: string;
  channels: {
    inApp: boolean;
    email: boolean;
    whatsapp: boolean;
  };
  frequency: 'instant' | 'daily';
  active: boolean;
  createdAt: string;
  isTriggered: boolean;
  triggeredDetails?: {
    oldPrice: number;
    newPrice: number;
    savingsSAR: number;
    dropPercent: number;
    date: string;
  };
}

