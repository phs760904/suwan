import React, { useState } from 'react';
import { X, Phone, User, MessageSquare, CheckCircle2, Building, AlertCircle } from 'lucide-react';
import { Property } from '../types';
import { createInquiry } from '../firebase/inquiries';

interface InquiryModalProps {
  property?: Property | null;
  onClose: () => void;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({ property, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(
    property ? `[${property.title}] 매물에 대해 상담 문의드립니다. 상세 조건 및 현장 방문 일정 안내 부탁드립니다.` : ''
  );
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
      setError('문의 내용을 입력해 주세요.');
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
        propertyId: property?.id || '',
        propertyTitle: property?.title || '',
        message: message.trim(),
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      setSuccess(true);
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      setError('문의 접수 중 오류가 발생했습니다. 대표번호 010-7568-4183으로 직접 전화 주시면 신속히 안내해 드리겠습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-1 text-slate-400 hover:text-slate-700 rounded-lg"
          aria-label="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">상담 문의가 정상 접수되었습니다</h3>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              수완신도시공인중개사사무소 김정민 대표가 남겨주신 연락처로 신속하게 안내 연락드리겠습니다.
            </p>
            <div className="pt-4 flex flex-col gap-2">
              <a
                href="tel:010-7568-4183"
                className="w-full py-3 bg-[#0F1E36] hover:bg-[#162a4d] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>010-7568-4183 직통 전화 걸기</span>
              </a>
              <button
                onClick={onClose}
                className="w-full py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50"
              >
                닫기
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                수완신도시공인중개사사무소
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                부동산 전문 1:1 맞춤 상담 신청
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                광주 수완지구 아파트, 상가, 원룸 매물 매매·임대 전문 상담
              </p>
            </div>

            {property && (
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5 text-xs text-slate-700">
                <Building className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="truncate">
                  <span className="font-bold text-slate-900">문의 매물:</span> {property.title} ({property.price || '가격 협의'})
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-3">
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
                  상담 및 문의 내용 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="희망 지역, 예산, 입주 일정 또는 궁금하신 사항을 남겨주시면 정성껏 상담해 드립니다."
                    className="w-full pl-9 pr-3.5 py-2.5 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0F1E36]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="privacy"
                  checked={privacyAgreed}
                  onChange={(e) => setPrivacyAgreed(e.target.checked)}
                  className="rounded text-[#0F1E36] focus:ring-[#0F1E36]"
                />
                <label htmlFor="privacy" className="text-xs text-slate-600 cursor-pointer">
                  [필수] 매물 상담을 위한 개인정보(성명, 연락처) 수집 및 이용에 동의합니다.
                </label>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#0F1E36] hover:bg-[#162a4d] text-white font-bold rounded-xl text-sm shadow-md transition-colors disabled:opacity-50"
              >
                {loading ? '접수 중...' : '상담 문의 접수하기'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
