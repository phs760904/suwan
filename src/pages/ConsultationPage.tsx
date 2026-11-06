import React, { useState } from 'react';
import {
  Phone,
  MessageSquare,
  Building,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { createInquiry } from '../firebase/inquiries';

export const ConsultationPage: React.FC = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [propertyTitle, setPropertyTitle] = useState('');
  const [message, setMessage] = useState('');
  const [privacyAgreed, setPrivacyAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('성함을 입력해 주세요.');
      return;
    }
    if (!phone.trim()) {
      setError('연락처를 입력해 주세요.');
      return;
    }
    if (!message.trim()) {
      setError('상담 내용을 작성해 주세요.');
      return;
    }
    if (!privacyAgreed) {
      setError('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }

    setLoading(true);
    try {
      await createInquiry({
        name: name.trim(),
        phone: phone.trim(),
        propertyTitle: propertyTitle.trim() || '일반 매물 상담',
        message: message.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      setSuccess(true);
      setName('');
      setPhone('');
      setPropertyTitle('');
      setMessage('');
    } catch (err) {
      console.error('Failed to submit consultation inquiry:', err);
      setError('접수 중 오류가 발생했습니다. 직통 번호 010-7568-4183으로 전화 주시면 바로 상담해 드립니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 space-y-10">
      {/* Page Title */}
      <div className="border-b border-slate-200 pb-5">
        <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
          수완신도시공인중개사사무소
        </span>
        <h1 className="text-3xl font-extrabold text-[#0F1E36] tracking-tight mt-1">
          부동산 전문 상담
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          광주 수완지구 아파트, 상가, 원룸 매매 및 임대 관련 궁금하신 점을 남겨주시면 대표 공인중개사가 직접 답변드립니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Direct Phone Call Box (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0F1E36] text-white rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">
              <Phone className="w-3.5 h-3.5" />
              <span>실시간 전화 상담</span>
            </div>

            <h3 className="text-2xl font-black tracking-tight leading-snug">
              가장 빠른 상담은<br />전화 문의입니다
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              수완신도시공인중개사사무소 대표 김정민 공인중개사 직통 번호입니다. 매물 찾기, 매물 내놓기 등 부담 없이 문의해 주세요.
            </p>

            <div className="pt-2">
              <a
                href="tel:010-7568-4183"
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xl rounded-xl shadow-lg transition-transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5 text-slate-950" />
                <span>010-7568-4183</span>
              </a>
            </div>

            <div className="pt-3 border-t border-slate-800 text-xs text-slate-400 space-y-1">
              <div>• 대표 공인중개사: 김정민</div>
              <div>• 중개등록번호: 가4106-852</div>
              <div>• 상담 가능 시간: 연중무휴 09:00 ~ 21:00</div>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3 shadow-xs">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              수완신도시공인중개사 안심 서비스
            </h4>
            <ul className="text-xs text-slate-600 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>모든 상담 내용은 비밀이 보장되며 외부에 공개되지 않습니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>정확한 시세 및 세무·법률 권리분석을 무료로 제공합니다.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span>수완지구 전역의 최신 매물 현황을 빠르게 매칭해 드립니다.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Online Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2 pb-4 border-b border-slate-100 mb-6">
            <MessageSquare className="w-5 h-5 text-amber-600" />
            <h3 className="text-lg font-bold text-slate-900">온라인 상담 신청서 작성</h3>
          </div>

          {success ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-900">상담 신청이 완료되었습니다</h4>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                김정민 대표가 남겨주신 연락처로 검토 후 신속하게 연락드리겠습니다. 급하신 문의는 대표 번호 <strong>010-7568-4183</strong>으로 전화 주시기 바랍니다.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 bg-[#0F1E36] text-white text-xs font-bold rounded-xl"
                >
                  추가 문의 작성하기
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  고객 성함 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="홍길동"
                    className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0F1E36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  연락처 (휴대전화) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0F1E36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  관심 매물 또는 희망 유형 (선택)
                </label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={propertyTitle}
                    onChange={(e) => setPropertyTitle(e.target.value)}
                    placeholder="예: 수완지구 34평형 아파트 매매 / 1층 상가 임대 등"
                    className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0F1E36]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  상담 문의 내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="예산, 희망 입주 시기, 요구 조건 등 상세한 내용을 남겨주시면 더욱 정확한 맞춤 상담이 가능합니다."
                  className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0F1E36]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="pagePrivacy"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="rounded text-[#0F1E36] focus:ring-[#0F1E36]"
                />
                <label htmlFor="pagePrivacy" className="text-xs text-slate-600 cursor-pointer">
                  [필수] 매물 상담을 위한 개인정보(성명, 연락처) 수집 및 이용에 동의합니다.
                </label>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-[#0F1E36] hover:bg-[#162a4d] text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-amber-400" />
                  <span>{loading ? '신청서 전송 중...' : '상담 신청 완료하기'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
