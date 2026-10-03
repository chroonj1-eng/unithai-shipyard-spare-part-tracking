import { PartStatus, TransportType } from '../types/sparePart';

export interface StatusMeta {
  labelTh: string;
  labelEn: string;
  badgeClass: string;
  bgLight: string;
  textClass: string;
  borderClass: string;
  iconName: string;
  stepIndex: number;
}

export const STATUS_MAP: Record<PartStatus, StatusMeta> = {
  BOOKING_CONFIRMED: {
    labelTh: 'จองขนส่งแล้ว',
    labelEn: 'Booking Confirmed',
    badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    bgLight: 'bg-blue-500',
    textClass: 'text-blue-400',
    borderClass: 'border-blue-500',
    iconName: 'CalendarCheck',
    stepIndex: 1,
  },
  IN_TRANSIT: {
    labelTh: 'กำลังขนส่ง (In Transit)',
    labelEn: 'In Transit',
    badgeClass: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
    bgLight: 'bg-indigo-500',
    textClass: 'text-indigo-400',
    borderClass: 'border-indigo-500',
    iconName: 'PlaneTakeoff',
    stepIndex: 2,
  },
  CUSTOMS_PORT: {
    labelTh: 'ถึงท่าเรือ/สนามบิน (ตรวจปล่อย)',
    labelEn: 'Port & Customs',
    badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    bgLight: 'bg-amber-500',
    textClass: 'text-amber-400',
    borderClass: 'border-amber-500',
    iconName: 'Anchor',
    stepIndex: 3,
  },
  DO_RECEIVED: {
    labelTh: 'รับ D/O & เปิดตู้คอนเทนเนอร์แล้ว',
    labelEn: 'D/O & Open Container',
    badgeClass: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    bgLight: 'bg-cyan-500',
    textClass: 'text-cyan-300',
    borderClass: 'border-cyan-500',
    iconName: 'PackageCheck',
    stepIndex: 4,
  },
  OUT_FOR_DELIVERY: {
    labelTh: 'กำลังจัดส่งเข้าอู่เรือ',
    labelEn: 'Out for Delivery to Yard',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
    bgLight: 'bg-purple-500',
    textClass: 'text-purple-300',
    borderClass: 'border-purple-500',
    iconName: 'Truck',
    stepIndex: 5,
  },
  DELIVERED: {
    labelTh: 'ส่งมอบเข้าอู่เรือเรียบร้อย',
    labelEn: 'Delivered to Yard / Vessel',
    badgeClass: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    bgLight: 'bg-emerald-500',
    textClass: 'text-emerald-400',
    borderClass: 'border-emerald-500',
    iconName: 'CheckCircle2',
    stepIndex: 6,
  },
  URGENT_HOLD: {
    labelTh: 'เร่งด่วน / ติดปัญหา (Hold)',
    labelEn: 'Urgent / Hold',
    badgeClass: 'bg-rose-500/20 text-rose-400 border-rose-500/30 animate-pulse',
    bgLight: 'bg-rose-500',
    textClass: 'text-rose-400',
    borderClass: 'border-rose-500',
    iconName: 'AlertTriangle',
    stepIndex: 0,
  },
};

export const TRANSPORT_TYPE_ICONS: Record<TransportType, string> = {
  'Air Freight': 'Plane',
  'Sea Freight FCL': 'Ship',
  'Sea Freight LCL': 'Boxes',
  'Courier / Express': 'Zap',
  'Land Freight': 'Truck',
};
