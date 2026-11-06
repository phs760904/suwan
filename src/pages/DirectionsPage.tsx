import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Building2,
  Navigation,
  Car,
  Bus,
  Clock,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';

export const DirectionsPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  // Default official office location info in Suwan
  const officeAddress = '광주광역시 광산구 수완동 (수완지구 중심상권)';
  const representativePhone = '010-7568-4183';

  const handleCopyAddress = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(officeAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="border-b border-slate-200 pb-6">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
          수완신도시공인중개사사무소
        </span>
        <h1 className="text-3xl font-extrabold text-[#0F1E36] tracking-tight mt-1">
          오시는 길 및 안내
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          광주광역시 수완지구 부동산 전문 상담을 위해 사무소 방문을 환영합니다.
        </p>
      </div>

      {/* Office Summary Info Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#0F1E36] text-amber-400 flex items-center justify-center font-bold">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                수완신도시공인중개사사무소
              </h2>
              <p className="text-xs text-slate-500 font-medium">대표자: 김정민 공인중개사</p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 block">소재지 주소</span>
                <span>{officeAddress}</span>
                <button
                  onClick={handleCopyAddress}
                  className="ml-2 inline-flex items-center gap-1 text-xs text-[#0F1E36] hover:text-amber-700 font-bold underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '복사완료' : '주소복사'}</span>
                </button>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Phone className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 block">대표 상담 전화</span>
                <a
                  href={`tel:${representativePhone}`}
                  className="text-lg font-black text-amber-700 hover:text-amber-800"
                >
                  {representativePhone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-900 block">영업 및 상담 시간</span>
                <span>월~토 09:30 ~ 20:00 (일요일 및 공휴일은 사전 예약 상담 가능)</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={`tel:${representativePhone}`}
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 bg-[#0F1E36] hover:bg-[#162a4d] text-white rounded-xl text-sm font-bold shadow-md transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>방문 전 사전 예약 및 전화 걸기</span>
            </a>
          </div>
        </div>

        {/* Directions Badges */}
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-4">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Navigation className="w-4 h-4 text-amber-600" />
            교통편 안내
          </h3>

          <div className="space-y-3 text-xs sm:text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <Car className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">자가용 이용 시</strong>
                <p className="text-xs text-slate-500 mt-0.5">
                  내비게이션에 &quot;광주 수완지구&quot; 또는 김정민 대표(010-7568-4183)로 연락주시면 주차 공간을 바로 안내해 드립니다.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Bus className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">대중교통 버스 이용 시</strong>
                <p className="text-xs text-slate-500 mt-0.5">
                  수완지구 중심상가 또는 수완호수공원 방면 시내버스 탑승 후 수완동 정류장 하차
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-800">주차 편의</strong>
                <p className="text-xs text-slate-500 mt-0.5">
                  사무소 전용 주차장 및 인근 공영주차장 무료 주차 지원
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map visualizer for office */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            사무소 위치 안내
          </h3>
          <span className="text-xs text-slate-500">광주광역시 수완지구</span>
        </div>

        <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-200 bg-[#eef3f7] relative flex items-center justify-center">
          <svg viewBox="0 0 800 400" className="w-full h-full">
            <rect width="800" height="400" fill="#f1f5f9" />
            {/* Roads */}
            <line x1="0" y1="200" x2="800" y2="200" stroke="#fbd38d" strokeWidth="18" />
            <line x1="400" y1="0" x2="400" y2="400" stroke="#fbd38d" strokeWidth="18" />
            <text x="415" y="40" fill="#9c4221" fontSize="12" fontWeight="bold">수완로</text>
            <text x="40" y="190" fill="#9c4221" fontSize="12" fontWeight="bold">임방울대로</text>

            {/* Suwan Lake Park */}
            <circle cx="240" cy="120" r="60" fill="#bfe3f7" stroke="#93c5fd" strokeWidth="2" />
            <text x="240" y="125" textAnchor="middle" fill="#1e40af" fontSize="12" fontWeight="bold">수완호수공원</text>

            {/* Office Marker Pin */}
            <g transform="translate(400, 200)">
              <circle r="22" fill="#f59e0b" opacity="0.3" className="animate-ping" />
              <circle r="18" fill="#0F1E36" stroke="#fbbf24" strokeWidth="3" />
              <text x="0" y="5" textAnchor="middle" fill="#fbbf24" fontSize="13" fontWeight="bold">★</text>
              <rect x="-110" y="-46" width="220" height="30" rx="8" fill="#0F1E36" />
              <text x="0" y="-27" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold">
                수완신도시공인중개사사무소
              </text>
            </g>
          </svg>

          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between shadow-md">
            <span>
              <strong>수완신도시공인중개사사무소</strong> | 김정민 대표 (010-7568-4183)
            </span>
            <a
              href="tel:010-7568-4183"
              className="text-[#0F1E36] font-bold hover:underline"
            >
              전화로 위치 안내 받기 →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
