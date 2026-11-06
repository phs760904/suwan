import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Building,
  Store,
  Home,
  ArrowUpDown,
  RotateCcw,
  CheckCircle2,
} from 'lucide-react';
import { Property, PropertyType, TransactionType } from '../types';
import { PropertyCard } from '../components/PropertyCard';

interface ListPageProps {
  properties: Property[];
  onOpenDetail: (property: Property) => void;
  initialType?: PropertyType | 'all';
  initialTx?: TransactionType | 'all';
  initialQuery?: string;
}

export const ListPage: React.FC<ListPageProps> = ({
  properties,
  onOpenDetail,
  initialType = 'all',
  initialTx = 'all',
  initialQuery = '',
}) => {
  const [selectedType, setSelectedType] = useState<PropertyType | 'all'>(initialType);
  const [selectedTx, setSelectedTx] = useState<TransactionType | 'all'>(initialTx);
  const [searchKeyword, setSearchKeyword] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<'latest' | 'priceAsc' | 'priceDesc'>('latest');

  // Filter and Sort properties
  const filteredAndSortedProperties = useMemo(() => {
    let result = properties.filter((p) => {
      if (p.isVisible === false) return false;
      if (selectedType !== 'all' && p.propertyType !== selectedType) return false;
      if (selectedTx !== 'all' && p.transactionType !== selectedTx) return false;

      if (searchKeyword.trim()) {
        const query = searchKeyword.trim().toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchAddress = p.address.toLowerCase().includes(query);
        const matchDetail = (p.description || '').toLowerCase().includes(query);
        const matchFeatures = p.features?.some((f) => f.toLowerCase().includes(query));
        if (!matchTitle && !matchAddress && !matchDetail && !matchFeatures) return false;
      }
      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'latest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'priceAsc') {
        return (a.priceValue || 0) - (b.priceValue || 0);
      }
      if (sortBy === 'priceDesc') {
        return (b.priceValue || 0) - (a.priceValue || 0);
      }
      return 0;
    });

    return result;
  }, [properties, selectedType, selectedTx, searchKeyword, sortBy]);

  const handleResetFilters = () => {
    setSelectedType('all');
    setSelectedTx('all');
    setSearchKeyword('');
    setSortBy('latest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              수완신도시공인중개사사무소 매물 DB
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] tracking-tight mt-1">
              목록매물 검색
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              광주 수완지구 아파트, 상가, 원룸 전 매물을 정밀 조건으로 검색하세요.
            </p>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-2 self-start sm:self-auto">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              총 <strong className="text-slate-900 font-bold">{filteredAndSortedProperties.length}</strong>개의 실매물이 검색되었습니다.
            </span>
          </div>
        </div>
      </div>

      {/* Main Filter Control Box */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-5">
        {/* Row 1: Property Type Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-2">
            1. 매물 종류 선택
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'all', label: '전체 매물', desc: '모든 종류' },
              { id: 'apartment', label: '아파트', desc: '대단지·주거' },
              { id: 'commercial', label: '상가', desc: '상권·점포' },
              { id: 'oneroom', label: '원룸/투룸', desc: '주거·오피스텔' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedType(tab.id as any)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedType === tab.id
                    ? 'border-[#0F1E36] bg-[#0F1E36] text-white shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <div className={`text-sm font-bold ${selectedType === tab.id ? 'text-amber-400' : 'text-slate-900'}`}>
                  {tab.label}
                </div>
                <div className={`text-[11px] ${selectedType === tab.id ? 'text-slate-300' : 'text-slate-500'}`}>
                  {tab.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Transaction Type & Sort & Reset */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
          {/* Transaction Type */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">
              2. 거래 유형
            </label>
            <div className="flex flex-wrap gap-1.5">
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
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    selectedTx === tx.id
                      ? 'bg-amber-600 text-white font-bold'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tx.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Keyword Input */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">
              3. 키워드 검색
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="단지명, 도로명, 특징 (예: 올확장)"
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:ring-2 focus:ring-[#0F1E36] focus:bg-white"
              />
            </div>
          </div>

          {/* Sort By & Reset */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-2">
              4. 정렬 방식
            </label>
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="flex-1 py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-[#0F1E36]"
              >
                <option value="latest">최신 등록순</option>
                <option value="priceAsc">가격 낮은순</option>
                <option value="priceDesc">가격 높은순</option>
              </select>

              <button
                type="button"
                onClick={handleResetFilters}
                className="p-2 border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
                title="필터 초기화"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Property Cards Grid */}
      {filteredAndSortedProperties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedProperties.map((prop) => (
            <PropertyCard
              key={prop.id}
              property={prop}
              onSelect={onOpenDetail}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-16 text-center space-y-3">
          <Building className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-700">조건에 맞는 등록된 매물이 없습니다</h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            검색 필터를 재설정하시거나, 원하시는 조건의 매물을 수완신도시공인중개사사무소(010-7568-4183)로 문의해 주시면 맞춤 매물을 즉시 찾아드립니다.
          </p>
          <div className="pt-2">
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-[#0F1E36] text-white rounded-xl text-xs font-bold hover:bg-[#162a4d] transition-colors"
            >
              필터 초기화하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
