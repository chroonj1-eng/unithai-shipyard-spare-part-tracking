import React, { useState } from 'react';
import {
  Bell,
  Volume2,
  VolumeX,
  ShieldCheck,
  HardHat,
  Plus,
  Radio,
  Wifi,
  WifiOff,
  Download,
  RotateCcw,
  Languages,
  ChevronDown,
  LogIn,
  UserCheck,
  MessageSquare,
  Settings,
  Sun,
  Moon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { THEMES } from '../data/initialData';
import { ThemeId, UserRole } from '../types/sparePart';
import { PWAInstallButton } from './PWAInstallButton';
import { LineBroadcastModal } from './LineBroadcastModal';
import { LineConfigModal } from './LineConfigModal';
import { exportPartsToCSV } from '../utils/storage';
import { UnithaiLogo } from './UnithaiLogo';

export const Header: React.FC = () => {
  const {
    spareParts,
    unreadCount,
    userRole,
    setUserRole,
    currentUser,
    setIsLoginModalOpen,
    logout,
    theme,
    setTheme,
    toggleTheme,
    isDark,
    language,
    setLanguage,
    t,
    isOnline,
    soundEnabled,
    setSoundEnabled,
    setIsAddModalOpen,
    setIsNotificationModalOpen,
    resetToInitialData,
    sendCustomPushNotification,
  } = useApp();

  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isQuickAlertOpen, setIsQuickAlertOpen] = useState(false);
  const [isLineBroadcastOpen, setIsLineBroadcastOpen] = useState(false);
  const [isLineConfigOpen, setIsLineConfigOpen] = useState(false);
  const [quickAlertText, setQuickAlertText] = useState('');
  const [quickAlertPriority, setQuickAlertPriority] = useState<'normal' | 'urgent' | 'critical'>('urgent');

  const handleSendQuickBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickAlertText.trim()) return;
    sendCustomPushNotification(
      quickAlertPriority === 'critical'
        ? language === 'TH'
          ? '🚨 ด่วนที่สุด: ประกาศอู่เรือ UNITHAI'
          : '🚨 CRITICAL: UNITHAI Yard Alert'
        : language === 'TH'
        ? '📢 แจ้งเตือนด่วน: งานอะไหล่เรือ'
        : '📢 URGENT: Spare Part Alert',
      quickAlertText.trim(),
      quickAlertPriority
    );
    setQuickAlertText('');
    setIsQuickAlertOpen(false);
  };

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md border-b transition-colors shadow-sm ${
      isDark
        ? 'bg-[#07172c]/95 border-blue-900/60 text-white'
        : 'bg-white/95 border-slate-200 text-slate-800'
    }`}>
      {/* UNITHAI Corporate Tricolor Ribbon (Red, White, Blue) */}
      <div className="h-1 w-full flex">
        <div className="h-full flex-1 bg-red-600" />
        <div className="h-full flex-1 bg-white" />
        <div className="h-full flex-1 bg-blue-700" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          
          {/* Brand Identity with Official UNITHAI Logo */}
          <div className="flex items-center gap-3 min-w-0">
            <div className={`px-2.5 py-1.5 rounded-xl shadow-sm border shrink-0 flex items-center justify-center ${
              isDark ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-200'
            }`}>
              <UnithaiLogo className="h-6 sm:h-7" showText={true} lightBackground={true} />
            </div>
            <div className="min-w-0 hidden md:block">
              <div className="flex items-center gap-2">
                <span className={`font-bold tracking-wide text-xs sm:text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {language === 'TH' ? 'อู่เรือยูนิไทย แหลมฉบัง' : 'Shipyard & Engineering'}
                </span>
                <span className="inline-flex text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-red-600/20 text-red-500 border border-red-500/40">
                  {t.badgeText}
                </span>
              </div>
              <p className={`text-[11px] truncate ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
                {t.appSubtitle}
              </p>
            </div>
          </div>

          {/* Center / Right Control Cluster */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* 2-Mode Background Color Toggle: Dark / Bright */}
            <div
              className={`flex items-center rounded-xl p-0.5 border text-xs font-semibold ${
                isDark
                  ? 'bg-slate-900/90 border-slate-700'
                  : 'bg-slate-100 border-slate-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition ${
                  isDark
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
                title={language === 'TH' ? 'เปลี่ยนเป็นโหมดมืด (Dark)' : 'Switch to Dark Mode'}
              >
                <Moon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'TH' ? 'มืด' : 'Dark'}</span>
              </button>

              <button
                type="button"
                onClick={() => setTheme('bright')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition ${
                  !isDark
                    ? 'bg-amber-400 text-slate-950 shadow-sm font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={language === 'TH' ? 'เปลี่ยนเป็นโหมดสว่าง (Bright)' : 'Switch to Bright Mode'}
              >
                <Sun className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'TH' ? 'สว่าง' : 'Bright'}</span>
              </button>
            </div>

            {/* Language Switcher Toggle (TH | EN) */}
            <div className={`flex items-center p-0.5 rounded-lg border text-xs ${
              isDark ? 'bg-slate-800/90 border-slate-700' : 'bg-slate-100 border-slate-200'
            }`}>
              <button
                onClick={() => setLanguage('TH')}
                className={`px-2 py-1 rounded-md text-xs font-bold transition ${
                  language === 'TH'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="เปลี่ยนเป็นภาษาไทย"
              >
                TH
              </button>
              <button
                onClick={() => setLanguage('EN')}
                className={`px-2 py-1 rounded-md text-xs font-bold transition ${
                  language === 'EN'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Switch to English version"
              >
                EN
              </button>
            </div>

            {/* Online / Offline Status Badge */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                isOnline
                  ? isDark
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-amber-500/15 text-amber-500 border-amber-500/40 animate-pulse'
              }`}
              title={isOnline ? (language === 'TH' ? 'เชื่อมต่อออนไลน์ พร้อมรับการแจ้งเตือนทันที' : 'Online connection active') : (language === 'TH' ? 'โหมดออฟไลน์: บันทึกและอ่านข้อมูลจากแคชในเครื่อง' : 'Offline mode: reading from device cache')}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3.5 h-3.5" />
                  <span>{t.online}</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5" />
                  <span>{t.offline}</span>
                </>
              )}
            </div>

            {/* PWA In-App Install Prompt */}
            <PWAInstallButton />

            {/* Sound Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? (language === 'TH' ? 'เปิดเสียงเตือนอู่เรืออยู่ (คลิกเพื่อปิด)' : 'Audio alert on (click to mute)') : (language === 'TH' ? 'ปิดเสียงเตือนอยู่ (คลิกเพื่อเปิด)' : 'Audio alert muted (click to unmute)')}
              className={`p-2 rounded-lg border transition ${
                soundEnabled
                  ? isDark
                    ? 'bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
                  : 'bg-rose-500/10 text-rose-500 border-rose-500/30'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* User Profile & Portal Indicator (Admin / SRM / CO-SRM / In Charge) */}
            <div className="relative">
              <button
                onClick={() => setIsLoginModalOpen(true)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition shadow-sm ${
                  currentUser?.role === 'ADMIN'
                    ? 'bg-red-950/70 border-red-500/60 text-white hover:bg-red-900/60'
                    : 'bg-blue-950/80 border-blue-600/60 text-white hover:bg-blue-900/80'
                }`}
                title={language === 'TH' ? 'คลิกเพื่อสลับบัญชี หรือ เข้าใช้งานด้วยอีเมลบริษัท' : 'Click to switch account or sign in'}
              >
                {currentUser?.role === 'ADMIN' ? (
                  <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
                ) : (
                  <HardHat className="w-4 h-4 text-blue-400 shrink-0" />
                )}
                
                <div className="text-left hidden sm:block max-w-[125px] truncate">
                  <div className="truncate text-white font-bold leading-tight">
                    {currentUser?.name || (language === 'TH' ? 'เข้าสู่ระบบ' : 'Login')}
                  </div>
                  <div className="text-[10px] text-slate-300 truncate font-mono">
                    {currentUser
                      ? currentUser.role === 'ADMIN'
                        ? '👑 ADMIN (ดูทุก Job)'
                        : `${currentUser.position} • ${currentUser.email.split('@')[0]}`
                      : 'Login'}
                  </div>
                </div>

                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>
            </div>

            {/* Notification Bell with unread counter */}
            <button
              onClick={() => setIsNotificationModalOpen(true)}
              className="relative p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700 transition"
              title={t.notifHistoryTitle}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-lg animate-pulse ring-1 ring-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Admin LINE OA & Broadcast Controls */}
            {currentUser?.role === 'ADMIN' && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setIsLineBroadcastOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#00C300]/20 hover:bg-[#00C300]/30 text-[#00C300] border border-[#00C300]/40 text-xs font-bold transition shadow-sm"
                  title="ส่งบรอดแคสต์และแจ้งเตือนเข้า LINE ของ SRM"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">บรอดแคสต์ LINE</span>
                </button>

                <button
                  onClick={() => setIsLineConfigOpen(true)}
                  className="p-1.5 sm:p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 hover:text-[#00C300] hover:border-[#00C300]/50 transition"
                  title="ตั้งค่า LINE Official Account (LINE OA) & ลิงก์เชื่อมโยง"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Admin Actions: Quick Push Broadcast & Add Booking */}
            {userRole === 'ADMIN' && (
              <>
                <button
                  onClick={() => setIsQuickAlertOpen(!isQuickAlertOpen)}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600/30 border border-red-500/40 text-xs font-semibold transition"
                  title={language === 'TH' ? 'ยิงแจ้งเตือนด่วนหาทีมงานทันที' : 'Broadcast push alert to smartphone screens'}
                >
                  <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                  <span>{t.quickBroadcast}</span>
                </button>

                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-blue-700 via-blue-600 to-red-600 hover:from-blue-600 hover:to-red-500 text-white font-bold text-xs shadow-md shadow-blue-900/30 transition active:scale-95 border border-white/20"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">{t.addBooking}</span>
                </button>
              </>
            )}

            {/* Quick Export / Options Menu */}
            <button
              onClick={() => exportPartsToCSV(spareParts)}
              title={t.exportCsv}
              className="hidden lg:flex p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={resetToInitialData}
              title={t.resetData}
              className="hidden xl:flex p-2 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Broadcast Modal Dropdown for Admin */}
      {isQuickAlertOpen && (
        <div className="bg-slate-950/95 border-b border-amber-500/30 px-4 py-3 sm:px-6 shadow-xl animate-in slide-in-from-top duration-200">
          <form onSubmit={handleSendQuickBroadcast} className="max-w-4xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs shrink-0">
              <Radio className="w-4 h-4 animate-pulse" />
              <span>{language === 'TH' ? 'ส่งข้อความพุชถึงสมาร์ทโฟนทีมงาน:' : 'Broadcast Push to Smartphone Screens:'}</span>
            </div>
            <input
              type="text"
              value={quickAlertText}
              onChange={(e) => setQuickAlertText(e.target.value)}
              placeholder={language === 'TH' ? 'เช่น อะไหล่เรือ MV Ocean Splendor ถึงหน้างานแล้ว...' : 'e.g. Spare part for MV Ocean Splendor has arrived at Quay 3...'}
              className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <select
                value={quickAlertPriority}
                onChange={(e) => setQuickAlertPriority(e.target.value as any)}
                className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-300 focus:outline-none"
              >
                <option value="normal">{language === 'TH' ? 'ปกติ (Normal)' : 'Normal'}</option>
                <option value="urgent">{language === 'TH' ? 'ด่วน (Urgent)' : 'Urgent'}</option>
                <option value="critical">{language === 'TH' ? 'ด่วนที่สุด (Critical)' : 'Critical'}</option>
              </select>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition whitespace-nowrap"
              >
                {language === 'TH' ? 'ส่งพุชเดี๋ยวนี้' : 'Send Push Now'}
              </button>
              <button
                type="button"
                onClick={() => setIsQuickAlertOpen(false)}
                className="px-2.5 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* LINE Broadcast Modal */}
      <LineBroadcastModal
        isOpen={isLineBroadcastOpen}
        onClose={() => setIsLineBroadcastOpen(false)}
      />

      {/* LINE OA Configuration Modal */}
      <LineConfigModal
        isOpen={isLineConfigOpen}
        onClose={() => setIsLineConfigOpen(false)}
      />
    </header>
  );
};
