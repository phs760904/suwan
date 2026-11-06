export type PropertyType = 'apartment' | 'commercial' | 'oneroom';
export type TransactionType = 'sale' | 'jeonse' | 'monthly' | 'rent';
export type PropertyStatus = 'available' | 'completed';

export interface Property {
  id: string;
  title: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  price?: string; // e.g. "5억 2,000만원", "보증금 3,000 / 월 150"
  priceValue?: number; // Numeric value in 10,000 KRW for sorting
  deposit?: string; // 보증금
  monthlyRent?: string; // 월세
  premium?: string; // 권리금 (상가용)
  address: string; // 도로명/지번 주소
  addressDetail?: string; // 동/호수 또는 상세 위치
  lat?: number;
  lng?: number;
  supplyArea?: number; // 공급면적 (m²)
  exclusiveArea?: number; // 전용면적 (m²)
  floor?: number; // 해당 층
  totalFloors?: number; // 전체 층
  direction?: string; // 남향, 남동향 등
  parking?: string; // 주차 가능 여부/대수
  maintenanceCost?: string; // 관리비
  moveInDate?: string; // 입주 가능일
  recommendedUsage?: string; // 상가 추천 업종
  commercialAnalysis?: string; // 상권 및 입지 설명
  description?: string; // 매물 상세 설명
  features?: string[]; // 핵심 특징 태그 리스트
  images?: string[]; // 사진 URL 또는 DataURL
  mainImageIndex?: number; // 대표 사진 인덱스
  status: PropertyStatus; // 거래가능 / 거래완료
  isVisible: boolean; // 공개 노출 여부
  isFeatured?: boolean; // 추천 매물 여부
  viewCount?: number;
  authorUid?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PropertyFilter {
  propertyType?: PropertyType | 'all';
  transactionType?: TransactionType | 'all';
  searchQuery?: string;
  sortBy?: 'latest' | 'priceAsc' | 'priceDesc';
  status?: PropertyStatus | 'all';
}

export interface Inquiry {
  id: string;
  name: string;
  phone: string;
  propertyId?: string;
  propertyTitle?: string;
  message: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

export interface AdminUser {
  uid: string;
  email: string;
  name?: string;
  role: 'admin' | 'superadmin';
  createdAt?: string;
}
