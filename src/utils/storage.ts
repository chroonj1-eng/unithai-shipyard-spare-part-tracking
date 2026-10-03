import { SparePart, AppNotification, ThemeId, UserProfile } from '../types/sparePart';
import { INITIAL_SPARE_PARTS, INITIAL_NOTIFICATIONS, DEFAULT_USERS } from '../data/initialData';

const STORAGE_KEYS = {
  SPARE_PARTS: 'unithai_spare_parts_v2',
  NOTIFICATIONS: 'unithai_notifications_v1',
  THEME: 'unithai_theme_v1',
  USER: 'unithai_auth_user_v2',
  REGISTERED_USERS: 'unithai_registered_users_v3',
  SOUND_ENABLED: 'unithai_sound_enabled_v1',
};

export function loadSpareParts(): SparePart[] {
  if (typeof window === 'undefined') return INITIAL_SPARE_PARTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SPARE_PARTS);
    if (!raw) {
      saveSpareParts(INITIAL_SPARE_PARTS);
      return INITIAL_SPARE_PARTS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SPARE_PARTS;
  } catch (err) {
    console.error('Failed to load spare parts from storage:', err);
    return INITIAL_SPARE_PARTS;
  }
}

export function saveSpareParts(parts: SparePart[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SPARE_PARTS, JSON.stringify(parts));
  } catch (err) {
    console.error('Failed to save spare parts to storage:', err);
  }
}

export function loadNotifications(): AppNotification[] {
  if (typeof window === 'undefined') return INITIAL_NOTIFICATIONS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (!raw) {
      saveNotifications(INITIAL_NOTIFICATIONS);
      return INITIAL_NOTIFICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_NOTIFICATIONS;
  } catch (err) {
    console.error('Failed to load notifications from storage:', err);
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveNotifications(notifications: AppNotification[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (err) {
    console.error('Failed to save notifications to storage:', err);
  }
}

export function loadSavedTheme(): ThemeId {
  if (typeof window === 'undefined') return 'dark';
  const saved = localStorage.getItem(STORAGE_KEYS.THEME);
  if (saved === 'bright') return 'bright';
  return 'dark';
}

export function saveTheme(theme: ThemeId): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

export function loadRegisteredUsers(): UserProfile[] {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    if (!raw) {
      saveRegisteredUsers(DEFAULT_USERS);
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    saveRegisteredUsers(DEFAULT_USERS);
    return DEFAULT_USERS;
  } catch (err) {
    console.error('Failed to load registered users:', err);
    return DEFAULT_USERS;
  }
}

export function saveRegisteredUsers(users: UserProfile[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save registered users:', err);
  }
}

export function registerNewUser(newUser: UserProfile): { success: boolean; error?: string } {
  // Validate email domain strictly ends with @unithai.com
  const email = newUser.email.trim().toLowerCase();
  if (!email.endsWith('@unithai.com')) {
    return {
      success: false,
      error: 'ต้องลงทะเบียนโดยใช้อีเมลบริษัทที่ลงท้ายด้วย @unithai.com เท่านั้น (เช่น yourname@unithai.com)',
    };
  }

  const existingUsers = loadRegisteredUsers();
  if (existingUsers.some(u => u.email.toLowerCase() === email)) {
    return {
      success: false,
      error: `อีเมล ${email} นี้ได้ลงทะเบียนในระบบเรียบร้อยแล้ว กรุณาไปที่แท็บ "เข้าสู่ระบบ (Sign In)"`,
    };
  }

  const updated = [newUser, ...existingUsers];
  saveRegisteredUsers(updated);
  saveUser(newUser);
  return { success: true };
}

export function loadSavedUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null; // Show Sign In / Sign Up landing page first!
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load user:', err);
    return null;
  }
}

export function saveUser(user: UserProfile | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } else {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    }
  } catch (err) {
    console.error('Failed to save user:', err);
  }
}

// Export parts to CSV
export function exportPartsToCSV(parts: SparePart[]): void {
  const headers = [
    'Booking DATE',
    'BOOKING NO.',
    'P/O',
    'AWB/BL',
    'FLIGHT / VESSEL',
    'SRM',
    'JOB',
    'DESCRIPTION OF GOODS',
    'SHIPPER/SUPPLIER',
    'FROM',
    'TO',
    'PACKAGE',
    'WEIGHT (kg)',
    'ETD',
    'ETA',
    'RECIEVE D/O AND OPEN CONTAINER DATE',
    'DELIVERY DATE',
    'TERM',
    'TYPE',
    'STATUS',
  ];

  const escapeCSV = (val: string | number | undefined) => {
    if (val === undefined || val === null) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = parts.map(p => [
    escapeCSV(p.bookingDate),
    escapeCSV(p.bookingNo),
    escapeCSV(p.po),
    escapeCSV(p.awbBl),
    escapeCSV(p.flightVessel),
    escapeCSV(p.srm),
    escapeCSV(p.job),
    escapeCSV(p.descriptionOfGoods),
    escapeCSV(p.shipperSupplier),
    escapeCSV(p.from),
    escapeCSV(p.to),
    escapeCSV(p.package),
    escapeCSV(p.weight),
    escapeCSV(p.etd),
    escapeCSV(p.eta),
    escapeCSV(p.receiveDoAndOpenContainerDate),
    escapeCSV(p.deliveryDate),
    escapeCSV(p.term),
    escapeCSV(p.type),
    escapeCSV(p.status),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `UNITHAI_SpareParts_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
