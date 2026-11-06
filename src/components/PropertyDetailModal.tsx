import React, { useState } from 'react';
import {
  X,
  Phone,
  MapPin,
  Maximize2,
  Layers,
  Compass,
  Car,
  Receipt,
  Calendar,
  Building,
  Store,
  Home,
  ChevronLeft,
  ChevronRight,
  Share2,
  Check,
  MessageSquare,
  AlertCircle,
} from 'lucide-react';
import { Property, PropertyType, TransactionType } from '../types';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onOpenInquiry: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onOpenInquiry,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!property) return null;

  const images =
    property.images && property.images.length > 0
      ? property.images
      : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const getPropertyTypeLabel = (type: PropertyType) => {
    switch (type) {
      case 'apartment':
        return { label: '아파트', icon: Building, color: 'text-blue-700 bg-blue-50' };
      case 'commercial':
        return { label: '상가', icon: Store, color: 'text-amber-800 bg-amber-50' };
      case 'oneroom':
        return { label: '원룸/투룸', icon: Home, color: 'text-emerald-800 bg-emerald-50' };
      default:
        return { label: '부동산', icon: Building, color: 'text-slate-800 bg-slate-50' };
    }
  };

  const getTransactionTypeLabel = (type: TransactionType) => {
    switch (type) {
      case 'sale':
        return '매매';
      case 'jeonse':
        return '전세';
      case 'monthly':
        return '월세';
      case 'rent':
        return '임대';
      default:
        return '거래';
    }
  };

  const typeInfo = getPropertyTypeLabel(property.propertyType);
  const TypeIcon = typeInfo.icon;

  const supplyPyung = property.supplyArea ? (property.supplyArea * 0.3025).toFixed(1) : null;
  const exclusivePyung = property.exclusiveArea ? (property.exclusiveArea * 0.3025).toFixed(1) : null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1 ${typeInfo.color}`}>
              <TypeIcon className="w-3.5 h-3.5" />
              {typeInfo.label}
            </span>
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#0F1E36] text-white">
              {getTransactionTypeLabel(property.transactionType)}
            </span>
            {property.status === 'completed' && (
              <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-600 text-white">
                거래완료
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              title="링크 복사"
            >
              {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="닫기"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 space-y-6">
          {/* Photo Gallery */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 bg-slate-900 rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={images[activeImageIndex]}
                alt={`${property.title} - 사진 ${activeImageIndex + 1}`}
                className="w-full h-full object-contain sm:object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="이전 사진"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                    aria-label="다음 사진"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 right-3 px-3 py-1 bg-black/60 text-white text-xs rounded-full font-medium">
                    {activeImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all ${
                      activeImageIndex === idx ? 'border-amber-500 scale-102' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`썸네일 ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price Section */}
          <div className="border-b border-slate-200 pb-5">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                {property.title}
              </h2>
              <div className="text-2xl sm:text-3xl font-black text-amber-700 shrink-0">
                {property.price || (property.deposit ? `보증금 ${property.deposit} / ${property.monthlyRent || '협의'}` : '가격 협의')}
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                {property.address} {property.addressDetail || ''}
              </span>
            </div>

            {property.features && property.features.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {property.features.map((feature, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-medium"
                  >
                    #{feature}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Specs Table */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0F1E36]"></span>
              매물 기본 정보
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <Maximize2 className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <div className="text-xs text-slate-500">전용/공급 면적</div>
                  <div className="font-semibold text-slate-800">
                    {property.exclusiveArea ? `${property.exclusiveArea}㎡` : '-'}
                    {exclusivePyung && ` (${exclusivePyung}평)`}
                    {property.supplyArea && (
                      <span className="text-xs text-slate-500 block">
                        공급 {property.supplyArea}㎡ ({supplyPyung}평)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <Layers className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <div className="text-xs text-slate-500">해당층 / 총층</div>
                  <div className="font-semibold text-slate-800">
                    {property.floor ? `${property.floor}층` : '-'} / {property.totalFloors ? `${property.totalFloors}층` : '-'}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <Compass className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <div className="text-xs text-slate-500">방향 (거실/출입구)</div>
                  <div className="font-semibold text-slate-800">
                    {property.direction || '정보 없음'}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <Car className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <div className="text-xs text-slate-500">주차 가능 여부</div>
                  <div className="font-semibold text-slate-800">
                    {property.parking || '가능 (협의)'}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <Receipt className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <div className="text-xs text-slate-500">월 관리비</div>
                  <div className="font-semibold text-slate-800">
                    {property.maintenanceCost || '관리규약에 따름'}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                <Calendar className="w-5 h-5 text-slate-400 shrink-0" />
                <div>
                  <div className="text-xs text-slate-500">입주 가능일</div>
                  <div className="font-semibold text-slate-800">
                    {property.moveInDate || '즉시 입주 협의'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Commercial Specific Info */}
          {property.propertyType === 'commercial' && (
            <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-200/80 space-y-3">
              <h3 className="text-sm font-bold text-amber-900 flex items-center gap-1.5">
                <Store className="w-4 h-4 text-amber-700" />
                상가 전문 분석 정보
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
                <div>
                  <span className="text-amber-800/80 block text-xs">보증금 / 월세</span>
                  <span className="font-bold text-amber-950">
                    {property.deposit ? `${property.deposit} / ${property.monthlyRent || '-'}` : property.price || '-'}
                  </span>
                </div>
                <div>
                  <span className="text-amber-800/80 block text-xs">권리금</span>
                  <span className="font-bold text-amber-950">{property.premium || '권리금 없음 / 협의'}</span>
                </div>
                <div>
                  <span className="text-amber-800/80 block text-xs">추천 업종</span>
                  <span className="font-bold text-amber-950">{property.recommendedUsage || '카페, 식당, 학원, 사무실 등'}</span>
                </div>
              </div>

              {property.commercialAnalysis && (
                <div className="pt-2 border-t border-amber-200/60">
                  <span className="text-xs font-semibold text-amber-900 block mb-1">상권 및 입지 분석</span>
                  <p className="text-xs sm:text-sm text-amber-950 leading-relaxed whitespace-pre-line">
                    {property.commercialAnalysis}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0F1E36]"></span>
              매물 상세 설명
            </h3>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-slate-700 text-sm leading-relaxed whitespace-pre-line">
              {property.description || '등록된 상세 설명이 없습니다.'}
            </div>
          </div>

          {/* Brokerage Guarantee Notice */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800 mb-0.5">
                수완신도시공인중개사사무소 중개 확인
              </p>
              <p>
                본 매물은 대표 공인중개사 김정민(등록번호: 가4106-852)이 현장 확인 및 권리관계를 정밀 검토한 실매물입니다. 계약 전 등기부등본 및 건축물대장을 실시간 열람하여 안전한 거래를 보증합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Bottom CTA Bar */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 sticky bottom-0 z-20">
          <div className="text-center sm:text-left">
            <div className="text-xs text-slate-500">전화 문의 시 &quot;홈페이지 매물 보고 연락드렸습니다&quot; 말씀해 주세요.</div>
            <div className="font-bold text-slate-900 text-sm">
              수완신도시공인중개사사무소 (대표 김정민)
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => onOpenInquiry(property)}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm shadow-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4 text-slate-600" />
              <span>상담 문의 접수</span>
            </button>

            <a
              href="tel:010-7568-4183"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#0F1E36] hover:bg-[#162a4d] text-white font-bold text-sm shadow-md transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>010-7568-4183 전화 상담</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
