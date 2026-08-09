// Core type definitions for Sanjeevani platform

// User roles
export type UserRole =
  | 'farmer'
  | 'wholesaler'
  | 'mandi_trader'
  | 'retailer'
  | 'buyer_restaurant'
  | 'ngo_verified'
  | 'ngo_pending'
  | 'admin';

// Organization types
export type OrgType =
  | 'farmer'
  | 'wholesaler'
  | 'retailer'
  | 'restaurant'
  | 'ngo'
  | 'buyer';

// Listing status
export type ListingStatus = 'active' | 'low_stock' | 'closed' | 'rescued';

// Order status
export type OrderStatus = 'placed' | 'negotiating' | 'confirmed' | 'fulfilled' | 'rejected' | 'expired';

// Risk tier
export type RiskTier = 'fresh' | 'slight' | 'moderate' | 'high' | 'critical';

// Agent name
export type AgentName = 'producer_agent' | 'buyer_agent' | 'system';

// Event types for live log
export type EventType =
  | 'search_start'
  | 'search_complete'
  | 'offer_made'
  | 'counter_offer'
  | 'accepted'
  | 'rejected'
  | 'inventory_update'
  | 'reservation_failed'
  | 'auto_rescue'
  | 'low_stock_warning'
  | 'error';

// User interface
export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  orgId: string;
  verified: boolean;
}

// Organization interface
export interface Organization {
  id: string;
  name: string;
  type: OrgType;
  state: string;
  city: string;
  lat: number;
  lng: number;
  acceptedProduceTypes: string[];
  verified: boolean;
}

// Produce types available in India
export const PRODUCE_TYPES = [
  'Tomato',
  'Potato',
  'Onion',
  'Cabbage',
  'Cauliflower',
  'Carrot',
  'Beans',
  'Peas',
  'Cucumber',
  'Cauliflower',
  'Lady Finger',
  'Gourd',
  'Bitter Gourd',
  'Apple',
  'Mango',
  'Banana',
  'Guava',
  'Papaya',
  'Orange',
  'Pomegranate',
] as const;

export type ProduceType = typeof PRODUCE_TYPES[number];

// Listing interface
export interface Listing {
  id: string;
  orgId: string;
  produceType: ProduceType;
  quantityTotal: number; // in kg
  quantityAvailable: number; // in kg, real-time
  pricePerKg: number; // in ₹
  harvestOrArrivalTs: string; // ISO date
  storageTemp: number;
  storageHumidity: number;
  images: string[];
  status: ListingStatus;
  wasteRiskScore: number; // 0-100
  estimatedDaysRange: [number, number];
  confidence: number; // 0-1
  riskTier: RiskTier;
  createdAt: string;
  updatedAt: string;
}

// Need/Standing order interface
export interface Need {
  id: string;
  orgId: string;
  produceType: ProduceType;
  quantityPerPeriod: number;
  period: 'weekly' | 'daily' | 'monthly';
  maxPrice: number;
  maxDistanceKm: number;
  isOneOff: boolean;
  createdAt: string;
}

// Freshness assessment
export interface FreshnessAssessment {
  id: string;
  listingId: string;
  wasteRiskScore: number;
  estimatedDaysRange: [number, number];
  confidence: number;
  riskTier: RiskTier;
  modelVersion: string;
  ts: string;
}

// Demand forecast
export interface DemandForecast {
  id: string;
  orgId: string;
  produceType: ProduceType;
  suggestedQtyMin: number;
  suggestedQtyMax: number;
  rationale: string; // e.g., "Last 4 weeks avg: 42kg, monsoon typically -10%"
  modelVersion: string;
  ts: string;
}

// Order interface
export interface Order {
  id: string;
  listingId: string;
  buyerOrgId: string;
  quantity: number;
  negotiatedPrice: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

// Negotiation session
export interface NegotiationSession {
  id: string;
  orderId: string;
  roundCount: number;
  finalPrice?: number;
  finalQty?: number;
  outcome: 'accepted' | 'rejected' | 'expired';
}

// Agent event (for live log)
export interface AgentEvent {
  id: string;
  sessionId?: string;
  listingId?: string;
  agentName: AgentName;
  eventType: EventType;
  payload: Record<string, unknown>;
  humanReadableText: string;
  statusColor: 'amber' | 'blue' | 'green' | 'red';
  ts: string;
}

// Certificate
export interface Certificate {
  id: string;
  orgId: string;
  kgSaved: number;
  periodStart: string;
  periodEnd: string;
  pdfUrl: string;
}

// Dashboard view modes
export type ViewMode = 'producer' | 'buyer' | 'ngo';

// Location coordinates
export interface Location {
  lat: number;
  lng: number;
}

// Search filters for buyer
export interface SearchFilters {
  produceType?: ProduceType;
  maxPrice?: number;
  maxDistanceKm?: number;
  minRiskScore?: number;
  maxRiskScore?: number;
  location?: Location;
}

// Waste analytics summary
export interface WasteAnalyticsSummary {
  totalListed: number;
  totalSold: number;
  totalRescued: number;
  totalLost: number;
  wastePercentage: number;
  rescuePercentage: number;
}

// NGO capacity
export interface NGOCapacity {
  orgId: string;
  currentCapacityKg: number;
  maxCapacityKg: number;
  allocationKg: number;
}