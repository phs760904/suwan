import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  PlusCircle,
  List,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Star,
  LogOut,
  Building,
  Store,
  Home,
  MessageSquare,
  Sparkles,
  Phone,
  Layers,
  MapPin,
  Lock,
  LogIn,
  Key,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Property, PropertyType, TransactionType, PropertyStatus, Inquiry } from '../types';
import {
  createProperty,
  updateProperty,
  deleteProperty,
  fetchProperties,
} from '../firebase/properties';
import {
  subscribeToInquiries,
  updateInquiryStatus,
  deleteInquiry,
} from '../firebase/inquiries';

interface AdminPageProps {
  properties: Property[];
  onRefreshProperties: () => void;
  onOpenPropertyDetail?: (property: Property) => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({
  properties,
  onRefreshProperties,
  onOpenPropertyDetail,
}) => {
  const {
    currentUser,
    isAdmin,
    adminName,
    loginWithGoogle,
    loginWithAdminCode,
    logout,
    authError,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'inquiries'>('list');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [propertyType, setPropertyType] = useState<PropertyType>('apartment');
  const [transactionType, setTransactionType] = useState<TransactionType>('sale');
  const [price, setPrice] = useState('');
  const [priceValue, setPriceValue] = useState<number | ''>('');
  const [deposit, setDeposit] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [premium, setPremium] = useState('');
  const [address, setAddress] = useState('광주광역시 광산구 수완동');
  const [addressDetail, setAddressDetail] = useState('');
  const [lat, setLat] = useState<number>(35.1915);
  const [lng, setLng] = useState<number>(126.8228);
  const [supplyArea, setSupplyArea] = useState<number | ''>('');
  const [exclusiveArea, setExclusiveArea] = useState<number | ''>('');
  const [floor, setFloor] = useState<number | ''>('');
  const [totalFloors, setTotalFloors] = useState<number | ''>('');
  const [direction, setDirection] = useState('남향');
  const [parking, setParking] = useState('가능 (지하 주차장)');
  const [maintenanceCost, setMaintenanceCost] = useState('관리규약에 따름');
  const [moveInDate, setMoveInDate] = useState('즉시 입주 협의');
  const [recommendedUsage, setRecommendedUsage] = useState('');
  const [commercialAnalysis, setCommercialAnalysis] = useState('');
  const [description, setDescription] = useState('');
  const [featuresInput, setFeaturesInput] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [status, setStatus] = useState<PropertyStatus>('available');

  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccessMessage, setFormSuccessMessage] = useState<string | null>(null);
  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  // Inquiries State
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Subscribe to inquiries if admin
  useEffect(() => {
    if (!isAdmin) return;
    const unsub = subscribeToInquiries((list) => {
      setInquiries(list);
    });
    return () => unsub();
  }, [isAdmin]);

  // Handle Photo Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      // Validate file size (under 2.5MB per image)
      if (file.size > 2.5 * 1024 * 1024) {
        alert(`${file.name} 파일 용량이 너무 큽니다 (2.5MB 이하만 가능합니다).`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const result = loadEvent.target?.result as string;
        if (result) {
          setUploadedImages((prev) => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== index));
    if (mainImageIndex >= index && mainImageIndex > 0) {
      setMainImageIndex((prev) => prev - 1);
    }
  };

  const resetForm = () => {
    setEditingPropertyId(null);
    setTitle('');
    setPropertyType('apartment');
    setTransactionType('sale');
    setPrice('');
    setPriceValue('');
    setDeposit('');
    setMonthlyRent('');
    setPremium('');
    setAddress('광주광역시 광산구 수완동');
    setAddressDetail('');
    setLat(35.1915);
    setLng(126.8228);
    setSupplyArea('');
    setExclusiveArea('');
    setFloor('');
    setTotalFloors('');
    setDirection('남향');
    setParking('가능 (지하 주차장)');
    setMaintenanceCost('관리규약에 따름');
    setMoveInDate('즉시 입주 협의');
    setRecommendedUsage('');
    setCommercialAnalysis('');
    setDescription('');
    setFeaturesInput('');
    setUploadedImages([]);
    setMainImageIndex(0);
    setIsVisible(true);
    setIsFeatured(false);
    setStatus('available');
    setFormSuccessMessage(null);
    setFormErrorMessage(null);
  };

  // Populate form for editing
  const handleEditClick = (prop: Property) => {
    setEditingPropertyId(prop.id);
    setTitle(prop.title);
    setPropertyType(prop.propertyType);
    setTransactionType(prop.transactionType);
    setPrice(prop.price || '');
    setPriceValue(prop.priceValue || '');
    setDeposit(prop.deposit || '');
    setMonthlyRent(prop.monthlyRent || '');
    setPremium(prop.premium || '');
    setAddress(prop.address || '광주광역시 광산구 수완동');
    setAddressDetail(prop.addressDetail || '');
    setLat(prop.lat || 35.1915);
    setLng(prop.lng || 126.8228);
    setSupplyArea(prop.supplyArea || '');
    setExclusiveArea(prop.exclusiveArea || '');
    setFloor(prop.floor || '');
    setTotalFloors(prop.totalFloors || '');
    setDirection(prop.direction || '남향');
    setParking(prop.parking || '가능');
    setMaintenanceCost(prop.maintenanceCost || '');
    setMoveInDate(prop.moveInDate || '즉시 입주 협의');
    setRecommendedUsage(prop.recommendedUsage || '');
    setCommercialAnalysis(prop.commercialAnalysis || '');
    setDescription(prop.description || '');
    setFeaturesInput(prop.features ? prop.features.join(', ') : '');
    setUploadedImages(prop.images || []);
    setMainImageIndex(prop.mainImageIndex || 0);
    setIsVisible(prop.isVisible !== false);
    setIsFeatured(prop.isFeatured || false);
    setStatus(prop.status || 'available');

    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Submit Handler (Create or Update)
  const handleSubmitProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSuccessMessage(null);
    setFormErrorMessage(null);

    if (!title.trim()) {
      setFormErrorMessage('매물 제목을 입력해 주세요.');
      return;
    }
    if (!address.trim()) {
      setFormErrorMessage('소재지 주소를 입력해 주세요.');
      return;
    }

    setFormSubmitting(true);
    try {
      const parsedFeatures = featuresInput
        .split(',')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);

      const payload: Omit<Property, 'id'> = {
        title: title.trim(),
        propertyType,
        transactionType,
        price: price.trim(),
        priceValue: typeof priceValue === 'number' ? priceValue : 0,
        deposit: deposit.trim(),
        monthlyRent: monthlyRent.trim(),
        premium: premium.trim(),
        address: address.trim(),
        addressDetail: addressDetail.trim(),
        lat: Number(lat) || 35.1915,
        lng: Number(lng) || 126.8228,
        supplyArea: supplyArea ? Number(supplyArea) : undefined,
        exclusiveArea: exclusiveArea ? Number(exclusiveArea) : undefined,
        floor: floor ? Number(floor) : undefined,
        totalFloors: totalFloors ? Number(totalFloors) : undefined,
        direction: direction.trim(),
        parking: parking.trim(),
        maintenanceCost: maintenanceCost.trim(),
        moveInDate: moveInDate.trim(),
        recommendedUsage: recommendedUsage.trim(),
        commercialAnalysis: commercialAnalysis.trim(),
        description: description.trim(),
        features: parsedFeatures,
        images: uploadedImages,
        mainImageIndex: Math.min(mainImageIndex, Math.max(0, uploadedImages.length - 1)),
        isVisible,
        isFeatured,
        status,
        authorUid: currentUser?.uid || 'admin_kim',
        createdAt: editingPropertyId
          ? properties.find((p) => p.id === editingPropertyId)?.createdAt || new Date().toISOString()
          : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingPropertyId) {
        await updateProperty(editingPropertyId, payload);
        setFormSuccessMessage('매물이 성공적으로 수정되었습니다.');
      } else {
        await createProperty(payload);
        setFormSuccessMessage('새로운 매물이 데이터베이스에 성공적으로 등록되었습니다.');
      }

      onRefreshProperties();
      resetForm();
      setTimeout(() => {
        setActiveTab('list');
      }, 1000);
    } catch (err: unknown) {
      console.error('Save error:', err);
      const errMsg = err instanceof Error ? err.message : String(err);
      setFormErrorMessage(`매물 저장 실패: ${errMsg}`);
    } finally {
      setFormSubmitting(false);
    }
  };

  // Toggle Visibility
  const handleToggleVisibility = async (prop: Property) => {
    try {
      await updateProperty(prop.id, { isVisible: !prop.isVisible });
      onRefreshProperties();
    } catch (err) {
      alert('상태 변경 실패: ' + err);
    }
  };

  // Toggle Status (available vs completed)
  const handleToggleStatus = async (prop: Property) => {
    const nextStatus: PropertyStatus = prop.status === 'completed' ? 'available' : 'completed';
    try {
      await updateProperty(prop.id, { status: nextStatus });
      onRefreshProperties();
    } catch (err) {
      alert('거래 상태 변경 실패: ' + err);
    }
  };

  // Delete Property with Confirmation
  const handleDeleteProperty = async (prop: Property) => {
    if (window.confirm(`[${prop.title}] 매물을 영구 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      try {
        await deleteProperty(prop.id);
        onRefreshProperties();
      } catch (err) {
        alert('삭제 실패: ' + err);
      }
    }
  };

  // Seed sample Suwan properties
  const handleSeedSuwanSamples = async () => {
    if (!window.confirm('광주 수완지구 추천 실매물 3건(아파트, 상가, 원룸)을 등록하시겠습니까?')) return;
    setFormSubmitting(true);
    try {
      // 1. Apartment in Suwan Lake Park
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
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        ],
        mainImageIndex: 0,
        isVisible: true,
        isFeatured: true,
        status: 'available',
        viewCount: 42,
        authorUid: currentUser?.uid || 'admin',
        createdAt: new Date().toISOString(),
      });

      // 2. Commercial property in Suwan Center
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
          '대로변 횡단보도 바로 앞 특급 전면 상가입니다.\n기존 권리금이 전혀 없는 귀한 1층 매물로 창업 초기 부담을 덜 수 있습니다.\n닥트 및 급배수 시설 완비되어 있습니다.',
        features: ['1층코너', '무권리금', '대로변노출', '유동인구풍부', '즉시입점'],
        images: [
          'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80',
        ],
        mainImageIndex: 0,
        isVisible: true,
        isFeatured: true,
        status: 'available',
        viewCount: 65,
        authorUid: currentUser?.uid || 'admin',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      });

      // 3. One-room in Suwan Living Area
      await createProperty({
        title: '수완지구 풀옵션 분리형 원룸 신축급 햇살가득',
        propertyType: 'oneroom',
        transactionType: 'monthly',
        price: '보증금 500 / 월 42만원',
        priceValue: 500,
        deposit: '500만원',
        monthlyRent: '42만원',
        address: '광주광역시 광산구 수완동 수완로 52번길',
        addressDetail: '2층 203호',
        lat: 35.1885,
        lng: 126.823,
        supplyArea: 38.0,
        exclusiveArea: 29.5,
        floor: 2,
        totalFloors: 4,
        direction: '남서향',
        parking: '필로티 1:1 주차 가능',
        maintenanceCost: '월 5만원 (인터넷·수도·유선TV 포함)',
        moveInDate: '즉시 입주',
        description:
          '조용하고 쾌적한 주거단지에 위치한 신축급 분리형 원룸입니다.\n에어컨, 세탁기, 냉장고, 가스레인지, 전자레인지, 붙박이장 풀옵션입니다.\nCCTV 및 공동현관 도어락으로 보안이 철저합니다.',
        features: ['풀옵션', '분리형원룸', '주차편리', '즉시입주', '안심보안'],
        images: [
          'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        ],
        mainImageIndex: 0,
        isVisible: true,
        isFeatured: true,
        status: 'available',
        viewCount: 28,
        authorUid: currentUser?.uid || 'admin',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      });

      onRefreshProperties();
      alert('수완지구 추천 실매물 3건이 Firestore에 등록되었습니다!');
    } catch (err) {
      alert('샘플 매물 등록 실패: ' + err);
    } finally {
      setFormSubmitting(false);
    }
  };

  // If NOT logged in as Admin, show login screen
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#0F1E36] text-amber-400 flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <span className="text-xs font-bold text-amber-700 tracking-wider uppercase">
              수완신도시공인중개사사무소
            </span>
            <h1 className="text-2xl font-black text-[#0F1E36] mt-1">
              관리자 로그인
            </h1>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              본 페이지는 매물 등록 및 데이터베이스 관리를 위한 전용 관리자 공간입니다.
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}

          {/* Quick PIN / Passcode login */}
          <div className="space-y-3 pt-2 text-left">
            <label className="block text-xs font-bold text-slate-700">
              관리자 인증 암호
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="password"
                value={passcodeInput}
                onChange={(e) => setPasscodeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    loginWithAdminCode(passcodeInput);
                  }
                }}
                placeholder="관리자 암호 (suwan7568)"
                className="w-full pl-9 pr-3.5 py-3 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0F1E36]"
              />
            </div>
            <button
              onClick={() => loginWithAdminCode(passcodeInput)}
              className="w-full py-3 bg-[#0F1E36] hover:bg-[#162a4d] text-white font-bold text-sm rounded-xl shadow-md transition-colors cursor-pointer"
            >
              암호로 관리자 로그인
            </button>
          </div>

          <div className="relative flex py-2 items-center">
            <div className="grow border-t border-slate-200"></div>
            <span className="shrink mx-3 text-xs text-slate-400">또는 Google 인증</span>
            <div className="grow border-t border-slate-200"></div>
          </div>

          <button
            onClick={loginWithGoogle}
            className="w-full py-3 border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <LogIn className="w-4 h-4 text-amber-600" />
            <span>Google 계정으로 로그인</span>
          </button>
        </div>
      </div>
    );
  }

  // Logged-in Admin Dashboard View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 space-y-8">
      {/* Top Admin Banner */}
      <div className="bg-[#0F1E36] text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight">
                수완신도시공인중개사사무소 관리자 모드
              </span>
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-500 text-slate-950">
                인증완료
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              접속자: <strong className="text-white">{adminName || currentUser?.email || '공인중개사 김정민'}</strong> | 실시간 매물 DB 및 고객 상담 관리
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSeedSuwanSamples}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>수완지구 샘플 매물 등록</span>
          </button>
          <button
            onClick={logout}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>로그아웃</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab('list');
            resetForm();
          }}
          className={`pb-3 px-6 text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'list'
              ? 'border-[#0F1E36] text-[#0F1E36]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <List className="w-4 h-4" />
          <span>등록 매물 관리 ({properties.length}건)</span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'create'
              ? 'border-[#0F1E36] text-[#0F1E36]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>{editingPropertyId ? '매물 수정' : '신규 매물 등록'}</span>
        </button>

        <button
          onClick={() => setActiveTab('inquiries')}
          className={`pb-3 px-6 text-sm font-bold border-b-2 flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'inquiries'
              ? 'border-[#0F1E36] text-[#0F1E36]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>고객 상담 문의 ({inquiries.filter((i) => i.status === 'pending').length}건 대기)</span>
        </button>
      </div>

      {/* TAB 1: PROPERTY LIST & MANAGEMENT */}
      {activeTab === 'list' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-slate-900">
              데이터베이스 등록 매물 목록
            </h2>
            <button
              onClick={() => {
                resetForm();
                setActiveTab('create');
              }}
              className="px-4 py-2 bg-[#0F1E36] text-white rounded-xl text-xs font-bold hover:bg-[#162a4d] flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-400" />
              <span>새 매물 등록하기</span>
            </button>
          </div>

          {properties.length > 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                    <tr>
                      <th className="py-3.5 px-4">대표 사진</th>
                      <th className="py-3.5 px-4">종류 / 거래</th>
                      <th className="py-3.5 px-4">매물 제목 / 주소</th>
                      <th className="py-3.5 px-4">거래 금액</th>
                      <th className="py-3.5 px-4 text-center">거래 상태</th>
                      <th className="py-3.5 px-4 text-center">공개 노출</th>
                      <th className="py-3.5 px-4 text-center">관리</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {properties.map((prop) => (
                      <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Thumbnail */}
                        <td className="py-3 px-4">
                          <div className="w-16 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0">
                            <img
                              src={
                                prop.images && prop.images.length > 0
                                  ? prop.images[prop.mainImageIndex || 0] || prop.images[0]
                                  : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'
                              }
                              alt={prop.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </td>

                        {/* Type / Tx */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="font-bold text-slate-900 block">
                            {prop.propertyType === 'apartment'
                              ? '아파트'
                              : prop.propertyType === 'commercial'
                              ? '상가'
                              : '원룸'}
                          </span>
                          <span className="text-xs text-amber-700 font-semibold">
                            {prop.transactionType === 'sale'
                              ? '매매'
                              : prop.transactionType === 'jeonse'
                              ? '전세'
                              : prop.transactionType === 'monthly'
                              ? '월세'
                              : '임대'}
                          </span>
                        </td>

                        {/* Title & Address */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 max-w-xs truncate">
                            {prop.title}
                          </div>
                          <div className="text-xs text-slate-500 truncate max-w-xs">
                            {prop.address} {prop.addressDetail || ''}
                          </div>
                        </td>

                        {/* Price */}
                        <td className="py-3 px-4 whitespace-nowrap font-bold text-amber-700">
                          {prop.price || (prop.deposit ? `보${prop.deposit}/월${prop.monthlyRent || '-'}` : '협의')}
                        </td>

                        {/* Status Toggle */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggleStatus(prop)}
                            className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                              prop.status === 'completed'
                                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            }`}
                          >
                            {prop.status === 'completed' ? '거래완료' : '거래가능'}
                          </button>
                        </td>

                        {/* Visibility Toggle */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <button
                            onClick={() => handleToggleVisibility(prop)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              prop.isVisible !== false
                                ? 'text-emerald-700 hover:bg-emerald-50'
                                : 'text-slate-400 hover:bg-slate-100'
                            }`}
                            title={prop.isVisible !== false ? '공개 중' : '비공개'}
                          >
                            {prop.isVisible !== false ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleEditClick(prop)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                              title="수정하기"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProperty(prop)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                              title="삭제하기"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center space-y-3">
              <Building className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700 text-base">
                등록된 매물이 없습니다
              </div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                데이터베이스에 등록된 매물이 없습니다. 상단의 [신규 매물 등록] 버튼이나 [수완지구 샘플 매물 등록]을 눌러 첫 매물을 등록하세요.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleSeedSuwanSamples}
                  className="px-5 py-2.5 bg-[#0F1E36] text-amber-400 rounded-xl text-xs font-bold hover:bg-[#162a4d]"
                >
                  수완지구 추천 실매물 샘플 3건 즉시 등록
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PROPERTY FORM (CREATE OR EDIT) */}
      {activeTab === 'create' && (
        <form onSubmit={handleSubmitProperty} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {editingPropertyId ? '매물 정보 수정' : '신규 매물 등록'}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                등록된 매물 정보는 Firestore 데이터베이스에 영구 저장되며, 지도와 목록에 자동 반영됩니다.
              </p>
            </div>
            {editingPropertyId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-xs text-slate-500 hover:text-slate-800 underline"
              >
                신규 등록으로 초기화
              </button>
            )}
          </div>

          {formSuccessMessage && (
            <div className="p-4 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{formSuccessMessage}</span>
            </div>
          )}

          {formErrorMessage && (
            <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span>{formErrorMessage}</span>
            </div>
          )}

          {/* Section 1: Classification & Title */}
          <div className="space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0F1E36]"></span>
              1. 기본 구분 및 매물 제목
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  매물 종류 <span className="text-red-500">*</span>
                </label>
                <select
                  value={propertyType}
                  onChange={(e) => setPropertyType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#0F1E36]"
                >
                  <option value="apartment">아파트 (대단지/주거)</option>
                  <option value="commercial">상가 (점포/상권)</option>
                  <option value="oneroom">원룸/투룸 (원룸/오피스텔)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  거래 유형 <span className="text-red-500">*</span>
                </label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-[#0F1E36]"
                >
                  <option value="sale">매매</option>
                  <option value="jeonse">전세</option>
                  <option value="monthly">월세</option>
                  <option value="rent">임대</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                매물 제목 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 수완지구 호수공원 전망 34평 로얄층 올확장 남향"
                className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-[#0F1E36]"
              />
            </div>
          </div>

          {/* Section 2: Pricing */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0F1E36]"></span>
              2. 거래 금액 정보
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  거래 금액 표기 (고객 화면 표시용)
                </label>
                <input
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="예: 매매 5억 8,000만원 또는 보증금 3,000"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  정렬용 금액 (만원 단위 숫자)
                </label>
                <input
                  type="number"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value ? Number(e.target.value) : '')}
                  placeholder="예: 58000 (5억8천)"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  보증금 (월세/임대 시)
                </label>
                <input
                  type="text"
                  value={deposit}
                  onChange={(e) => setDeposit(e.target.value)}
                  placeholder="예: 5,000만원"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  월세 (월세/임대 시)
                </label>
                <input
                  type="text"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(e.target.value)}
                  placeholder="예: 150만원"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  권리금 (상가 매물 전용)
                </label>
                <input
                  type="text"
                  value={premium}
                  onChange={(e) => setPremium(e.target.value)}
                  placeholder="예: 무권리 / 3,000만원 협의"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  월 관리비
                </label>
                <input
                  type="text"
                  value={maintenanceCost}
                  onChange={(e) => setMaintenanceCost(e.target.value)}
                  placeholder="예: 18만원 (실비정산)"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Location & Coordinates */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0F1E36]"></span>
              3. 소재지 주소 및 지도 위치 (위도/경도)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  기본 주소 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="광주광역시 광산구 수완동 수완로 106"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  상세 위치 / 동호수
                </label>
                <input
                  type="text"
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  placeholder="105동 18층 또는 1층 102호"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  지도 위도 (Latitude)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(Number(e.target.value))}
                  placeholder="35.1915"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  지도 경도 (Longitude)
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(Number(e.target.value))}
                  placeholder="126.8228"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              * 기본값은 광주 수완지구 중심 좌표(35.1915, 126.8228)로 자동 설정되어 지도에 표시됩니다.
            </p>
          </div>

          {/* Section 4: Specifications */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0F1E36]"></span>
              4. 매물 상세 제원
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  공급면적 (㎡)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={supplyArea}
                  onChange={(e) => setSupplyArea(e.target.value ? Number(e.target.value) : '')}
                  placeholder="112.5"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  전용면적 (㎡)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={exclusiveArea}
                  onChange={(e) => setExclusiveArea(e.target.value ? Number(e.target.value) : '')}
                  placeholder="84.9"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  해당 층
                </label>
                <input
                  type="number"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value ? Number(e.target.value) : '')}
                  placeholder="18"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  전체 층
                </label>
                <input
                  type="number"
                  value={totalFloors}
                  onChange={(e) => setTotalFloors(e.target.value ? Number(e.target.value) : '')}
                  placeholder="25"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  방향
                </label>
                <input
                  type="text"
                  value={direction}
                  onChange={(e) => setDirection(e.target.value)}
                  placeholder="남향 / 남동향"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  주차 가능 여부
                </label>
                <input
                  type="text"
                  value={parking}
                  onChange={(e) => setParking(e.target.value)}
                  placeholder="지하주차장 가능"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  입주 가능일
                </label>
                <input
                  type="text"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                  placeholder="즉시 입주 협의"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  핵심 특징 태그 (쉼표로 구분)
                </label>
                <input
                  type="text"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  placeholder="호수공원뷰, 올확장, 남향"
                  className="w-full p-2.5 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 5: Commercial Extra Info (if commercial) */}
          {propertyType === 'commercial' && (
            <div className="space-y-4 pt-4 border-t border-slate-100 bg-amber-50/50 p-4 rounded-xl border border-amber-200">
              <h3 className="font-bold text-amber-900 text-sm flex items-center gap-2">
                <Store className="w-4 h-4 text-amber-700" />
                상가 매물 전용 분석 항목
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    추천 업종
                  </label>
                  <input
                    type="text"
                    value={recommendedUsage}
                    onChange={(e) => setRecommendedUsage(e.target.value)}
                    placeholder="예: 프랜차이즈 카페, 베이커리, 디저트, 일반음식점, 병의원, 학원"
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-amber-900 mb-1">
                    상권 및 입지 분석 설명
                  </label>
                  <textarea
                    rows={3}
                    value={commercialAnalysis}
                    onChange={(e) => setCommercialAnalysis(e.target.value)}
                    placeholder="수완지구 중심상권, 대단지 아파트 배후세대, 주동선 위치 등 상권 분석을 기재합니다."
                    className="w-full p-2.5 bg-white border border-amber-300 rounded-xl text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Section 6: Detailed Description */}
          <div className="space-y-2 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0F1E36]"></span>
              5. 매물 상세 설명
            </h3>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="매물의 장점, 인테리어 상태, 권리관계, 교통 및 주변 생활 인프라에 대해 자세히 작성해 주세요."
              className="w-full p-3 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          {/* Section 7: Photo Upload & Representative Photo Selector */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-600" />
                6. 사진 업로드 및 대표 사진 지정 ({uploadedImages.length}장)
              </h3>
              <span className="text-xs text-slate-500">
                사진을 클릭하면 대표 사진(메인)으로 지정됩니다.
              </span>
            </div>

            {/* File upload input */}
            <div className="border-2 border-dashed border-slate-300 rounded-2xl p-6 text-center hover:bg-slate-50 transition-colors">
              <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F1E36] hover:bg-[#162a4d] text-white text-xs font-bold rounded-xl shadow-xs transition-colors">
                <span>컴퓨터에서 사진 파일 선택 (여러 장 가능)</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-slate-400 mt-2">
                JPG, PNG, WebP 이미지 파일 지원 (장당 최대 2.5MB)
              </p>
            </div>

            {/* Photo Preview Grid */}
            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {uploadedImages.map((img, idx) => (
                  <div
                    key={idx}
                    onClick={() => setMainImageIndex(idx)}
                    className={`relative rounded-xl overflow-hidden aspect-4/3 border-2 cursor-pointer transition-all ${
                      mainImageIndex === idx ? 'border-amber-500 ring-2 ring-amber-300' : 'border-slate-200 opacity-80 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`매물 사진 ${idx + 1}`} className="w-full h-full object-cover" />
                    {mainImageIndex === idx && (
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-amber-500 text-slate-950 font-black text-[10px] rounded shadow-xs">
                        대표사진
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(idx);
                      }}
                      className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-black/90"
                      title="사진 삭제"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 8: Status & Visibility Checkbox */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#0F1E36]"></span>
              7. 노출 및 상태 설정
            </h3>

            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isVisible}
                  onChange={(e) => setIsVisible(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0F1E36]"
                />
                <span>홈페이지 공개 노출 (체크 해제 시 비공개)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600"
                />
                <span>메인 화면 &quot;추천 매물&quot;로 선정</span>
              </label>

              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <span>거래 상태:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="p-1.5 border border-slate-300 rounded-lg text-xs"
                >
                  <option value="available">거래가능</option>
                  <option value="completed">거래완료</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-3 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              입력 초기화
            </button>
            <button
              type="submit"
              disabled={formSubmitting}
              className="px-8 py-3.5 bg-[#0F1E36] hover:bg-[#162a4d] text-white font-bold text-sm rounded-xl shadow-md transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4 text-amber-400" />
              <span>{formSubmitting ? '저장 처리 중...' : editingPropertyId ? '매물 수정 완료' : '매물 등록 완료'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: CUSTOMER CONSULTATION INQUIRIES */}
      {activeTab === 'inquiries' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              고객 상담 및 매물 문의 내역
            </h2>
            <span className="text-xs text-slate-500">
              총 {inquiries.length}건의 문의
            </span>
          </div>

          {inquiries.length > 0 ? (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs space-y-3 ${
                    inq.status === 'completed' ? 'border-slate-200 opacity-75' : 'border-amber-300 ring-1 ring-amber-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900 text-sm sm:text-base">
                        {inq.name} 고객님
                      </span>
                      <a
                        href={`tel:${inq.phone}`}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold rounded-lg hover:bg-amber-100"
                      >
                        <Phone className="w-3.5 h-3.5 text-amber-600" />
                        <span>{inq.phone}</span>
                      </a>
                      {inq.propertyTitle && (
                        <span className="text-xs text-slate-500 truncate max-w-xs">
                          [문의 매물: {inq.propertyTitle}]
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">
                        {new Date(inq.createdAt).toLocaleString('ko-KR')}
                      </span>
                      <button
                        onClick={async () => {
                          const next = inq.status === 'completed' ? 'pending' : 'completed';
                          await updateInquiryStatus(inq.id, next);
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          inq.status === 'completed'
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {inq.status === 'completed' ? '상담완료됨' : '대기중 (완료처리)'}
                      </button>
                      <button
                        onClick={async () => {
                          if (window.confirm('이 문의 내역을 삭제하시겠습니까?')) {
                            await deleteInquiry(inq.id);
                          }
                        }}
                        className="p-1 text-slate-400 hover:text-red-600"
                        title="문의 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {inq.message}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700 text-sm">접수된 상담 문의가 없습니다</div>
              <p className="text-xs text-slate-500">
                고객이 홈페이지에서 상담을 신청하면 이곳에 실시간으로 표시됩니다.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
