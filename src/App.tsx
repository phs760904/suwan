import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Property, PropertyType, TransactionType } from './types';
import { subscribeToProperties, fetchProperties, createProperty } from './firebase/properties';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { InquiryModal } from './components/InquiryModal';

import { HomePage } from './pages/HomePage';
import { MapPage } from './pages/MapPage';
import { ListPage } from './pages/ListPage';
import { DirectionsPage } from './pages/DirectionsPage';
import { ConsultationPage } from './pages/ConsultationPage';
import { AdminPage } from './pages/AdminPage';

function AppContent() {
  const { isAdmin } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state passed from Home search to List page
  const [listFilters, setListFilters] = useState<{
    type?: PropertyType | 'all';
    tx?: TransactionType | 'all';
    query?: string;
  }>({ type: 'all', tx: 'all', query: '' });

  // Modal states
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryTargetProperty, setInquiryTargetProperty] = useState<Property | null>(null);

  // Subscribe to properties in Firestore
  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToProperties(
      isAdmin,
      (list) => {
        setProperties(list);
        setLoading(false);
      },
      (err) => {
        console.error('Properties load error:', err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [isAdmin]);

  const handleRefreshProperties = useCallback(async () => {
    try {
      const list = await fetchProperties(isAdmin);
      setProperties(list);
    } catch (err) {
      console.error('Refresh properties failed:', err);
    }
  }, [isAdmin]);

  const handleNavigateTab = (
    tabId: string,
    initialFilter?: { type?: PropertyType | 'all'; tx?: TransactionType | 'all'; query?: string }
  ) => {
    if (initialFilter) {
      setListFilters(initialFilter);
    }
    setCurrentTab(tabId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenConsultation = (prop?: Property) => {
    setInquiryTargetProperty(prop || null);
    setInquiryModalOpen(true);
  };

  // Seed sample Suwan properties for quick start
  const handleSeedSampleData = async () => {
    try {
      await createProperty({
        title: '수완지구 호수공원 전망 로얄층 올확장 남향 아파트',
        propertyType: 'apartment',
        transactionType: 'sale',
        price: '매매 5억 8,000만원',
        priceValue: 58000,
        address: '광주광역시 광산구 수완동 수완로 106',
        addressDetail: '105동 18층',
        lat: 35.1925,
        lng: 126.824,
        supplyArea: 112.5,
        exclusiveArea: 84.9,
        floor: 18,
        totalFloors: 25,
        direction: '정남향',
        parking: '세대당 1.4대 (지하 직결)',
        maintenanceCost: '평균 18만원',
        moveInDate: '2개월 내 협의 가능',
        description:
          '수완호수공원이 시원하게 내려다보이는 특급 로얄층입니다.\n올확장 및 내부 친환경 올수리 완료되어 손볼 곳 없이 입주 가능합니다.\n인근 초·중·고 도보 5분 거리 안심 통학권이며 채광 및 통풍이 우수합니다.',
        features: ['호수공원뷰', '올확장', '로얄층', '남향', '학군우수'],
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80',
        ],
        mainImageIndex: 0,
        isVisible: true,
        isFeatured: true,
        status: 'available',
        viewCount: 42,
        authorUid: 'admin',
        createdAt: new Date().toISOString(),
      });

      await createProperty({
        title: '수완지구 중심상업지구 1층 전면 코너 무권리 상가',
        propertyType: 'commercial',
        transactionType: 'rent',
        price: '보증금 5,000 / 월 280만원',
        priceValue: 5000,
        deposit: '5,000만원',
        monthlyRent: '280만원',
        premium: '무권리 (협의)',
        address: '광주광역시 광산구 장덕동 임방울대로 332',
        addressDetail: '1층 102호',
        lat: 35.1945,
        lng: 126.821,
        supplyArea: 85.0,
        exclusiveArea: 66.2,
        floor: 1,
        totalFloors: 6,
        direction: '동향 (대로변 전면)',
        parking: '상가 전용 주차타워 완비',
        maintenanceCost: '실비 정산',
        moveInDate: '즉시 입점 가능',
        recommendedUsage: '프랜차이즈 카페, 디저트 전문점, 브런치, 헤어샵, 약국',
        commercialAnalysis:
          '수완지구 핵심 학원가 및 대단지 아파트 배후 수요가 밀집된 메인 대로변 1층입니다.\n유동 인구가 풍부하고 가시성이 매우 뛰어납니다.',
        description:
          '대로변 횡단보도 바로 앞 특급 전면 상가입니다.\n기존 권리금이 전혀 없는 귀한 1층 매물로 창업 초기 부담을 덜 수 있습니다.',
        features: ['1층코너', '무권리금', '대로변노출', '유동인구풍부', '즉시입점'],
        images: [
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
        ],
        mainImageIndex: 0,
        isVisible: true,
        isFeatured: true,
        status: 'available',
        viewCount: 65,
        authorUid: 'admin',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      });

      await handleRefreshProperties();
    } catch (err) {
      console.error('Seed sample error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-[#0F1E36] selection:text-amber-300">
      {/* Top Header & Navigation */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <HomePage
            properties={properties}
            onSelectProperty={setDetailProperty}
            onNavigateTab={handleNavigateTab}
            onOpenConsultation={handleOpenConsultation}
            onSeedSampleData={handleSeedSampleData}
          />
        )}

        {currentTab === 'map' && (
          <MapPage
            properties={properties}
            onOpenDetail={setDetailProperty}
          />
        )}

        {currentTab === 'list' && (
          <ListPage
            properties={properties}
            onOpenDetail={setDetailProperty}
            initialType={listFilters.type}
            initialTx={listFilters.tx}
            initialQuery={listFilters.query}
          />
        )}

        {currentTab === 'directions' && <DirectionsPage />}

        {currentTab === 'consultation' && <ConsultationPage />}

        {currentTab === 'admin' && (
          <AdminPage
            properties={properties}
            onRefreshProperties={handleRefreshProperties}
            onOpenPropertyDetail={setDetailProperty}
          />
        )}
      </main>

      {/* Footer with Business Spec & Legal Info */}
      <Footer />

      {/* Property Detail Modal */}
      {detailProperty && (
        <PropertyDetailModal
          property={detailProperty}
          onClose={() => setDetailProperty(null)}
          onOpenInquiry={(p) => {
            setDetailProperty(null);
            handleOpenConsultation(p);
          }}
        />
      )}

      {/* Consultation Request Modal */}
      {inquiryModalOpen && (
        <InquiryModal
          property={inquiryTargetProperty}
          onClose={() => {
            setInquiryModalOpen(false);
            setInquiryTargetProperty(null);
          }}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
