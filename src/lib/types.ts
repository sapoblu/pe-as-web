// Tipos principais da plataforma

export type AnnouncementType = "normal" | "premium" | "new";

export type DeliveryMethod = "sedex" | "transportadora" | "onibus";

export type TransactionStatus = 
  | "pending_payment" 
  | "payment_confirmed" 
  | "shipped" 
  | "delivered" 
  | "confirmed" 
  | "disputed";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  rating: number;
  totalSales: number;
  totalPurchases: number;
  createdAt: Date;
  isSeller: boolean;
  isVerified: boolean;
}

export interface Location {
  city: string;
  state: string;
  zipCode?: string;
}

export interface Seller extends User {
  businessName?: string;
  isPartner: boolean;
  partnerType?: "store" | "junkyard" | "individual";
}

export interface Announcement {
  id: string;
  title: string;
  description: string;
  price: number;
  type: AnnouncementType;
  videoUrl: string;
  thumbnailUrl: string;
  additionalPhotos?: string[];
  seller: Seller;
  location: Location;
  vehicleBrand: string;
  vehicleModel?: string;
  vehicleYear?: string;
  partCondition: "new" | "used" | "rebuilt";
  views: number;
  comments: Comment[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isFeatured: boolean;
}

export interface Comment {
  id: string;
  announcementId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  videoUrl?: string; // Para vídeos de confirmação de recebimento
  isSellerResponse: boolean;
  createdAt: Date;
  parentCommentId?: string; // Para respostas
}

export interface Transaction {
  id: string;
  announcementId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  commission: number;
  commissionPercentage: number;
  status: TransactionStatus;
  paymentMethod: "credit_card" | "pix" | "boleto";
  deliveryMethod: DeliveryMethod;
  trackingCode?: string;
  shippingVideoUrl?: string;
  confirmationVideoUrl?: string;
  createdAt: Date;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  confirmedAt?: Date;
}

export interface Rating {
  id: string;
  transactionId: string;
  fromUserId: string;
  toUserId: string;
  rating: number; // 1-5
  qualityRating?: number;
  deliveryRating?: number;
  communicationRating?: number;
  transparencyRating?: number;
  comment?: string;
  createdAt: Date;
}

export interface JunkyardVehicle {
  id: string;
  sellerId: string;
  vehicleBrand: string;
  vehicleModel: string;
  vehicleYear: string;
  videoUrl: string;
  thumbnailUrl: string;
  location: Location;
  availableParts: string[];
  removedParts: string[]; // Peças já removidas
  createdAt: Date;
  updatedAt: Date;
}

export interface PartRequest {
  id: string;
  junkyardVehicleId: string;
  userId: string;
  partName: string;
  status: "pending" | "available" | "sold" | "unavailable";
  price?: number;
  videoUrl?: string; // Vídeo da peça removida
  createdAt: Date;
  respondedAt?: Date;
}

export interface Commission {
  normal: number; // 8%
  premium: number; // 15%
  new: number; // 5%
}

export const COMMISSION_RATES: Commission = {
  normal: 0.08,
  premium: 0.15,
  new: 0.05,
};

export function calculateCommission(price: number, type: AnnouncementType): number {
  return price * COMMISSION_RATES[type];
}

export function calculateSellerAmount(price: number, type: AnnouncementType): number {
  return price - calculateCommission(price, type);
}
