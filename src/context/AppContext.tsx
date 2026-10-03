import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {
  SparePart,
  AppNotification,
  UserRole,
  ThemeId,
  Language,
  ViewMode,
  NotificationPriority,
  PartStatus,
  UserProfile,
} from '../types/sparePart';
import { INITIAL_SPARE_PARTS, INITIAL_NOTIFICATIONS, THEMES, DEFAULT_USERS } from '../data/initialData';
import { TRANSLATIONS } from '../utils/i18n';
import {
  loadSpareParts,
  saveSpareParts,
  loadNotifications,
  saveNotifications,
  loadSavedTheme,
  saveTheme,
  loadSavedUser,
  saveUser,
  loadRegisteredUsers,
} from '../utils/storage';
import { sendLineBroadcastOrPush, loadLineConfig } from '../services/lineService';
import { showBrowserNotification } from '../utils/notification';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface AppContextType {
  spareParts: SparePart[];
  notifications: AppNotification[];
  activeNotification: AppNotification | null;
  unreadCount: number;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  currentUser: UserProfile | null;
  login: (user: UserProfile) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  accessibleSpareParts: SparePart[];
  userAssignedJobs: string[];
  theme: ThemeId;
  setTheme: (theme: ThemeId) => void;
  toggleTheme: () => void;
  isDark: boolean;
  themeConfig: typeof THEMES['dark'];
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof TRANSLATIONS['TH'];
  isOnline: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedJobFilter: string;
  setSelectedJobFilter: (job: string) => void;
  selectedStatusFilter: string;
  setSelectedStatusFilter: (status: string) => void;
  selectedTypeFilter: string;
  setSelectedTypeFilter: (type: string) => void;
  selectedPart: SparePart | null;
  setSelectedPart: (part: SparePart | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isNotificationModalOpen: boolean;
  setIsNotificationModalOpen: (open: boolean) => void;
  isQuickStatusModalOpen: boolean;
  setIsQuickStatusModalOpen: (open: boolean) => void;
  partToUpdateStatus: SparePart | null;
  setPartToUpdateStatus: (part: SparePart | null) => void;
  isPrintModalOpen: boolean;
  setIsPrintModalOpen: (open: boolean) => void;

  // Actions
  addSparePart: (newPart: Omit<SparePart, 'id' | 'updatedAt' | 'updatedBy'>) => void;
  updateSparePart: (
    id: string,
    updates: Partial<SparePart>,
    notifyMessage?: string,
    notifyPriority?: NotificationPriority
  ) => void;
  deleteSparePart: (id: string) => void;
  userConfirmReceived: (
    partId: string,
    deliveryDate: string,
    yardLocation?: string,
    receiverNote?: string
  ) => void;
  userRequestUrgent: (
    partId: string,
    isUrgent: boolean,
    reason?: string
  ) => void;
  sendCustomPushNotification: (
    title: string,
    message: string,
    priority: NotificationPriority,
    partId?: string,
    bookingNo?: string,
    jobNo?: string
  ) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotificationHistory: () => void;
  dismissPushBanner: () => void;
  resetToInitialData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const BROADCAST_CHANNEL_NAME = 'unithai_spare_parts_channel';

/**
 * Database reset version
 *
 * Changed from v1 to v2 so old sample / shipment data
 * stored in Local Storage will be cleared once.
 */
const EMPTY_DATABASE_VERSION = 'unithai_empty_database_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isOnline = useOnlineStatus();

  // ============================================================
  // Persistent States
  // ============================================================

  const [spareParts, setSpareParts] = useState<SparePart[]>(() => {
    if (typeof window !== 'undefined') {
      const initialized = localStorage.getItem(EMPTY_DATABASE_VERSION);

      // Clear old stored shipment data only once
      if (!initialized) {
        saveSpareParts([]);
        saveNotifications([]);
        localStorage.setItem(EMPTY_DATABASE_VERSION, 'true');
        return [];
      }
    }

    const saved = loadSpareParts();
    return Array.isArray(saved) ? saved : [];
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    if (typeof window !== 'undefined') {
      const initialized = localStorage.getItem(EMPTY_DATABASE_VERSION);

      if (!initialized) {
        return [];
      }
    }

    const saved = loadNotifications();
    return Array.isArray(saved) ? saved : [];
  });

  const [theme, setThemeState] = useState<ThemeId>(() => loadSavedTheme());

  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('unithai_lang_v1') as Language) || 'TH';
    }

    return 'TH';
  });

  // ============================================================
  // User Authentication & Role State
  // ============================================================

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => loadSavedUser());

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  const [userRole, setUserRole] = useState<UserRole>(() => {
    const saved = loadSavedUser();
    return saved?.role === 'ADMIN' ? 'ADMIN' : 'ENGINEER';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const login = useCallback((user: UserProfile) => {
    setCurrentUser(user);
    saveUser(user);
    setUserRole(user.role === 'ADMIN' ? 'ADMIN' : 'ENGINEER');
    setSelectedJobFilter('ALL');
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    saveUser(null);
    setUserRole('ENGINEER');
    setIsLoginModalOpen(true);
  }, []);

  // ============================================================
  // Compute Accessible Spare Parts for logged-in user
  // ============================================================

  const accessibleSpareParts = useMemo(() => {
    if (!currentUser) return [];

    if (currentUser.role === 'ADMIN') {
      return spareParts;
    }

    const email = currentUser.email.toLowerCase().trim();

    return spareParts.filter((part) => {
      // Check assigned company email
      if (
        part.assignedEmails?.some(
          (e) => e.toLowerCase().trim() === email
        )
      ) {
        return true;
      }

      // Check SRM email
      if (part.srmEmail?.toLowerCase().trim() === email) {
        return true;
      }

      // Check CO-SRM email
      if (part.coSrmEmail?.toLowerCase().trim() === email) {
        return true;
      }

      // Check IN CHARGE email
      if (part.inChargeEmail?.toLowerCase().trim() === email) {
        return true;
      }

      // Check assigned jobs
      if (
        currentUser.assignedJobs?.some(
          (j) =>
            part.job.toLowerCase().includes(j.toLowerCase()) ||
            j.toLowerCase().includes(part.job.toLowerCase())
        )
      ) {
        return true;
      }

      return false;
    });
  }, [spareParts, currentUser]);

  // ============================================================
  // Compute Unique Jobs
  // ============================================================

  const userAssignedJobs = useMemo(() => {
    if (!currentUser) return [];

    if (currentUser.role === 'ADMIN') {
      return Array.from(new Set(spareParts.map((p) => p.job)));
    }

    return Array.from(
      new Set(accessibleSpareParts.map((p) => p.job))
    );
  }, [currentUser, spareParts, accessibleSpareParts]);

  // ============================================================
  // Language
  // ============================================================

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);

    if (typeof window !== 'undefined') {
      localStorage.setItem('unithai_lang_v1', lang);
    }
  }, []);

  const t = useMemo(
    () => TRANSLATIONS[language] || TRANSLATIONS['TH'],
    [language]
  );

  // ============================================================
  // Active UI States
  // ============================================================

  const [activeNotification, setActiveNotification] =
    useState<AppNotification | null>(null);

  const [viewMode, setViewMode] =
    useState<ViewMode>('table');

  const [searchQuery, setSearchQuery] =
    useState<string>('');

  const [selectedJobFilter, setSelectedJobFilter] =
    useState<string>('ALL');

  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<string>('ALL');

  const [selectedTypeFilter, setSelectedTypeFilter] =
    useState<string>('ALL');

  // ============================================================
  // Modals
  // ============================================================

  const [selectedPart, setSelectedPart] =
    useState<SparePart | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] =
    useState<boolean>(false);

  const [isNotificationModalOpen, setIsNotificationModalOpen] =
    useState<boolean>(false);

  const [isQuickStatusModalOpen, setIsQuickStatusModalOpen] =
    useState<boolean>(false);

  const [partToUpdateStatus, setPartToUpdateStatus] =
    useState<SparePart | null>(null);

  const [isPrintModalOpen, setIsPrintModalOpen] =
    useState<boolean>(false);

  // ============================================================
  // Auto-dismiss active push banner
  // ============================================================

  useEffect(() => {
    if (!activeNotification) return;

    const timer = setTimeout(() => {
      setActiveNotification(null);
    }, 8000);

    return () => clearTimeout(timer);
  }, [activeNotification]);

  // ============================================================
  // Persist Spare Parts
  // ============================================================

  useEffect(() => {
    saveSpareParts(spareParts);
  }, [spareParts]);

  // ============================================================
  // Persist Notifications
  // ============================================================

  useEffect(() => {
    saveNotifications(notifications);
  }, [notifications]);

  // ============================================================
  // Theme
  // ============================================================

  const setTheme = useCallback((newTheme: ThemeId) => {
    setThemeState(newTheme);
    saveTheme(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'bright' : 'dark');
  }, [theme, setTheme]);

  const isDark = theme === 'dark';

  const themeConfig = useMemo(() => {
    return THEMES[theme] || THEMES['dark'];
  }, [theme]);

  // ============================================================
  // Notification Count
  // ============================================================

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // ============================================================
  // Push Alert
  // ============================================================

  const triggerPushAlert = useCallback(
    (notification: AppNotification) => {
      setActiveNotification(notification);

      if (soundEnabled) {
        showBrowserNotification(notification);
      }
    },
    [soundEnabled]
  );

  // ============================================================
  // Broadcast Channel
  // ============================================================

  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !('BroadcastChannel' in window)
    ) {
      return;
    }

    const channel = new BroadcastChannel(
      BROADCAST_CHANNEL_NAME
    );

    channel.onmessage = (event) => {
      const data = event.data;

      if (data?.type === 'SYNC_PARTS') {
        setSpareParts(data.payload);
      } else if (data?.type === 'SYNC_NOTIFICATIONS') {
        setNotifications(data.payload);

        if (data.latestPush) {
          triggerPushAlert(data.latestPush);
        }
      }
    };

    return () => {
      channel.close();
    };
  }, [triggerPushAlert]);

  const broadcastChange = (
    type: string,
    payload: unknown,
    latestPush?: AppNotification
  ) => {
    if (
      typeof window !== 'undefined' &&
      'BroadcastChannel' in window
    ) {
      try {
        const channel = new BroadcastChannel(
          BROADCAST_CHANNEL_NAME
        );

        channel.postMessage({
          type,
          payload,
          latestPush,
        });

        channel.close();
      } catch (err) {
        console.warn('Broadcast error:', err);
      }
    }
  };

  // ============================================================
  // Add Spare Part
  // ============================================================

  const addSparePart = useCallback(
    (
      newPartData: Omit<
        SparePart,
        'id' | 'updatedAt' | 'updatedBy'
      >
    ) => {
      const now = new Date();

      const timeStr = now
        .toISOString()
        .slice(0, 16)
        .replace('T', ' ');

      const id = `sp-${Date.now()}`;

      const newPart: SparePart = {
        ...newPartData,
        id,
        updatedAt: timeStr,
        updatedBy:
          userRole === 'ADMIN'
            ? 'Admin UNITHAI'
            : 'Yard User',
      };

      const updatedParts = [
        newPart,
        ...spareParts,
      ];

      setSpareParts(updatedParts);

      // Create Push Notification
      const notif: AppNotification = {
        id: `notif-${Date.now()}`,
        partId: id,
        bookingNo: newPart.bookingNo,
        jobNo: newPart.job,
        title: `📦 เพิ่มบุ๊คกิ้งใหม่: ${newPart.bookingNo}`,
        message: `${newPart.descriptionOfGoods} (${newPart.type}) สำหรับงาน ${newPart.job} ETA: ${newPart.eta}`,
        priority: newPart.isUrgent
          ? 'urgent'
          : 'normal',
        timestamp: timeStr,
        read: false,
        senderName:
          userRole === 'ADMIN'
            ? 'ผู้ดูแลระบบคลังสินค้า (Admin)'
            : 'เจ้าหน้าที่จัดซื้อ',
      };

      const updatedNotifs = [
        notif,
        ...notifications,
      ];

      setNotifications(updatedNotifs);

      triggerPushAlert(notif);

      broadcastChange(
        'SYNC_PARTS',
        updatedParts
      );

      broadcastChange(
        'SYNC_NOTIFICATIONS',
        updatedNotifs,
        notif
      );
    },
    [
      spareParts,
      notifications,
      userRole,
      triggerPushAlert,
    ]
  );

  // ============================================================
  // Update Spare Part
  // ============================================================

  const updateSparePart = useCallback(
    (
      id: string,
      updates: Partial<SparePart>,
      notifyMessage?: string,
      notifyPriority: NotificationPriority = 'normal'
    ) => {
      const now = new Date();

      const timeStr = now
        .toISOString()
        .slice(0, 16)
        .replace('T', ' ');

      let targetPart: SparePart | null = null;

      const updatedParts = spareParts.map((p) => {
        if (p.id === id) {
          targetPart = {
            ...p,
            ...updates,
            updatedAt: timeStr,
            updatedBy:
              userRole === 'ADMIN'
                ? 'Admin UNITHAI'
                : 'Yard User',
          };

          return targetPart;
        }

        return p;
      });

      setSpareParts(updatedParts);

      // Also update selectedPart
      if (
        selectedPart &&
        selectedPart.id === id &&
        targetPart
      ) {
        setSelectedPart(targetPart);
      }

      // Trigger Notification
      if (notifyMessage && targetPart) {
        const p = targetPart as SparePart;

        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          partId: p.id,
          bookingNo: p.bookingNo,
          jobNo: p.job,

          title:
            notifyPriority === 'success'
              ? `✅ อัพเดตสถานะสำเร็จ: ${p.bookingNo}`
              : notifyPriority === 'urgent'
              ? `🚨 แจ้งเตือนด่วน: ${p.bookingNo}`
              : `🔔 มีการอัพเดตสถานะ: ${p.bookingNo}`,

          message: notifyMessage,
          priority: notifyPriority,
          timestamp: timeStr,
          read: false,

          senderName:
            userRole === 'ADMIN'
              ? 'ผู้ดูแลระบบคลังสินค้า (Admin)'
              : 'เจ้าหน้าที่จัดซื้อ',
        };

        const updatedNotifs = [
          notif,
          ...notifications,
        ];

        setNotifications(updatedNotifs);

        triggerPushAlert(notif);

        broadcastChange(
          'SYNC_NOTIFICATIONS',
          updatedNotifs,
          notif
        );

        // Auto Notify SRM on LINE
        try {
          const lineCfg = loadLineConfig();

          if (
            lineCfg.isActive &&
            (
              lineCfg.autoNotifyOnStatusChange ||
              (
                p.isUrgent &&
                lineCfg.autoNotifyOnUrgent
              )
            )
          ) {
            const allUsersList =
              loadRegisteredUsers();

            sendLineBroadcastOrPush({
              targetType: 'JOB_SPECIFIC',
              title: notif.title,
              message: notif.message,
              targetJob: p.job,
              bookingNo: p.bookingNo,
              isUrgent: p.isUrgent,

              senderName:
                userRole === 'ADMIN'
                  ? 'ผู้ดูแลระบบคลังสินค้า (Admin)'
                  : 'เจ้าหน้าที่จัดซื้อ',

              allUsers: allUsersList,
            });
          }
        } catch (err) {
          console.warn(
            'Auto LINE notification error:',
            err
          );
        }
      }

      broadcastChange(
        'SYNC_PARTS',
        updatedParts
      );
    },
    [
      spareParts,
      notifications,
      selectedPart,
      userRole,
      triggerPushAlert,
    ]
  );

  // ============================================================
  // Delete Spare Part
  // ============================================================

  const deleteSparePart = useCallback(
    (id: string) => {
      const part = spareParts.find(
        (p) => p.id === id
      );

      const updatedParts = spareParts.filter(
        (p) => p.id !== id
      );

      setSpareParts(updatedParts);

      if (selectedPart?.id === id) {
        setSelectedPart(null);
      }

      if (part) {
        const now = new Date();

        const timeStr = now
          .toISOString()
          .slice(0, 16)
          .replace('T', ' ');

        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          title: `🗑️ ลบบุ๊คกิ้ง: ${part.bookingNo}`,
          message: `รายการ ${part.descriptionOfGoods} ถูกลบออกจากระบบ`,
          priority: 'normal',
          timestamp: timeStr,
          read: false,
          senderName: 'ผู้ดูแลระบบ',
        };

        const updatedNotifs = [
          notif,
          ...notifications,
        ];

        setNotifications(updatedNotifs);

        broadcastChange(
          'SYNC_NOTIFICATIONS',
          updatedNotifs
        );
      }

      broadcastChange(
        'SYNC_PARTS',
        updatedParts
      );
    },
    [
      spareParts,
      notifications,
      selectedPart,
    ]
  );

  // ============================================================
  // USER ACTION 1:
  // Confirm Spare Part Received
  // ============================================================

  const userConfirmReceived = useCallback(
    (
      partId: string,
      deliveryDate: string,
      yardLocation?: string,
      receiverNote?: string
    ) => {
      const part = spareParts.find(
        (p) => p.id === partId
      );

      if (!part) return;

      const actualDate =
        deliveryDate ||
        new Date()
          .toISOString()
          .slice(0, 10);

      const updates: Partial<SparePart> = {
        status: 'DELIVERED',
        deliveryDate: actualDate,

        yardLocation:
          yardLocation ||
          part.yardLocation ||
          'UNITHAI Yard Warehouse 2',

        priorityNotes: receiverNote
          ? `${
              part.priorityNotes
                ? part.priorityNotes + ' | '
                : ''
            }ช่างรับของแล้ว: ${receiverNote}`
          : part.priorityNotes,

        updatedAt: new Date()
          .toISOString()
          .slice(0, 16)
          .replace('T', ' '),

        updatedBy:
          'ทีมช่างหน้างาน (Yard Crew)',
      };

      const pushMsg =
        language === 'TH'
          ? `✅ ทีมหน้างานบันทึกรับมอบอะไหล่ ${part.bookingNo} (${part.descriptionOfGoods}) เข้าสู่อู่เรือเรียบร้อยแล้ว`
          : `✅ Yard crew confirmed receipt of ${part.bookingNo} (${part.descriptionOfGoods}) at ${
              yardLocation || 'Yard Site'
            }`;

      updateSparePart(
        partId,
        updates,
        pushMsg,
        'success'
      );
    },
    [
      spareParts,
      language,
      updateSparePart,
    ]
  );

  // ============================================================
  // USER ACTION 2:
  // Request / Toggle Urgent Priority
  // ============================================================

  const userRequestUrgent = useCallback(
    (
      partId: string,
      isUrgent: boolean,
      reason?: string
    ) => {
      const part = spareParts.find(
        (p) => p.id === partId
      );

      if (!part) return;

      const updates: Partial<SparePart> = {
        isUrgent,

        priorityNotes: reason
          ? `[ช่างขอเร่งด่วน]: ${reason}`
          : part.priorityNotes,

        updatedAt: new Date()
          .toISOString()
          .slice(0, 16)
          .replace('T', ' '),

        updatedBy:
          'ทีมช่างหน้างาน (Yard Crew)',
      };

      const pushMsg = isUrgent
        ? language === 'TH'
          ? `🚨 ทีมหน้างานขอปรับสถานะด่วนสำหรับ ${part.bookingNo} (เรือ ${part.job})! ${
              reason
                ? 'เหตุผล: ' + reason
                : ''
            }`
          : `🚨 URGENT REQUEST: Yard crew requested expedited delivery for ${part.bookingNo} (${part.job})! ${
              reason
                ? 'Reason: ' + reason
                : ''
            }`
        : language === 'TH'
        ? `ℹ️ ยกเลิกสถานะด่วนสำหรับ ${part.bookingNo}`
        : `ℹ️ Urgent priority cleared for ${part.bookingNo}`;

      updateSparePart(
        partId,
        updates,
        pushMsg,
        isUrgent
          ? 'critical'
          : 'normal'
      );
    },
    [
      spareParts,
      language,
      updateSparePart,
    ]
  );

  // ============================================================
  // Send Custom Push Broadcast
  // ============================================================

  const sendCustomPushNotification =
    useCallback(
      (
        title: string,
        message: string,
        priority: NotificationPriority,
        partId?: string,
        bookingNo?: string,
        jobNo?: string
      ) => {
        const now = new Date();

        const timeStr = now
          .toISOString()
          .slice(0, 16)
          .replace('T', ' ');

        const notif: AppNotification = {
          id: `notif-${Date.now()}`,
          partId,
          bookingNo,
          jobNo,
          title,
          message,
          priority,
          timestamp: timeStr,
          read: false,

          senderName:
            userRole === 'ADMIN'
              ? 'ผู้ดูแลระบบอู่เรือ (UNITHAI Admin)'
              : 'วิศวกรประจำโครงการ',
        };

        const updatedNotifs = [
          notif,
          ...notifications,
        ];

        setNotifications(updatedNotifs);

        triggerPushAlert(notif);

        broadcastChange(
          'SYNC_NOTIFICATIONS',
          updatedNotifs,
          notif
        );
      },
      [
        notifications,
        userRole,
        triggerPushAlert,
      ]
    );

  // ============================================================
  // Notification Actions
  // ============================================================

  const markNotificationRead =
    useCallback((id: string) => {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? { ...n, read: true }
            : n
        )
      );
    }, []);

  const markAllNotificationsRead =
    useCallback(() => {
      setNotifications((prev) =>
        prev.map((n) => ({
          ...n,
          read: true,
        }))
      );
    }, []);

  const clearNotificationHistory =
    useCallback(() => {
      setNotifications([]);

      saveNotifications([]);

      broadcastChange(
        'SYNC_NOTIFICATIONS',
        []
      );
    }, []);

  const dismissPushBanner =
    useCallback(() => {
      setActiveNotification(null);
    }, []);

  // ============================================================
  // Reset to Initial Data
  // ============================================================

  const resetToInitialData =
    useCallback(() => {
      setSpareParts(INITIAL_SPARE_PARTS);

      setNotifications(
        INITIAL_NOTIFICATIONS
      );

      saveSpareParts(
        INITIAL_SPARE_PARTS
      );

      saveNotifications(
        INITIAL_NOTIFICATIONS
      );

      broadcastChange(
        'SYNC_PARTS',
        INITIAL_SPARE_PARTS
      );

      broadcastChange(
        'SYNC_NOTIFICATIONS',
        INITIAL_NOTIFICATIONS
      );
    }, []);

  // ============================================================
  // Context Value
  // ============================================================

  const value = {
    spareParts,
    accessibleSpareParts,
    userAssignedJobs,

    currentUser,
    login,
    logout,

    isLoginModalOpen,
    setIsLoginModalOpen,

    notifications,
    activeNotification,
    unreadCount,

    userRole,
    setUserRole,

    theme,
    setTheme,
    toggleTheme,
    isDark,
    themeConfig,

    language,
    setLanguage,
    t,

    isOnline,

    soundEnabled,
    setSoundEnabled,

    viewMode,
    setViewMode,

    searchQuery,
    setSearchQuery,

    selectedJobFilter,
    setSelectedJobFilter,

    selectedStatusFilter,
    setSelectedStatusFilter,

    selectedTypeFilter,
    setSelectedTypeFilter,

    selectedPart,
    setSelectedPart,

    isAddModalOpen,
    setIsAddModalOpen,

    isNotificationModalOpen,
    setIsNotificationModalOpen,

    isQuickStatusModalOpen,
    setIsQuickStatusModalOpen,

    partToUpdateStatus,
    setPartToUpdateStatus,

    isPrintModalOpen,
    setIsPrintModalOpen,

    addSparePart,
    updateSparePart,
    deleteSparePart,

    userConfirmReceived,
    userRequestUrgent,

    sendCustomPushNotification,

    markNotificationRead,
    markAllNotificationsRead,
    clearNotificationHistory,

    dismissPushBanner,

    resetToInitialData,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
};
