export type TransportType = 
  | 'Air Freight'
  | 'Sea Freight FCL'
  | 'Sea Freight LCL'
  | 'Courier / Express'
  | 'Land Freight';

export type Incoterm = 'FOB' | 'CIF' | 'EXW' | 'DDP' | 'DAP' | 'CFR' | 'FCA';

export type PartStatus = 
  | 'BOOKING_CONFIRMED'
  | 'IN_TRANSIT'
  | 'CUSTOMS_PORT'
  | 'DO_RECEIVED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'URGENT_HOLD';

export interface SparePart {
  id: string;
  bookingDate: string; // Booking DATE
  bookingNo: string;   // BOOKING NO.
  po: string;          // P/O
  awbBl: string;       // AWB/BL
  flightVessel: string;// FLIGHT / VESSEL
  srm: string;         // SRM Name
  coSrm?: string;      // CO-SRM Name (ผู้ช่วย SRM)
  inCharge?: string;   // IN CHARGE Name (วิศวกรผู้ควบคุมงาน)
  srmEmail?: string;   // SRM Company Email
  coSrmEmail?: string; // CO-SRM Company Email
  inChargeEmail?: string; // IN CHARGE Company Email
  assignedEmails?: string[]; // All company emails allowed to view this Job
  job: string;         // JOB (e.g. UT-2026-089 MV Andaman Star)
  descriptionOfGoods: string; // DESCRIPTION OF GOODS
  shipperSupplier: string;    // SHIPPER/SUPPLIER
  from: string;        // FROM
  to: string;          // TO
  package: string;     // PACKAGE
  weight: number;      // WEIGHT (kg)
  etd: string;         // ETD (YYYY-MM-DD)
  eta: string;         // ETA (YYYY-MM-DD)
  receiveDoAndOpenContainerDate: string; // RECIEVE D/O AND OPEN CONTAINER DATE
  deliveryDate: string;// DELIVERY DATE
  term: Incoterm;      // TERM
  type: TransportType; // TYPE
  
  // Operational metadata
  status: PartStatus;
  isUrgent?: boolean;
  priorityNotes?: string;
  vesselName?: string;
  yardLocation?: string; // e.g. Warehouse 3, Drydock #1, Quay 4
  updatedAt: string;
  updatedBy: string;
}

export type NotificationPriority = 'normal' | 'urgent' | 'critical' | 'success';

export interface AppNotification {
  id: string;
  partId?: string;
  bookingNo?: string;
  jobNo?: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  timestamp: string;
  read: boolean;
  senderName: string;
  actionUrl?: string;
}

export type UserRole = 'ADMIN' | 'ENGINEER' | 'LOGISTICS_VIEWER';

export type AuthRole = 'ADMIN' | 'USER';

export type JobPosition = 'ADMIN' | 'SRM' | 'CO_SRM' | 'IN_CHARGE' | 'STAFF';

export interface UserProfile {
  email: string;
  name: string;
  role: AuthRole; // 'ADMIN' or 'USER'
  position: JobPosition; // 'ADMIN' | 'SRM' | 'CO_SRM' | 'IN_CHARGE' | 'STAFF'
  department: string;
  assignedJobs?: string[]; // Job names this user is assigned to
  password?: string;
  phone?: string;
  lineUserId?: string; // LINE User ID (e.g. U1234567890abcdef...)
  lineDisplayName?: string; // LINE account name
  registeredAt?: string;
}

export interface LineOAConfig {
  channelId: string;
  channelSecret: string;
  channelAccessToken: string;
  lineOaId: string; // e.g. @unithai_shipyard
  lineOaName: string; // e.g. UNITHAI Shipyard Logistics
  addFriendUrl: string;
  isActive: boolean;
  autoNotifyOnStatusChange: boolean;
  autoNotifyOnUrgent: boolean;
  lastTestedAt?: string;
}

export interface LineBroadcastLog {
  id: string;
  title: string;
  message: string;
  targetType: 'ALL_FRIENDS' | 'ALL_SRMS' | 'JOB_SPECIFIC' | 'DIRECT_USER';
  targetJob?: string;
  targetUserName?: string;
  recipientCount: number;
  sentAt: string;
  sentBy: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  isUrgent?: boolean;
  bookingNo?: string;
}

export type ThemeId = 'dark' | 'bright';

export type Language = 'TH' | 'EN';

export interface ThemeConfig {
  id: ThemeId;
  nameTh: string;
  nameEn: string;
  isDark: boolean;
  primary: string;
  primaryHover: string;
  accent: string;
  bgDark: string;
  appBg: string;
  surfaceCard: string;
  surfaceSubtle: string;
  surfaceHover: string;
  borderCard: string;
  borderSubtle: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  headerBg: string;
  headerBorder: string;
  ribbonBg: string;
  modalBg: string;
  badgeBg: string;
  badgeText: string;
}

export type ViewMode = 'table' | 'cards' | 'kanban' | 'timeline';
