import React, { useState } from 'react';
import {
  Search,
  Building,
  Store,
  Home,
  MapPin,
  Phone,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
  Map,
  CheckCircle,
  HelpCircle,
} from 'lucide-react';
import { Property, PropertyType, TransactionType } from '../types';
import { PropertyCard } from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  properties: Property[];
  onSelectProperty: (property: Property) => void;
  onNavigateTab: (tabId: string, initialFilter?: { type?: PropertyType | 'all'; tx?: TransactionType | 'all'; query?: string }) => void;
  onOpenConsultation: (property?: Property) => void;
  onSeedSampleData?: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  properties,
  onSelectProperty,
  onNavigateTab,
  onOpenConsultation,
  onSeedSampleData,
}) => {
  const { isAdmin } = useAuth();
  const [searchType, setSearchType] = useState<PropertyType | 'all'>('all');
  const [searchTx, setSearchTx] = useState<TransactionType | 'all'>('all');
  const [searchKeyword, setSearchKeyword] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigateTab('list', {
      type: searchType,
      tx: searchTx,
      query: searchKeyword.trim(),
    });
  };

  // Filter recommendations & latest
  const featuredProperties = properties.filter((p) => p.isFeatured && p.isVisible !== false);
  const latestProperties = properties.filter((p) => p.isVisible !== false).slice(0, 6);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative bg-[#0B172A] text-white pt-16 pb-24 px-4 sm:px-8 overflow-hidden">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-amber-500/30 text-amber-400 text-xs sm:text-sm font-semibold shadow-xs">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>수완신도시공인중개사사무소 공식 홈페이지</span>
          </div>

          {/* Main Brand Tagline */}
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            부동산의 가치
          </h1>

          {/* Secondary Subtitle */}
          <p className="text-base sm:text-xl text-slate-300 font-medium max-w-2xl mx-auto leading-relaxed">
            광주 수완지구 부동산의 새로운 기준,{' '}
            <span className="text-amber-400 font-bold">수완신도시공인중개사사무소</span>
          </p>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
            아파트 · 상가 · 원룸 매매 및 임대 전문 | 공인중개사 김정민 1:1 책임중개
          </p>

          {/* SEARCH BAR WIDGET */}
          <div className="pt-6 max-w-4xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white rounded-2xl p-4 sm:p-5 shadow-2xl text-slate-800 border border-slate-100 flex flex-col gap-4 text-left"
            >
              {/* Type Switcher Tabs */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-500 mr-2">매물 구분:</span>
                  {[
                    { id: 'all', label: '전체' },
                    { id: 'apartment', label: '아파트' },
                    { id: 'commercial', label: '상가' },
                    { id: 'oneroom', label: '원룸' },
                  ].map((tab) => (
                    <button
                      type="button"
                      key={tab.id}
                      onClick={() => setSearchType(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        searchType === tab.id
                          ? 'bg-[#0F1E36] text-amber-400 shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-500 mr-2">거래 유형:</span>
                  {[
                    { id: 'all', label: '전체' },
                    { id: 'sale', label: '매매' },
                    { id: 'jeonse', label: '전세' },
                    { id: 'monthly', label: '월세' },
                    { id: 'rent', label: '임대' },
                  ].map((tab) => (
                    <button
                      type="button"
                      key={tab.id}
                      onClick={() => setSearchTx(tab.id as any)}
                      className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                        searchTx === tab.id
                          ? 'bg-amber-600 text-white'
                          : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Keyword & Search Button */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                  <input
                    type="text"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    placeholder="단지명, 지역명(수완동, 장덕동, 신창동), 특징 검색 (예: 호수공원, 올수리, 1층상가)"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0F1E36] focus:bg-white transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-3 bg-[#0F1E36] hover:bg-[#162a4d] text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4 text-amber-400" />
                  <span>매물 검색하기</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PROPERTIES (추천 매물) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 tracking-wider uppercase mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>수완신도시공인중개사사무소 추천</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] tracking-tight">
              이 달의 추천 매물
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('list')}
            className="text-xs sm:text-sm font-bold text-[#0F1E36] hover:text-amber-700 flex items-center gap-1 group"
          >
            <span>전체 매물 보기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {featuredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center space-y-3">
            <Building className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">현재 등록된 추천 매물이 없습니다</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              수완신도시공인중개사사무소에서 엄선한 추천 매물이 곧 업데이트됩니다. 필요하신 조건이 있으시면 전화 상담 주시기 바랍니다.
            </p>
            {isAdmin && onSeedSampleData && (
              <div className="pt-2">
                <button
                  onClick={onSeedSampleData}
                  className="px-4 py-2 bg-[#0F1E36] text-amber-400 text-xs font-bold rounded-lg shadow-xs hover:bg-[#162a4d]"
                >
                  [관리자용] 수완지구 추천 실매물 샘플 3건 등록
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 3. LATEST PROPERTIES (신규 등록 매물) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6 pb-3 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 tracking-wider uppercase mb-1">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>실시간 확인 매물</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F1E36] tracking-tight">
              신규 등록 매물
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('list')}
            className="text-xs sm:text-sm font-bold text-[#0F1E36] hover:text-amber-700 flex items-center gap-1 group"
          >
            <span>목록 전체보기</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {latestProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestProperties.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                onSelect={onSelectProperty}
              />
            ))}
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 text-center space-y-3">
            <Building className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-700">등록된 매물이 없습니다</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              현재 등록된 매물이 없습니다. 관리자 페이지에서 첫 매물을 등록해 보세요.
            </p>
            {isAdmin && onSeedSampleData && (
              <div className="pt-2">
                <button
                  onClick={onSeedSampleData}
                  className="px-4 py-2 bg-[#0F1E36] text-amber-400 text-xs font-bold rounded-lg shadow-xs hover:bg-[#162a4d]"
                >
                  [관리자용] 수완지구 실매물 샘플 3건 등록
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* 4. MAP TEASER BANNER (지도에서 매물 찾기) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-r from-[#0F1E36] to-[#1E3A8A] rounded-2xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 text-amber-400 text-xs font-bold">
              <Map className="w-3.5 h-3.5" />
              <span>실시간 지도 연동</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              광주 수완지구 지도에서 매물 한눈에 찾기
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">
              수완호수공원, 장덕동 학군, 중심상업지구 등 원하는 위치의 아파트와 상가 매물을 지도 위에서 편리하게 비교해 보세요.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={() => onNavigateTab('map')}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4 text-slate-900" />
              <span>지도매물 바로가기</span>
            </button>
          </div>
        </div>
      </section>

      {/* 5. ABOUT BROKERAGE OFFICE (사무소 소개) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 uppercase tracking-wider">
              <Award className="w-4 h-4 text-amber-600" />
              <span>공인중개사 김정민</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F1E36] tracking-tight">
              고객의 신뢰를 바탕으로<br />
              <span className="text-amber-700">&quot;부동산의 진정한 가치&quot;</span>를 전합니다
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              <strong>수완신도시공인중개사사무소</strong>는 광주광역시 수완지구 내 아파트, 상가, 원룸 등 모든 부동산의 정확한 시세 분석과 정밀한 권리분석을 통해 안전하고 투명한 중개 서비스를 제공합니다.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              단순한 계약 체결에 그치지 않고, 고객 한 분 한 분의 소중한 자산 가치가 극대화될 수 있도록 정직과 성실로 끝까지 함께하겠습니다.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-500 mb-1">중개등록번호</div>
                <div className="font-bold text-slate-900 text-sm">가4106-852</div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="text-xs text-slate-500 mb-1">사업자등록번호</div>
                <div className="font-bold text-slate-900 text-sm">410-27-44691</div>
              </div>
            </div>
          </div>

          {/* Core Values Card */}
          <div className="bg-slate-50 rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-base mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-600" />
              수완신도시공인중개사사무소 3대 약속
            </h3>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#0F1E36] text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                01
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">100% 현장 확인 실매물</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  허위 매물이나 과장된 가격 없이, 직접 답사하고 확인한 정직한 매물만 안내합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#0F1E36] text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                02
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">철저한 법률 및 권리분석</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  등기부등본, 건축물대장, 토지이용계획 등 공적장부를 정밀 분석하여 법적 위험을 원천 차단합니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-[#0F1E36] text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                03
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">상권 및 시세 맞춤 컨설팅</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  수완지구의 상권 흐름과 주거 선호도에 맞춰 최적의 매물과 가격 협상을 이끌어냅니다.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL BANNER & QUICK CONSULTATION (전화 상담) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#0F1E36] rounded-2xl p-8 sm:p-12 text-center text-white space-y-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              대표 공인중개사 김정민 직통 상담
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              광주 수완지구 부동산의 모든 것,<br />지금 바로 상담받으세요
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              매물 문의, 매물 접수(내놓기), 상가 창업 및 입지 분석 등 친절하게 안내해 드립니다.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="tel:010-7568-4183"
                className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-lg rounded-xl shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5 text-slate-950" />
                <span>010-7568-4183 전화하기</span>
              </a>

              <button
                onClick={() => onOpenConsultation()}
                className="w-full sm:w-auto px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>온라인 상담 문의 남기기</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
