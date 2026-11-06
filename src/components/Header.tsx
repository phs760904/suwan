import React, { useState } from 'react';
import { Phone, MapPin, Building2, Menu, X, ShieldCheck, UserCheck, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenConsultation?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, setCurrentTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin, logout } = useAuth();

  const navItems = [
    { id: 'map', label: '지도매물' },
    { id: 'list', label: '목록매물' },
    { id: 'directions', label: '오시는길' },
    { id: 'consultation', label: '상담' },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Utility Bar */}
      <div className="bg-[#0F1E36] text-slate-200 text-xs py-2 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-amber-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              부동산의 가치
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300">
              광주 수완지구 부동산 전문 (대표 김정민)
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="tel:010-7568-4183"
              className="flex items-center gap-1.5 text-white hover:text-amber-400 transition-colors font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>010-7568-4183</span>
            </a>

            <div className="h-3 w-px bg-slate-700 hidden sm:block"></div>

            {isAdmin ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavClick('admin')}
                  className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-medium"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>관리자 대시보드</span>
                </button>
                <button
                  onClick={() => logout()}
                  title="로그아웃"
                  className="text-slate-400 hover:text-white"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('admin')}
                className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden sm:inline">관리자 접속</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
        {/* Logo and Brand */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 text-left group focus:outline-hidden"
        >
          <div className="w-10 h-10 rounded-lg bg-[#0F1E36] text-amber-400 flex items-center justify-center shadow-sm group-hover:bg-[#162a4d] transition-colors">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-[#0F1E36]">
                수완신도시공인중개사사무소
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              광주 수완지구 전문 공인중개사 | 대표 김정민
            </p>
          </div>
        </button>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-all ${
                  isActive
                    ? 'text-[#0F1E36] bg-slate-100 font-bold border-b-2 border-[#0F1E36]'
                    : 'text-slate-700 hover:text-[#0F1E36] hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}

          <div className="ml-4 pl-4 border-l border-slate-200">
            <a
              href="tel:010-7568-4183"
              className="inline-flex items-center gap-2 bg-[#0F1E36] hover:bg-[#162a4d] text-white px-4 py-2 rounded-lg text-sm font-bold shadow-xs transition-colors"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>010-7568-4183</span>
            </a>
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-[#0F1E36] hover:bg-slate-100 rounded-lg focus:outline-hidden"
          aria-label="메뉴 열기"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2 shadow-lg">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">빠른 메뉴 이동</span>
            <span className="text-xs font-semibold text-amber-700">부동산의 가치</span>
          </div>

          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold ${
                currentTab === item.id
                  ? 'bg-slate-100 text-[#0F1E36] font-bold'
                  : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              {item.label}
            </button>
          ))}

          <div className="pt-2">
            <a
              href="tel:010-7568-4183"
              className="w-full flex items-center justify-center gap-2 bg-[#0F1E36] text-white py-3 rounded-lg font-bold text-sm shadow-xs"
            >
              <Phone className="w-4 h-4 text-amber-400" />
              <span>전화 상담 바로연결 (010-7568-4183)</span>
            </a>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center justify-center gap-2 text-slate-600 hover:text-[#0F1E36] py-2 text-xs font-medium"
            >
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>{isAdmin ? '관리자 대시보드' : '공인중개사 관리자 로그인'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
