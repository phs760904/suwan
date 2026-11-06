import React, { useState } from 'react';
import { Building2, Phone, MapPin, Shield, CheckCircle2, X } from 'lucide-react';

export const Footer: React.FC = () => {
  const [privacyModalOpen, setPrivacyModalOpen] = useState(false);

  return (
    <footer className="bg-[#0B1526] text-slate-300 border-t border-slate-800">
      {/* Upper Footer: Core values & Quick Contacts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 border-b border-slate-800/80">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Brand Col */}
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                수완신도시공인중개사사무소
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              <strong className="text-amber-400 font-semibold">부동산의 가치</strong> — 광주 수완지구 부동산의 새로운 기준을 제시합니다. 아파트, 상가, 원룸 맞춤 책임중개와 신뢰를 최우선으로 합니다.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>100% 실매물 확인 · 책임보증 공제보험 가입업소</span>
            </div>
          </div>

          {/* Quick Business Specs */}
          <div className="text-sm space-y-2 text-slate-400">
            <h4 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              사무소 공시 정보
            </h4>
            <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
              <div className="flex">
                <span className="w-28 text-slate-500 shrink-0">상호명</span>
                <span className="text-slate-200 font-medium">수완신도시공인중개사사무소</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 shrink-0">대표자</span>
                <span className="text-slate-200">김정민 (공인중개사)</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 shrink-0">중개등록번호</span>
                <span className="text-slate-200">가4106-852</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 shrink-0">사업자등록번호</span>
                <span className="text-slate-200">410-27-44691</span>
              </div>
              <div className="flex">
                <span className="w-28 text-slate-500 shrink-0">주요 활동 지역</span>
                <span className="text-slate-200">광주광역시 수완지구</span>
              </div>
            </div>
          </div>

          {/* Contact Col */}
          <div className="bg-slate-900/60 p-5 rounded-xl border border-slate-800">
            <h4 className="text-white font-semibold text-sm mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4 text-amber-400" />
              대표 직통 상담전화
            </h4>
            <a
              href="tel:010-7568-4183"
              className="text-2xl font-black text-amber-400 tracking-wide hover:text-amber-300 block my-1"
            >
              010-7568-4183
            </a>
            <p className="text-xs text-slate-400 mb-3">
              상담시간: 연중무휴 09:00 ~ 21:00 (전화/방문 상담 예약 가능)
            </p>
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>광주광역시 수완지구 전지역 매물 접수 및 상담</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Privacy Policy */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
        <div>
          © {new Date().getFullYear()} 수완신도시공인중개사사무소. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPrivacyModalOpen(true)}
            className="hover:text-slate-300 underline underline-offset-2 transition-colors cursor-pointer"
          >
            개인정보 처리방침
          </button>
          <span>|</span>
          <span>부동산의 가치</span>
        </div>
      </div>

      {/* Privacy Policy Modal */}
      {privacyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 max-w-xl w-full rounded-2xl p-6 shadow-2xl max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <h3 className="text-lg font-bold text-slate-900">개인정보 처리방침</h3>
              <button
                onClick={() => setPrivacyModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto py-4 text-xs sm:text-sm text-slate-600 space-y-3 leading-relaxed">
              <p>
                <strong>수완신도시공인중개사사무소</strong>(대표 김정민)는 고객님의 개인정보를 중요시하며, 개인정보보호법 등 관련 법령을 준수합니다.
              </p>
              <h4 className="font-semibold text-slate-900 pt-2">1. 수집하는 개인정보 항목</h4>
              <p>- 매물 상담 및 문의 시: 성명, 연락처(휴대전화번호), 상담 희망 매물 및 문의 내용</p>
              <h4 className="font-semibold text-slate-900 pt-2">2. 개인정보 수집 및 이용 목적</h4>
              <p>- 부동산 매물 상담, 현장 안내 예약, 중개 의뢰 처리 및 고객 피드백 안내</p>
              <h4 className="font-semibold text-slate-900 pt-2">3. 보유 및 이용 기간</h4>
              <p>- 상담 완료 후 3년간 보관 후 지체 없이 파기합니다.</p>
              <h4 className="font-semibold text-slate-900 pt-2">4. 개인정보 보호 책임자</h4>
              <p>- 성명: 김정민 (수완신도시공인중개사사무소 대표)<br />- 전화번호: 010-7568-4183</p>
            </div>
            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPrivacyModalOpen(false)}
                className="px-5 py-2 bg-[#0F1E36] text-white rounded-lg text-sm font-semibold hover:bg-slate-800"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
