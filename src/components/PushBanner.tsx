import React from 'react';
import { X, ExternalLink, BellRing, CheckCircle, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PushBanner: React.FC = () => {
  const {
    activeNotification,
    dismissPushBanner,
    setSelectedPart,
    spareParts,
    setIsNotificationModalOpen,
    language,
  } = useApp();

  if (!activeNotification) return null;

  const handleBannerClick = () => {
    if (activeNotification.partId) {
      const part = spareParts.find((p) => p.id === activeNotification.partId);
      if (part) {
        setSelectedPart(part);
      } else {
        setIsNotificationModalOpen(true);
      }
    } else {
      setIsNotificationModalOpen(true);
    }
    dismissPushBanner();
  };

  const getPriorityStyle = () => {
    switch (activeNotification.priority) {
      case 'critical':
        return {
          border: 'border-rose-500/80',
          bg: 'bg-rose-950/95',
          icon: <AlertOctagon className="w-5 h-5 text-rose-400 shrink-0 animate-bounce" />,
          tag: language === 'TH' ? '🚨 ด่วนที่สุด (CRITICAL)' : '🚨 CRITICAL ALERT',
          tagClass: 'bg-rose-500 text-white',
        };
      case 'urgent':
        return {
          border: 'border-amber-500/80',
          bg: 'bg-slate-900/95',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          tag: language === 'TH' ? '⚠️ แจ้งเตือนด่วน (URGENT)' : '⚠️ URGENT ALERT',
          tagClass: 'bg-amber-500 text-slate-950 font-bold',
        };
      case 'success':
        return {
          border: 'border-emerald-500/80',
          bg: 'bg-slate-900/95',
          icon: <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />,
          tag: language === 'TH' ? '✅ ส่งมอบสำเร็จ (DELIVERED)' : '✅ DELIVERED',
          tagClass: 'bg-emerald-500 text-white',
        };
      default:
        return {
          border: 'border-cyan-500/60',
          bg: 'bg-slate-900/95',
          icon: <BellRing className="w-5 h-5 text-cyan-400 shrink-0" />,
          tag: language === 'TH' ? '🔔 อัพเดตอะไหล่ (SPARE PART ALERT)' : '🔔 SPARE PART ALERT',
          tagClass: 'bg-cyan-500 text-slate-950 font-semibold',
        };
    }
  };

  const style = getPriorityStyle();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 pointer-events-auto transition-all duration-300">
      <div
        className={`rounded-2xl border ${style.border} ${style.bg} p-3.5 shadow-2xl backdrop-blur-xl ring-1 ring-white/10 text-white cursor-pointer hover:scale-[1.01] transition-transform`}
        onClick={handleBannerClick}
      >
        <div className="flex items-start gap-3">
          {/* Shipyard / App Icon */}
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5 shrink-0 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              {style.icon}
            </div>
          </div>

          {/* Notification Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 truncate">
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${style.tagClass}`}>
                  {style.tag}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">UNITHAI YARD</span>
              </div>
              <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                {language === 'TH' ? 'เมื่อสักครู่' : 'Just now'}
              </span>
            </div>

            <h4 className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
              {activeNotification.title}
            </h4>
            <p className="text-xs text-slate-300 line-clamp-2 mt-0.5 leading-relaxed">
              {activeNotification.message}
            </p>

            <div className="mt-2 flex items-center gap-2 text-[11px] text-cyan-400 font-medium">
              <ExternalLink className="w-3 h-3" />
              <span>{language === 'TH' ? 'แตะเพื่อเปิดดูรายละเอียดอะไหล่' : 'Tap to inspect spare part details'}</span>
            </div>
          </div>

          {/* Dismiss button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              dismissPushBanner();
            }}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 shrink-0 transition"
            title={language === 'TH' ? 'ปิดการแจ้งเตือน' : 'Dismiss notification'}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
