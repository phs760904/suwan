import React, { useState, useMemo } from 'react';
import {
  MapPin,
  Building,
  Store,
  Home,
  SlidersHorizontal,
  Search,
  ListFilter,
  CheckCircle2,
} from 'lucide-react';
import { Property, PropertyType, TransactionType } from '../types';
import { KakaoMapContainer } from '../components/KakaoMapContainer';
import { PropertyCard } from '../components/PropertyCard';

interface MapPageProps {
  properties: Property[];
  onOpenDetail: (property: Property) => void;
}

export const MapPage: React.FC<MapPageProps> = ({ properties, onOpenDetail }) => {
  const [selectedType, setSelectedType] = useState<PropertyType | 'all'>('all');
  const [selectedTx, setSelectedTx] = useState<TransactionType | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      if (p.isVisible === false) return false;
      if (selectedType !== 'all' && p.propertyType !== selectedType) return false;
      if (selectedTx !== 'all' && p.transactionType !== selectedTx) return false;
      if (searchKeyword.trim()) {
        const query = searchKeyword.trim().toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchAddress = p.address.toLowerCase().includes(query);
        const matchFeatures = p.features?.some((f) => f.toLowerCase().includes(query));
        if (!matchTitle && !matchAddress && !matchFeatures) return false;
      }
      return true;
    });
  }, [properties, selectedType, selectedTx, searchKeyword]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>수완신도시공인중개사사무소</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36]">
            광주 수완지구 지도매물
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            지도를 자유롭게 확대·축소하여 위치별 아파트, 상가, 원룸 매물을 확인하세요.
          </p>
        </div>

        <div className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-3.5 py-2 rounded-xl flex items-center gap-2 self-start sm:self-auto">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>검색된 매물: <strong className="text-slate-900">{filteredProperties.length}</strong>건</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        {/* Type Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-600 mr-1 flex items-center gap-1">
            <ListFilter className="w-3.5 h-3.5 text-slate-400" />
            매물종류:
          </span>
          {[
            { id: 'all', label: '전체' },
            { id: 'apartment', label: '아파트' },
            { id: 'commercial', label: '상가' },
            { id: 'oneroom', label: '원룸' },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                selectedType === type.id
                  ? 'bg-[#0F1E36] text-amber-400 shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {/* Transaction Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-bold text-slate-600 mr-1">거래유형:</span>
          {[
            { id: 'all', label: '전체' },
            { id: 'sale', label: '매매' },
            { id: 'jeonse', label: '전세' },
            { id: 'monthly', label: '월세' },
            { id: 'rent', label: '임대' },
          ].map((tx) => (
            <button
              key={tx.id}
              onClick={() => setSelectedTx(tx.id as any)}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                selectedTx === tx.id
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tx.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="w-full lg:w-72 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="단지명, 동이름, 키워드 검색"
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0F1E36] focus:bg-white"
          />
        </div>
      </div>

      {/* Main Split Content: Left Map (large), Right Listing (or scrollable cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Map Column (7 cols on lg) */}
        <div className="lg:col-span-7">
          <KakaoMapContainer
            properties={filteredProperties}
            selectedProperty={selectedProperty}
            onSelectProperty={setSelectedProperty}
            onOpenDetail={onOpenDetail}
            filterType={selectedType}
            filterTransaction={selectedTx}
          />
        </div>

        {/* Right List Column (5 cols on lg) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0F1E36]"></span>
              지도 연동 매물 목록 ({filteredProperties.length}건)
            </h3>
            <span className="text-xs text-slate-400">카드를 누르면 상세 이동</span>
          </div>

          <div className="space-y-3 max-h-[560px] overflow-y-auto pr-1">
            {filteredProperties.length > 0 ? (
              filteredProperties.map((prop) => (
                <div
                  key={prop.id}
                  onMouseEnter={() => setSelectedProperty(prop)}
                  className={`transition-all ${
                    selectedProperty?.id === prop.id ? 'ring-2 ring-amber-500 rounded-xl' : ''
                  }`}
                >
                  <PropertyCard
                    property={prop}
                    onSelect={() => onOpenDetail(prop)}
                    compact={true}
                  />
                </div>
              ))
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 text-center space-y-2">
                <Building className="w-8 h-8 text-slate-300 mx-auto" />
                <div className="font-bold text-slate-700 text-sm">등록된 매물이 없습니다</div>
                <p className="text-xs text-slate-500">
                  선택하신 필터 조건에 부합하는 매물이 존재하지 않습니다.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
