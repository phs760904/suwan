import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  MapPin,
  Layers,
  Key,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  Crosshair,
  Building,
  Store,
  Home,
  Check,
  AlertTriangle,
  X,
} from 'lucide-react';
import { Property, PropertyType, TransactionType } from '../types';

interface KakaoMapContainerProps {
  properties: Property[];
  selectedProperty: Property | null;
  onSelectProperty: (property: Property) => void;
  onOpenDetail: (property: Property) => void;
  filterType?: PropertyType | 'all';
  filterTransaction?: TransactionType | 'all';
}

declare global {
  interface Window {
    kakao?: any;
  }
}

// Center around Gwangju Gwangsan-gu Suwan-dong
const SUWAN_CENTER = {
  lat: 35.1915,
  lng: 126.8228,
};

const KAKAO_KEY_STORAGE = 'suwan_kakao_api_key';

export const KakaoMapContainer: React.FC<KakaoMapContainerProps> = ({
  properties,
  selectedProperty,
  onSelectProperty,
  onOpenDetail,
  filterType = 'all',
  filterTransaction = 'all',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const kakaoMapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem(KAKAO_KEY_STORAGE) || '';
  });
  const [keyInput, setKeyInput] = useState('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [kakaoLoaded, setKakaoLoaded] = useState(false);
  const [kakaoError, setKakaoError] = useState<string | null>(null);

  // Fallback spatial state when API key is not present
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Filter properties
  const filteredProperties = useMemo(() => {
    return properties.filter((item) => {
      if (filterType !== 'all' && item.propertyType !== filterType) return false;
      if (filterTransaction !== 'all' && item.transactionType !== filterTransaction) return false;
      return true;
    });
  }, [properties, filterType, filterTransaction]);

  // Load Kakao Map script if key exists
  useEffect(() => {
    if (!apiKey) {
      setKakaoLoaded(false);
      return;
    }

    const scriptId = 'kakao-maps-sdk';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false&libraries=services`;
    script.async = true;

    script.onload = () => {
      if (window.kakao && window.kakao.maps) {
        window.kakao.maps.load(() => {
          setKakaoLoaded(true);
          setKakaoError(null);
        });
      } else {
        setKakaoError('카카오맵 라이브러리를 초기화하지 못했습니다.');
      }
    };

    script.onerror = () => {
      setKakaoError('카카오맵 스크립트를 불러오지 못했습니다. API 키를 확인해 주세요.');
      setKakaoLoaded(false);
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
    };
  }, [apiKey]);

  // Initialize Kakao Map
  useEffect(() => {
    if (!kakaoLoaded || !mapContainerRef.current || !window.kakao || !window.kakao.maps) {
      return;
    }

    try {
      const container = mapContainerRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(SUWAN_CENTER.lat, SUWAN_CENTER.lng),
        level: 4,
      };

      const map = new window.kakao.maps.Map(container, options);
      kakaoMapInstance.current = map;

      // Add Zoom Control
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);
    } catch (err) {
      console.error('Failed to init Kakao map:', err);
      setKakaoError('지도를 렌더링하는 중 오류가 발생했습니다.');
    }
  }, [kakaoLoaded]);

  // Update Markers when properties change
  useEffect(() => {
    if (!kakaoLoaded || !kakaoMapInstance.current || !window.kakao?.maps) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    const map = kakaoMapInstance.current;

    filteredProperties.forEach((prop) => {
      const lat = prop.lat || SUWAN_CENTER.lat;
      const lng = prop.lng || SUWAN_CENTER.lng;
      const position = new window.kakao.maps.LatLng(lat, lng);

      // Custom marker content
      const content = document.createElement('div');
      content.className = `cursor-pointer transition-transform hover:scale-110 ${
        selectedProperty?.id === prop.id ? 'scale-110 z-30' : 'z-10'
      }`;

      const badgeColor =
        prop.propertyType === 'apartment'
          ? 'bg-blue-900 border-blue-400'
          : prop.propertyType === 'commercial'
          ? 'bg-amber-800 border-amber-400'
          : 'bg-emerald-800 border-emerald-400';

      content.innerHTML = `
        <div class="px-2.5 py-1.5 rounded-lg shadow-md border text-white text-xs font-bold flex items-center gap-1 ${badgeColor}">
          <span>${prop.price || prop.deposit || '매물'}</span>
        </div>
      `;

      content.onclick = () => {
        onSelectProperty(prop);
      };

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: position,
        content: content,
        yAnchor: 1.2,
      });

      customOverlay.setMap(map);
      markersRef.current.push(customOverlay);
    });
  }, [kakaoLoaded, filteredProperties, selectedProperty, onSelectProperty]);

  // Move map when selectedProperty changes
  useEffect(() => {
    if (!kakaoLoaded || !kakaoMapInstance.current || !selectedProperty || !window.kakao?.maps) return;
    const lat = selectedProperty.lat || SUWAN_CENTER.lat;
    const lng = selectedProperty.lng || SUWAN_CENTER.lng;
    const moveLatLon = new window.kakao.maps.LatLng(lat, lng);
    kakaoMapInstance.current.panTo(moveLatLon);
  }, [kakaoLoaded, selectedProperty]);

  const handleSaveKey = () => {
    if (!keyInput.trim()) return;
    const cleanKey = keyInput.trim();
    localStorage.setItem(KAKAO_KEY_STORAGE, cleanKey);
    setApiKey(cleanKey);
    setShowKeyModal(false);
  };

  const handleRemoveKey = () => {
    localStorage.removeItem(KAKAO_KEY_STORAGE);
    setApiKey('');
    setKakaoLoaded(false);
  };

  // Convert GPS to SVG pixel coords for built-in visualizer
  const getMarkerCoords = (lat: number = SUWAN_CENTER.lat, lng: number = SUWAN_CENTER.lng) => {
    // Reference box around Suwan district
    // Lat: 35.175 ~ 35.205 (~3km), Lng: 126.805 ~ 126.840 (~3.5km)
    const minLat = 35.175;
    const maxLat = 35.205;
    const minLng = 126.805;
    const maxLng = 126.840;

    const x = ((lng - minLng) / (maxLng - minLng)) * 800;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 600;
    return { x: Math.max(40, Math.min(760, x)), y: Math.max(40, Math.min(560, y)) };
  };

  return (
    <div className="relative w-full h-[620px] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 shadow-inner flex flex-col">
      {/* Top Map Status Banner */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Status pill */}
        <div className="pointer-events-auto bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-xl shadow-md border border-slate-200 text-xs flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold text-[#0F1E36]">광주 수완지구 지도매물</span>
          <span className="text-slate-400">|</span>
          <span className="text-slate-600 font-semibold">
            매물 {filteredProperties.length}개 표시 중
          </span>
        </div>

        {/* Right API Key config button */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={() => setShowKeyModal(true)}
            className={`px-3 py-2 rounded-xl shadow-md border text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              kakaoLoaded
                ? 'bg-white/95 text-emerald-800 border-emerald-300 hover:bg-emerald-50'
                : 'bg-[#0F1E36] text-amber-400 border-amber-400/40 hover:bg-[#162a4d]'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>{kakaoLoaded ? '카카오맵 연동 완료' : '카카오맵 API 키 설정'}</span>
          </button>
        </div>
      </div>

      {/* Map Display: Kakao Map or High-Fidelity Spatial Viewer */}
      {kakaoLoaded ? (
        <div ref={mapContainerRef} className="w-full h-full" />
      ) : (
        <div
          className="relative w-full h-full select-none cursor-grab active:cursor-grabbing bg-[#eef3f7] overflow-hidden"
          onMouseDown={(e) => {
            setIsDragging(true);
            setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
          }}
          onMouseMove={(e) => {
            if (!isDragging) return;
            setPanOffset({
              x: e.clientX - dragStart.x,
              y: e.clientY - dragStart.y,
            });
          }}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          {/* Spatial Vector Grid of Suwan District */}
          <div
            className="w-full h-full transition-transform duration-75"
            style={{
              transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
              transformOrigin: 'center center',
            }}
          >
            <svg viewBox="0 0 800 600" className="w-full h-full">
              {/* Background Roads and Blocks of Suwan New City */}
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#d5e0ea" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="800" height="600" fill="#f4f7f9" />
              <rect width="800" height="600" fill="url(#grid)" />

              {/* Suwan Lake Park (수완호수공원) Area */}
              <path
                d="M 380 220 C 440 210, 480 260, 460 320 C 430 380, 360 360, 340 310 Z"
                fill="#bfe3f7"
                stroke="#95c8e6"
                strokeWidth="2"
              />
              <text x="390" y="290" fill="#2d6a8a" fontSize="13" fontWeight="bold">
                수완호수공원
              </text>

              {/* Main Roads: Imbangul-daero & Suwan-ro */}
              {/* Imbangul-daero (임방울대로) */}
              <line x1="120" y1="50" x2="680" y2="550" stroke="#fbd38d" strokeWidth="14" />
              <line x1="120" y1="50" x2="680" y2="550" stroke="#f6ad55" strokeWidth="2" strokeDasharray="6,6" />
              <text x="490" y="420" fill="#9c4221" fontSize="11" fontWeight="bold" transform="rotate(38 490 420)">
                임방울대로 (수완중심대로)
              </text>

              {/* Suwan-ro (수완로) */}
              <line x1="100" y1="360" x2="700" y2="200" stroke="#fbd38d" strokeWidth="12" />
              <text x="240" y="325" fill="#9c4221" fontSize="11" fontWeight="bold" transform="rotate(-15 240 325)">
                수완로 (사무소 중심상권)
              </text>

              {/* Jangdeok-dong / Sinchang Areas */}
              <rect x="180" y="120" width="140" height="90" rx="8" fill="#e2e8f0" opacity="0.6" />
              <text x="220" y="165" fill="#475569" fontSize="12" fontWeight="bold">장덕동 아파트단지</text>

              <rect x="520" y="130" width="150" height="100" rx="8" fill="#e2e8f0" opacity="0.6" />
              <text x="560" y="180" fill="#475569" fontSize="12" fontWeight="bold">수완지구 중심상업지구</text>

              <rect x="180" y="410" width="160" height="110" rx="8" fill="#e2e8f0" opacity="0.6" />
              <text x="210" y="465" fill="#475569" fontSize="12" fontWeight="bold">수완동 주택·원룸 단지</text>

              {/* Suwan Office Location Pin (수완신도시공인중개사사무소) */}
              <g transform="translate(400, 310)">
                <circle r="14" fill="#0F1E36" stroke="#fbbf24" strokeWidth="3" />
                <text x="0" y="4" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="bold">★</text>
                <rect x="-80" y="-42" width="160" height="24" rx="6" fill="#0F1E36" />
                <text x="0" y="-26" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold">
                  수완신도시공인중개사사무소
                </text>
              </g>

              {/* Interactive Property Markers */}
              {filteredProperties.map((prop) => {
                const pos = getMarkerCoords(prop.lat, prop.lng);
                const isSelected = selectedProperty?.id === prop.id;

                const colorBg =
                  prop.propertyType === 'apartment'
                    ? '#1e3a8a'
                    : prop.propertyType === 'commercial'
                    ? '#92400e'
                    : '#065f46';

                return (
                  <g
                    key={prop.id}
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProperty(prop);
                    }}
                  >
                    {/* Shadow / Glow */}
                    {isSelected && (
                      <circle r="22" fill="#f59e0b" opacity="0.4" className="animate-ping" />
                    )}

                    {/* Pin shape */}
                    <path
                      d="M 0 0 C -12 -12, -14 -24, 0 -36 C 14 -24, 12 -12, 0 0 Z"
                      fill={colorBg}
                      stroke={isSelected ? '#fbbf24' : '#ffffff'}
                      strokeWidth={isSelected ? '3' : '1.5'}
                    />
                    <circle cx="0" cy="-22" r="5" fill="#ffffff" />

                    {/* Price Bubble */}
                    <rect
                      x="-45"
                      y="-56"
                      width="90"
                      height="20"
                      rx="5"
                      fill={isSelected ? '#0F1E36' : colorBg}
                      stroke="#ffffff"
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="-42"
                      textAnchor="middle"
                      fill="#fef3c7"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {prop.price ? prop.price.slice(0, 8) : prop.deposit ? `보${prop.deposit}` : '매물'}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* API Info Notice Badge inside map */}
          <div className="absolute bottom-4 left-4 max-w-md bg-white/95 backdrop-blur-md p-3.5 rounded-xl border border-slate-200 shadow-lg z-20 text-xs">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 mb-0.5">
                  카카오맵 API 연동 상태 안내
                </p>
                <p className="text-slate-600 leading-relaxed mb-2">
                  우측 상단의 <strong>[카카오맵 API 키 설정]</strong>에 카카오 개발자 센터에서 발급받은 JavaScript 키를 입력하시면 정품 카카오 지도로 자동 전환됩니다. 현재는 수완지구 맞춤형 공간 지도 뷰어로 위치와 매물이 표시 중입니다.
                </p>
                <button
                  onClick={() => setShowKeyModal(true)}
                  className="font-bold text-[#0F1E36] hover:text-amber-700 underline"
                >
                  지금 카카오 JavaScript API 키 등록하기 →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Zoom & Location Controls */}
      <div className="absolute right-4 bottom-4 z-20 flex flex-col gap-1.5 shadow-md rounded-xl overflow-hidden bg-white border border-slate-200">
        <button
          onClick={() => {
            if (kakaoLoaded && kakaoMapInstance.current) {
              const level = kakaoMapInstance.current.getLevel();
              kakaoMapInstance.current.setLevel(level - 1);
            } else {
              setZoomLevel((z) => Math.min(z + 0.25, 2.5));
            }
          }}
          className="p-2.5 hover:bg-slate-100 text-slate-700 transition-colors"
          title="확대"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (kakaoLoaded && kakaoMapInstance.current) {
              const level = kakaoMapInstance.current.getLevel();
              kakaoMapInstance.current.setLevel(level + 1);
            } else {
              setZoomLevel((z) => Math.max(z - 0.25, 0.75));
            }
          }}
          className="p-2.5 hover:bg-slate-100 text-slate-700 transition-colors border-t border-slate-100"
          title="축소"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (kakaoLoaded && kakaoMapInstance.current && window.kakao?.maps) {
              kakaoMapInstance.current.panTo(
                new window.kakao.maps.LatLng(SUWAN_CENTER.lat, SUWAN_CENTER.lng)
              );
            } else {
              setPanOffset({ x: 0, y: 0 });
              setZoomLevel(1);
            }
          }}
          className="p-2.5 hover:bg-slate-100 text-[#0F1E36] transition-colors border-t border-slate-100"
          title="수완신도시 중심 이동"
        >
          <Crosshair className="w-4 h-4 text-amber-600" />
        </button>
      </div>

      {/* Selected Property Quick Card (Marker Overlay) */}
      {selectedProperty && (
        <div className="absolute left-4 right-4 sm:left-auto sm:right-4 top-16 sm:w-80 z-30 bg-white rounded-xl shadow-xl border border-slate-200 p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#0F1E36] text-amber-400">
              {selectedProperty.propertyType === 'apartment'
                ? '아파트'
                : selectedProperty.propertyType === 'commercial'
                ? '상가'
                : '원룸'}
            </span>
            <button
              onClick={() => onSelectProperty(null as any)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <h4 className="font-bold text-slate-900 text-sm line-clamp-1 mb-1">
            {selectedProperty.title}
          </h4>

          <div className="text-lg font-black text-amber-700 mb-2">
            {selectedProperty.price || (selectedProperty.deposit ? `보증금 ${selectedProperty.deposit} / ${selectedProperty.monthlyRent || '협의'}` : '가격 협의')}
          </div>

          <div className="text-xs text-slate-500 flex items-center gap-1 mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{selectedProperty.address}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenDetail(selectedProperty)}
              className="w-full py-2 bg-[#0F1E36] hover:bg-[#162a4d] text-white text-xs font-bold rounded-lg transition-colors text-center"
            >
              매물 상세 정보 보기 →
            </button>
          </div>
        </div>
      )}

      {/* Kakao Map Key Input Modal */}
      {showKeyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-600" />
                카카오맵 JavaScript API 키 설정
              </h3>
              <button
                onClick={() => setShowKeyModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              카카오 개발자 콘솔(developers.kakao.com)에서 발급받은 <strong>JavaScript 키</strong>를 입력하면 실시간 정품 카카오 지도로 전환됩니다.
            </p>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">카카오 JavaScript 키</label>
              <input
                type="text"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="예: 7a8b9c0d1e2f3g4h5i6j7k8l9m0n1o2p"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-xs font-mono focus:outline-hidden focus:ring-2 focus:ring-[#0F1E36]"
              />
              <p className="text-[11px] text-slate-400">
                * 플랫폼 Web 사이트 도메인에 현재 접속 도메인이 등록되어 있어야 합니다.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between gap-2">
              {apiKey && (
                <button
                  type="button"
                  onClick={handleRemoveKey}
                  className="px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg font-medium"
                >
                  기존 키 삭제
                </button>
              )}
              <div className="flex gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setShowKeyModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="button"
                  onClick={handleSaveKey}
                  className="px-5 py-2 bg-[#0F1E36] hover:bg-[#162a4d] text-white rounded-lg text-xs font-bold"
                >
                  저장 및 적용
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
