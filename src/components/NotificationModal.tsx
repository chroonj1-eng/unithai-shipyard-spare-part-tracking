import React, { useState, useMemo } from 'react';
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  Send,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { requestNotificationPermission, getNotificationPermission } from '../utils/notification';
import { AppNotification } from '../types/sparePart';

export const NotificationModal: React.FC = () => {
  const {
    isNotificationModalOpen,
    setIsNotificationModalOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotificationHistory,
    setSelectedPart,
    spareParts,
    sendCustomPushNotification,
    userRole,
    language,
    t,
  } = useApp();

  const [filterType, setFilterType] = useState<'all' | 'unread' | 'urgent' | 'success'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(() => getNotificationPermission());

  const handleRequestPermission = async () => {
    const perm = await requestNotificationPermission();
    setBrowserPermission(perm);
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notif) => {
      // Filter by tab
      if (filterType === 'unread' && notif.read) return false;
      if (filterType === 'urgent' && notif.priority !== 'urgent' && notif.priority !== 'critical') return false;
      if (filterType === 'success' && notif.priority !== 'success') return false;

      // Filter by search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = notif.title.toLowerCase().includes(q);
        const matchMsg = notif.message.toLowerCase().includes(q);
        const matchBooking = notif.bookingNo?.toLowerCase().includes(q);
        const matchJob = notif.jobNo?.toLowerCase().includes(q);
        return matchTitle || matchMsg || matchBooking || matchJob;
      }

      return true;
    });
  }, [notifications, filterType, searchQuery]);

  if (!isNotificationModalOpen) return null;

  const handleSelectNotif = (notif: AppNotification) => {
    markNotificationRead(notif.id);
    if (notif.partId) {
      const part = spareParts.find((p) => p.id === notif.partId);
      if (part) {
        setSelectedPart(part);
        setIsNotificationModalOpen(false);
      }
    }
  };

  const handleSendTestPush = () => {
    sendCustomPushNotification(
      language === 'TH' ? '🔔 ทดสอบการแจ้งเตือนพุช (Push Test)' : '🔔 Instant Push Test Alert',
      language === 'TH'
        ? 'ระบบแจ้งเตือนอะไหล่เรือ UNITHAI Shipyard ทำงานได้อย่างสมบูรณ์แบบ ทั้งบนหน้าจอและประวัติการแจ้งเตือน'
        : 'UNITHAI Shipyard real-time push alert system is running properly on smartphone screen and history.',
      'urgent'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                {t.notifHistoryTitle}
                <span className="text-xs font-normal text-slate-400">
                  ({notifications.length})
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {t.notifHistorySubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSendTestPush}
              title={language === 'TH' ? 'ยิงทดสอบ Push Notification' : 'Broadcast test push alert'}
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border border-cyan-500/30 text-xs font-medium transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.testPush}</span>
            </button>
            <button
              onClick={() => setIsNotificationModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Browser Permission Prompt Banner */}
        {browserPermission !== 'granted' && (
          <div className="px-4 py-2.5 bg-blue-950/40 border-b border-blue-800/40 flex items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-2 text-blue-300">
              <ShieldAlert className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{t.pushPermissionPrompt}</span>
            </div>
            <button
              onClick={handleRequestPermission}
              className="px-2.5 py-1 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-500 transition whitespace-nowrap"
            >
              {t.enableNotifications}
            </button>
          </div>
        )}

        {/* Search & Filter Toolbar */}
        <div className="p-3 sm:px-5 sm:py-3 border-b border-slate-800 flex flex-col sm:flex-row gap-2.5 justify-between items-stretch sm:items-center bg-slate-950/30">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'TH' ? 'ค้นหาข้อความ, เลขที่ Booking, รหัสงานเรือ...' : 'Search alerts, booking number, job...'}
              className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-slate-800/90 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                filterType === 'all'
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {language === 'TH' ? 'ทั้งหมด' : 'All'}
            </button>
            <button
              onClick={() => setFilterType('unread')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                filterType === 'unread'
                  ? 'bg-blue-600/30 text-blue-300 border border-blue-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {language === 'TH' ? 'ยังไม่อ่าน' : 'Unread'}
            </button>
            <button
              onClick={() => setFilterType('urgent')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                filterType === 'urgent'
                  ? 'bg-amber-600/30 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {language === 'TH' ? 'ด่วน' : 'Urgent'}
            </button>
            <button
              onClick={() => setFilterType('success')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition ${
                filterType === 'success'
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {language === 'TH' ? 'ส่งมอบแล้ว' : 'Delivered'}
            </button>
          </div>
        </div>

        {/* Action Bar (Mark all read / Clear history) */}
        <div className="px-4 py-2 border-b border-slate-800/60 bg-slate-900 flex items-center justify-between text-xs text-slate-400">
          <span>
            {language === 'TH' ? `แสดง ${filteredNotifications.length} การแจ้งเตือน` : `Showing ${filteredNotifications.length} notifications`}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={markAllNotificationsRead}
              className="flex items-center gap-1 hover:text-cyan-400 transition"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{t.markAllRead}</span>
            </button>
            {userRole === 'ADMIN' && (
              <button
                onClick={clearNotificationHistory}
                className="flex items-center gap-1 text-slate-500 hover:text-rose-400 transition"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.clearHistory}</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications Scrollable List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800 p-2 sm:p-3 space-y-2">
          {filteredNotifications.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Bell className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">
                {language === 'TH' ? 'ไม่พบรายการแจ้งเตือนตามเงื่อนไข' : 'No notifications found matching filter'}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              const isUrgent = notif.priority === 'urgent' || notif.priority === 'critical';
              const isSuccess = notif.priority === 'success';

              return (
                <div
                  key={notif.id}
                  onClick={() => handleSelectNotif(notif)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer relative ${
                    !notif.read
                      ? 'bg-slate-800/80 border-cyan-500/40 shadow-sm'
                      : 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isUrgent
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : isSuccess
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                      }`}
                    >
                      {isUrgent ? (
                        <AlertTriangle className="w-4 h-4" />
                      ) : isSuccess ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Bell className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate">
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 shrink-0 font-mono">
                          <Clock className="w-3 h-3" />
                          {notif.timestamp}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="mt-2 flex items-center gap-2 flex-wrap">
                        {notif.bookingNo && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                            {notif.bookingNo}
                          </span>
                        )}
                        {notif.jobNo && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950/60 text-blue-300 border border-blue-900/50">
                            {notif.jobNo}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-500 ml-auto">
                          {language === 'TH' ? 'โดย:' : 'By:'} {notif.senderName}
                        </span>
                        {notif.partId && (
                          <span className="text-[10px] text-cyan-400 flex items-center gap-1">
                            <ExternalLink className="w-3 h-3" />
                            {language === 'TH' ? 'ดูรายละเอียด' : 'View part'}
                          </span>
                        )}
                      </div>
                    </div>

                    {!notif.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shrink-0 mt-1" />
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>
            {language === 'TH' ? 'รองรับการบันทึกประวัติแบบออฟไลน์ 100%' : '100% Offline Notification Storage'}
          </span>
          <button
            onClick={() => setIsNotificationModalOpen(false)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 font-medium transition"
          >
            {t.close}
          </button>
        </div>

      </div>
    </div>
  );
};
