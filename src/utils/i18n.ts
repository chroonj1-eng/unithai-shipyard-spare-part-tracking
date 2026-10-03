export type Language = 'TH' | 'EN';

export const TRANSLATIONS = {
  TH: {
    // Header & Brand
    appTitle: 'UNITHAI SHIPYARD',
    appSubtitle: 'ระบบติดตามและแจ้งเตือนอะไหล่เรือ',
    badgeText: 'Spare Parts Alert',
    online: 'ออนไลน์',
    offline: 'โหมดออฟไลน์',
    installApp: 'ติดตั้งแอพ',
    installIos: 'ติดตั้งบน iOS',
    adminMode: 'ผู้ดูแลระบบ (Admin)',
    yardStaff: 'ทีมหน้างาน (User)',
    quickBroadcast: 'ยิงแจ้งเตือนพุช',
    addBooking: 'เพิ่มบุ๊คกิ้ง',
    exportCsv: 'ส่งออก CSV',
    resetData: 'รีเซ็ตข้อมูล',
    themePicker: 'เลือกชุดสีการแสดงผล',

    // View Modes
    viewTable: 'ตาราง 19 คอลัมน์',
    viewCards: 'การ์ดสรุปรายการ (Cards)',
    viewDashboard: 'DASHBOARD',
    viewTimeline: 'ไทม์ไลน์ (Timeline)',

    // Stats
    statTotal: 'รายการทั้งหมด',
    statInTransit: 'กำลังขนส่ง / ท่าเรือ',
    statDoReceived: 'รับ D/O & เปิดตู้',
    statDelivered: 'ส่งมอบเข้าอู่เรือแล้ว',
    statUrgent: 'ด่วนฉุกเฉิน / วิกฤต',

    // Filters
    searchPlaceholder: 'ค้นหาด่วนตาม Booking No, P/O, AWB, Vessel, SRM, ชื่องานเรือ, รายละเอียดอะไหล่...',
    filterShipProject: 'โครงการเรือ:',
    filterTransport: 'ขนส่ง:',
    filterAllJobs: 'ทั้งหมด (All Jobs)',
    filterAllTypes: 'ทุกประเภท (All Types)',
    clearFilters: 'ล้างตัวกรอง',

    // Statuses
    statusAll: 'ทั้งหมด (All)',
    statusBookingConfirmed: 'จองขนส่งแล้ว',
    statusInTransit: 'กำลังเดินทาง',
    statusCustomsPort: 'ถึงท่าเรือ/รอตรวจปล่อย',
    statusDoReceived: 'รับ D/O & เปิดตู้',
    statusDelivered: 'ส่งมอบเข้าอู่เรือ',
    statusUrgent: '⚠️ ด่วนฉุกเฉิน',

    // Actions & Buttons
    updateStatus: 'เปลี่ยนสถานะ',
    printSlip: 'พิมพ์ใบรับของ',
    viewDetails: 'ดูรายละเอียด',
    edit: 'แก้ไข',
    delete: 'ลบ',
    cancel: 'ยกเลิก',
    save: 'บันทึก',
    saveAndNotify: 'บันทึก & ส่งพุชแจ้งเตือน',
    close: 'ปิด',
    markAllRead: 'อ่านทั้งหมดแล้ว',
    clearHistory: 'ล้างประวัติ',

    // Push & Notifications
    notifHistoryTitle: 'ประวัติการแจ้งเตือนทั้งหมด',
    notifHistorySubtitle: 'ประวัติการแจ้งเตือนแบบพุช สถานะการขนส่ง และอะไหล่เรือ',
    testPush: 'ทดสอบพุช',
    pushPermissionPrompt: 'ต้องการรับการแจ้งเตือนพุชบนหน้าจอล็อคและแถบแจ้งเตือนของสมาร์ทโฟนหรือไม่?',
    enableNotifications: 'เปิดรับการแจ้งเตือน',
    instantPushCheck: 'ส่งการแจ้งเตือนแบบพุชบนหน้าจอสมาร์ทโฟนของผู้ใช้งานทันที',
    instantPushDesc: 'แจ้งเตือนทีมช่างและวิศวกรพร้อมเสียงเตือนและบันทึกลงในประวัติการแจ้งเตือน',

    // Offline toast
    offlineTitle: 'โหมดออฟไลน์ (Offline Mode)',
    offlineDesc: 'กำลังทำงานด้วยฐานข้อมูลในเครื่อง (IndexedDB/Cache) ค้นหาและดูประวัติได้ตามปกติ',
  },
  EN: {
    // Header & Brand
    appTitle: 'UNITHAI SHIPYARD',
    appSubtitle: 'Spare Part Tracking & Instant Push Alerts',
    badgeText: 'Spare Parts Alert',
    online: 'Online',
    offline: 'Offline Mode',
    installApp: 'Install App',
    installIos: 'Install on iOS',
    adminMode: 'Admin Mode',
    yardStaff: 'Yard Staff',
    quickBroadcast: 'Broadcast Push',
    addBooking: 'New Booking',
    exportCsv: 'Export CSV',
    resetData: 'Reset Demo',
    themePicker: 'Display Theme',

    // View Modes
    viewTable: '19-Column Table',
    viewCards: 'Summary Cards (Mobile)',
    viewDashboard: 'DASHBOARD',
    viewTimeline: 'ETA Timeline',

    // Stats
    statTotal: 'Total Shipments',
    statInTransit: 'In Transit / Port',
    statDoReceived: 'D/O & Opened',
    statDelivered: 'Delivered to Yard',
    statUrgent: 'Urgent / Critical AOG',

    // Filters
    searchPlaceholder: 'Quick search by Booking No, P/O, AWB, Vessel, SRM, Job No, Description, Supplier...',
    filterShipProject: 'Vessel / Job:',
    filterTransport: 'Transport:',
    filterAllJobs: 'All Jobs',
    filterAllTypes: 'All Transport Types',
    clearFilters: 'Clear Filters',

    // Statuses
    statusAll: 'All Statuses',
    statusBookingConfirmed: 'Booking Confirmed',
    statusInTransit: 'In Transit',
    statusCustomsPort: 'Port & Customs',
    statusDoReceived: 'D/O & Opened',
    statusDelivered: 'Delivered to Yard',
    statusUrgent: '⚠️ Urgent / Hold',

    // Actions & Buttons
    updateStatus: 'Update Status',
    printSlip: 'Print Slip',
    viewDetails: 'View Details',
    edit: 'Edit',
    delete: 'Delete',
    cancel: 'Cancel',
    save: 'Save Changes',
    saveAndNotify: 'Save & Broadcast Push',
    close: 'Close',
    markAllRead: 'Mark all as read',
    clearHistory: 'Clear History',

    // Push & Notifications
    notifHistoryTitle: 'All Notification History',
    notifHistorySubtitle: 'Log of push alerts, logistics milestones, and vessel spare parts',
    testPush: 'Test Push',
    pushPermissionPrompt: 'Enable instant push notifications on your lock screen and notification bar?',
    enableNotifications: 'Enable Push',
    instantPushCheck: 'Send instant push notification to smartphone screens',
    instantPushDesc: 'Alerts engineers and logistics staff with alert sound and logs into history',

    // Offline toast
    offlineTitle: 'Offline Mode Active',
    offlineDesc: 'Operating from cached offline storage. Search, inspect, and history fully accessible.',
  },
};
