import React from 'react';
import { MapPin, Maximize2, Layers, CheckCircle2, Building, Store, Home, ArrowRight } from 'lucide-react';
import { Property, PropertyType, TransactionType } from '../types';

interface PropertyCardProps {
  property: Property;
  onSelect: (property: Property) => void;
  compact?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onSelect, compact = false }) => {
  const getPropertyTypeLabel = (type: PropertyType) => {
    switch (type) {
      case 'apartment':
        return { label: '아파트', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: Building };
      case 'commercial':
        return { label: '상가', color: 'bg-amber-50 text-amber-800 border-amber-200', icon: Store };
      case 'oneroom':
        return { label: '원룸/투룸', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: Home };
      default:
        return { label: '부동산', color: 'bg-slate-50 text-slate-700 border-slate-200', icon: Building };
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

  // Primary image
  const displayImage =
    property.images && property.images.length > 0
      ? property.images[property.mainImageIndex || 0] || property.images[0]
      : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

  // Area format in m² and pyung (1 m² ≈ 0.3025 평)
  const exclusivePyung = property.exclusiveArea
    ? (property.exclusiveArea * 0.3025).toFixed(1)
    : null;

  return (
    <div
      onClick={() => onSelect(property)}
      className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all cursor-pointer flex flex-col h-full"
    >
      {/* Image Container */}
      <div className={`relative overflow-hidden bg-slate-100 ${compact ? 'h-40' : 'h-52'}`}>
        <img
          src={displayImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-[#0F1E36] text-white shadow-xs">
            <TypeIcon className="w-3 h-3 text-amber-400" />
            {typeInfo.label}
          </span>
          <span className="px-2 py-1 rounded-md text-xs font-bold bg-white/95 text-slate-800 shadow-xs">
            {getTransactionTypeLabel(property.transactionType)}
          </span>
          {property.isFeatured && (
            <span className="px-2 py-1 rounded-md text-xs font-bold bg-amber-500 text-white shadow-xs">
              추천매물
            </span>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-3 right-3 z-10">
          {property.status === 'completed' ? (
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-600 text-white shadow-xs">
              거래완료
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-600/90 text-white shadow-xs">
              거래가능
            </span>
          )}
        </div>

        {/* Bottom price tag on photo */}
        <div className="absolute bottom-3 left-3 right-3 z-10 text-white">
          <div className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-sm text-amber-300">
            {property.price || (property.deposit ? `보증금 ${property.deposit} / ${property.monthlyRent || '협의'}` : '가격 협의')}
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title */}
          <h3 className="font-bold text-slate-900 text-base sm:text-lg line-clamp-1 group-hover:text-[#0F1E36] transition-colors mb-2">
            {property.title}
          </h3>

          {/* Address */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{property.address} {property.addressDetail || ''}</span>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-2 py-2.5 px-3 bg-slate-50 rounded-lg text-xs text-slate-700 mb-3 border border-slate-100">
            <div className="flex items-center gap-1.5">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span>
                전용 {property.exclusiveArea ? `${property.exclusiveArea}㎡` : '-'}{' '}
                {exclusivePyung && <span className="text-slate-500">({exclusivePyung}평)</span>}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {property.floor ? `${property.floor}층` : '-'} / {property.totalFloors ? `${property.totalFloors}층` : '-'}
              </span>
            </div>
          </div>

          {/* Feature Tags */}
          {property.features && property.features.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {property.features.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-sm bg-slate-100 text-slate-600 text-[11px] font-medium"
                >
                  #{tag}
                </span>
              ))}
              {property.features.length > 3 && (
                <span className="text-[11px] text-slate-400 self-center">
                  +{property.features.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
          <span className="text-xs text-slate-400 font-medium">수완신도시공인중개사</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(property);
            }}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#0F1E36] group-hover:text-amber-700 transition-colors"
          >
            <span>상세보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
