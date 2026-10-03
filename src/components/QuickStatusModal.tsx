import React, { useState } from 'react';
import {
  X,
  CheckCircle,
  Truck,
  PackageCheck,
  AlertTriangle,
  PlaneTakeoff,
  Anchor,
  BellRing,
  ShieldCheck,
  HardHat,
  MapPin,
  Calendar,
  AlertOctagon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SparePart, PartStatus, NotificationPriority } from '../types/sparePart';
import { STATUS_MAP } from '../utils/statusHelper';

interface Props {
  part: SparePart;
  onClose: () => void;
}

export const QuickStatusModal: React.FC<Props> = ({ part, onClose }) => {
  const {
    updateSparePart,
    userConfirmReceived,
    userRequestUrgent,
    userRole,
    language,
    t,
  } = useApp();

  const isUserOnly = userRole !== 'ADMIN';

  // State for USER mode tabs: 'RECEIVE' or 'URGENT'
  const [userTab, setUserTab] = useState<'RECEIVE' | 'URGENT'>('RECEIVE');

  // USER Option 1: Confirm Receipt
  const [userDeliveryDate, setUserDeliveryDate] = useState(
    part.deliveryDate || new Date().toISOString().slice(0, 10)
  );
  const [userYardLocation, setUserYardLocation] = useState(
    part.yardLocation || 'UNITHAI Yard - Warehouse 2'
  );
  const [userReceiverNote, setUserReceiverNote] = useState('');

  // USER Option 2: Request Urgent
  const [userIsUrgent, setUserIsUrgent] = useState(!part.isUrgent);
  const [userUrgentReason, setUserUrgentReason] = useState(
    part.priorityNotes || ''
  );

  // ADMIN Mode States
  const [selectedStatus, setSelectedStatus] = useState<PartStatus>(part.status);
  const [doDate, setDoDate] = useState(
    part.receiveDoAndOpenContainerDate || new Date().toISOString().slice(0, 10)
  );
  const [delivDate, setDelivDate] = useState(
    part.deliveryDate || new Date().toISOString().slice(0, 10)
  );
  const [customPushMessage, setCustomPushMessage] = useState(
    language === 'TH'
      ? `อัพเดตสถานะ ${part.bookingNo} สำหรับเรือ/งาน ${part.job}`
      : `Status updated for ${part.bookingNo} (${part.job})`
  );
  const [sendPush, setSendPush] = useState(true);

  // Admin status selection handler
  const handleAdminStatusChange = (newStatus: PartStatus) => {
    setSelectedStatus(newStatus);
    const meta = STATUS_MAP[newStatus];
    if (newStatus === 'DO_RECEIVED') {
      setCustomPushMessage(
        language === 'TH'
          ? `📦 ตู้คอนเทนเนอร์เปิดแล้ว & ได้รับเอกสาร D/O สำหรับ ${part.descriptionOfGoods} (${part.job})`
          : `📦 D/O Received & Container opened for ${part.descriptionOfGoods} (${part.job})`
      );
    } else if (newStatus === 'DELIVERED') {
      setCustomPushMessage(
        language === 'TH'
          ? `✅ จัดส่งอะไหล่ ${part.descriptionOfGoods} เข้าสู่อู่เรือ UNITHAI (${part.yardLocation || 'หน้างาน'}) เรียบร้อยแล้ว ช่างสามารถเบิกได้ทันที`
          : `✅ Spare part ${part.descriptionOfGoods} delivered to UNITHAI Yard (${part.yardLocation || 'Site'}) ready for assembly.`
      );
    } else if (newStatus === 'CUSTOMS_PORT') {
      setCustomPushMessage(
        language === 'TH'
          ? `⚓ สินค้าถึงท่าเรือ/สนามบินแล้ว กำลังดำเนินพิธีการศุลกากรตรวจปล่อยสำหรับ ${part.bookingNo}`
          : `⚓ Cargo arrived at Port/Airport. Customs clearance in progress for ${part.bookingNo}`
      );
    } else if (newStatus === 'OUT_FOR_DELIVERY') {
      setCustomPushMessage(
        language === 'TH'
          ? `🚚 รถขนส่งกำลังนำอะไหล่ ${part.bookingNo} เข้าสู่อู่เรือแหลมฉบัง`
          : `🚚 Truck is en route delivering spare part ${part.bookingNo} to Laem Chabang Yard.`
      );
    } else {
      setCustomPushMessage(
        language === 'TH'
          ? `สถานะของ ${part.bookingNo} ถูกเปลี่ยนเป็น: ${meta.labelTh} (${meta.labelEn})`
          : `Status of ${part.bookingNo} changed to: ${meta.labelEn}`
      );
    }
  };

  // Handler for USER submitting receipt
  const handleUserConfirmReceipt = (e: React.FormEvent) => {
    e.preventDefault();
    userConfirmReceived(
      part.id,
      userDeliveryDate,
      userYardLocation,
      userReceiverNote
    );
    onClose();
  };

  // Handler for USER requesting urgent
  const handleUserRequestUrgent = (e: React.FormEvent) => {
    e.preventDefault();
    userRequestUrgent(part.id, userIsUrgent, userUrgentReason);
    onClose();
  };

  // Handler for ADMIN submitting
  const handleAdminSave = (e: React.FormEvent) => {
    e.preventDefault();

    const updates: Partial<SparePart> = {
      status: selectedStatus,
    };

    if (selectedStatus === 'DO_RECEIVED') {
      updates.receiveDoAndOpenContainerDate = doDate;
    }
    if (selectedStatus === 'DELIVERED') {
      updates.deliveryDate = delivDate;
    }

    let priority: NotificationPriority = 'normal';
    if (selectedStatus === 'DELIVERED') priority = 'success';
    else if (selectedStatus === 'URGENT_HOLD' || part.isUrgent) priority = 'urgent';

    updateSparePart(
      part.id,
      updates,
      sendPush ? customPushMessage : undefined,
      priority
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0a1c36] border border-blue-900/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        
        {/* Tricolor Ribbon on top */}
        <div className="h-1 w-full flex">
          <div className="h-full flex-1 bg-red-600" />
          <div className="h-full flex-1 bg-white" />
          <div className="h-full flex-1 bg-blue-700" />
        </div>

        {/* Header */}
        <div className="p-4 border-b border-blue-950 flex items-center justify-between bg-[#07172c]">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                isUserOnly
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                  : 'bg-red-600/20 text-red-400 border border-red-500/40'
              }`}
            >
              {isUserOnly ? <HardHat className="w-5 h-5" /> : <ShieldCheck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>
                  {isUserOnly
                    ? (language === 'TH' ? 'อัพเดตโดยทีมหน้างาน (User Action)' : 'Yard Crew Action')
                    : (language === 'TH' ? 'อัพเดตสถานะโดยแอดมิน (Admin Status)' : 'Admin Status Update')}
                </span>
              </h3>
              <p className="text-xs text-slate-300 font-mono">
                {part.bookingNo} • {part.job}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Part Brief Card */}
        <div className="p-4 bg-[#081b33] border-b border-blue-950 text-xs">
          <div className="text-slate-400 mb-0.5">{language === 'TH' ? 'อะไหล่เรือ:' : 'Spare Part:'}</div>
          <div className="font-bold text-white text-sm">{part.descriptionOfGoods}</div>
          <div className="text-[11px] text-slate-300 mt-1.5 flex items-center gap-3 flex-wrap">
            <span>{language === 'TH' ? 'ประเภท' : 'Type'}: {part.type}</span>
            <span>•</span>
            <span>ETA: <strong className="text-blue-300 font-mono">{part.eta}</strong></span>
            <span>•</span>
            <span>สถานะปัจจุบัน: <strong className="text-red-400">{STATUS_MAP[part.status].labelTh}</strong></span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* USER MODE: RESTRICTED TO ONLY 1) Confirm Receipt OR 2) Request Urgent    */}
        {/* ========================================================================= */}
        {isUserOnly ? (
          <div className="p-4 sm:p-5 space-y-4">
            
            {/* User Tab Switcher (Only 2 choices allowed as requested!) */}
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#061427] border border-blue-900/60 text-xs">
              <button
                type="button"
                onClick={() => setUserTab('RECEIVE')}
                className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                  userTab === 'RECEIVE'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <PackageCheck className="w-4 h-4" />
                <span>{language === 'TH' ? '1. บันทึกรับอะไหล่' : '1. Confirm Received'}</span>
              </button>

              <button
                type="button"
                onClick={() => setUserTab('URGENT')}
                className={`py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-2 transition ${
                  userTab === 'URGENT'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <AlertOctagon className="w-4 h-4" />
                <span>{language === 'TH' ? '2. แจ้งอะไหล่ด่วน' : '2. Flag as Urgent'}</span>
              </button>
            </div>

            {/* TAB 1: บันทึกรับอะไหล่ */}
            {userTab === 'RECEIVE' && (
              <form onSubmit={handleUserConfirmReceipt} className="space-y-3.5 animate-in fade-in duration-200">
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/60 text-xs">
                  <div className="flex items-center gap-2 text-white font-bold mb-1">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{language === 'TH' ? 'บันทึกการส่งมอบ & ตรวจรับอะไหล่เข้าอู่เรือ' : 'Confirm Spare Part Receipt at Yard'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {language === 'TH'
                      ? 'เมื่อช่างหน้างานได้รับอะไหล่จริงแล้ว ระบบจะอัพเดตสถานะเป็น "ส่งมอบเข้าอู่เรือแล้ว (Delivered)" และยิงแจ้งเตือนทันที'
                      : 'Marks this spare part as delivered into the shipyard and notifies all teams.'}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    {language === 'TH' ? 'วันที่รับมอบเข้าอู่เรือจริง (DELIVERY DATE):' : 'Actual Delivery / Receipt Date:'}
                  </label>
                  <input
                    type="date"
                    value={userDeliveryDate}
                    onChange={(e) => setUserDeliveryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#061427] border border-blue-800 text-white font-mono text-xs focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    {language === 'TH' ? 'ตำแหน่งที่เก็บ / แผนกที่นำไปใช้ (Yard Location):' : 'Yard Storage / Worksite Location:'}
                  </label>
                  <input
                    type="text"
                    value={userYardLocation}
                    onChange={(e) => setUserYardLocation(e.target.value)}
                    placeholder="เช่น คลังสินค้า 2, หน้างาน Drydock 1, ฝ่ายช่างเครื่องกล"
                    className="w-full px-3 py-2 rounded-xl bg-[#061427] border border-blue-800 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    {language === 'TH' ? 'หมายเหตุช่างผู้รับมอบ (Optional Note):' : 'Receiver Notes:'}
                  </label>
                  <input
                    type="text"
                    value={userReceiverNote}
                    onChange={(e) => setUserReceiverNote(e.target.value)}
                    placeholder="เช่น ช่างกลรับไปติดตั้งห้องเครื่องเรียบร้อยแล้ว"
                    className="w-full px-3 py-2 rounded-xl bg-[#061427] border border-blue-800 text-white text-xs focus:outline-none focus:border-red-500"
                  />
                </div>

                {/* Submit button for Receipt */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-900/40 flex items-center gap-1.5 transition active:scale-95"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{language === 'TH' ? 'ยืนยันรับอะไหล่แล้ว' : 'Confirm Received'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: แจ้งอะไหล่ด่วน */}
            {userTab === 'URGENT' && (
              <form onSubmit={handleUserRequestUrgent} className="space-y-3.5 animate-in fade-in duration-200">
                <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-xs">
                  <div className="flex items-center gap-2 text-red-300 font-bold mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>{language === 'TH' ? 'แจ้งขออะไหล่ด่วนฉุกเฉิน (Flag as Urgent)' : 'Request Expedited / Urgent Priority'}</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {language === 'TH'
                      ? 'ส่งสัญญาณเตือนระดับด่วนที่สุด (Critical Push Alert) ไปยังฝ่ายจัดซื้อและหัวหน้างานเพื่อเร่งการตรวจปล่อย'
                      : 'Broadcasts a high-priority emergency alert to logistics and procurement teams.'}
                  </p>
                </div>

                {/* Urgent Toggle */}
                <div className="p-3 rounded-xl bg-[#061427] border border-blue-900 flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    {language === 'TH' ? 'สถานะความเร่งด่วน:' : 'Urgent Priority:'}
                  </span>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={userIsUrgent}
                      onChange={(e) => setUserIsUrgent(e.target.checked)}
                      className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-700 bg-slate-900"
                    />
                    <span className={`text-xs font-bold ${userIsUrgent ? 'text-red-400' : 'text-slate-400'}`}>
                      {userIsUrgent ? (language === 'TH' ? '🚨 ด่วนฉุกเฉิน' : '🚨 Urgent') : (language === 'TH' ? 'ปกติ (Normal)' : 'Normal')}
                    </span>
                  </label>
                </div>

                {/* Reason Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-200 mb-1">
                    {language === 'TH' ? 'ระบุสาเหตุที่แจ้งด่วน:' : 'Urgency Reason / Work Impact:'}
                  </label>
                  <textarea
                    rows={3}
                    value={userUrgentReason}
                    onChange={(e) => setUserUrgentReason(e.target.value)}
                    placeholder={language === 'TH' ? 'เช่น เรือมีกำหนดออกจากอู่พรุ่งนี้ / งานซ่อมใบจักรติดขัดต้องการชิ้นส่วนด่วน' : 'e.g. Vessel departure deadline tomorrow / overhaul halted pending part'}
                    className="w-full px-3 py-2 rounded-xl bg-[#061427] border border-red-900/60 text-white text-xs focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                {/* Submit button for Urgent */}
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
                  >
                    {t.cancel}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-lg shadow-red-900/40 flex items-center gap-1.5 transition active:scale-95"
                  >
                    <AlertOctagon className="w-4 h-4" />
                    <span>{language === 'TH' ? 'ส่งแจ้งเตือนอะไหล่ด่วน' : 'Broadcast Urgent Request'}</span>
                  </button>
                </div>
              </form>
            )}

            {/* Permission explanation banner */}
            <div className="p-2.5 rounded-lg bg-[#061427]/80 border border-slate-800 text-[10px] text-slate-400">
              {language === 'TH'
                ? '🔒 สิทธิ์ทีมหน้างาน (USER): สามารถทำรายการ "บันทึกรับอะไหล่" หรือ "แจ้งอะไหล่ด่วน" ข้อมูลเอกสารหลักถูกควบคุมโดยผู้ดูแลระบบ'
                : '🔒 USER Mode: Restricted to confirming spare part receipt or requesting urgent priority.'}
            </div>

          </div>
        ) : (
          /* ========================================================================= */
          /* ADMIN MODE: FULL LOGISTICS STATUS MANAGEMENT                              */
          /* ========================================================================= */
          <form onSubmit={handleAdminSave} className="p-4 sm:p-5 space-y-4">
            {/* Quick Status Buttons */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-2">
                {language === 'TH' ? 'เลือกสถานะใหม่ (สิทธิ์ Admin):' : 'Select New Status (Admin):'}
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {(
                  [
                    'BOOKING_CONFIRMED',
                    'IN_TRANSIT',
                    'CUSTOMS_PORT',
                    'DO_RECEIVED',
                    'OUT_FOR_DELIVERY',
                    'DELIVERED',
                    'URGENT_HOLD',
                  ] as PartStatus[]
                ).map((st) => {
                  const meta = STATUS_MAP[st];
                  const isSelected = selectedStatus === st;
                  return (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleAdminStatusChange(st)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition ${
                        isSelected
                          ? 'bg-blue-600/30 border-red-500 text-white font-bold ring-1 ring-red-500/50'
                          : 'bg-[#061427] border-blue-950 text-slate-300 hover:bg-[#0c2240]'
                      }`}
                    >
                      <span
                        className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                          isSelected ? 'bg-red-500' : 'bg-slate-600'
                        }`}
                      />
                      <div className="truncate">
                        <div className="truncate text-xs">{language === 'TH' ? meta.labelTh : meta.labelEn}</div>
                        <div className="text-[10px] text-slate-400 truncate">{language === 'TH' ? meta.labelEn : meta.labelTh}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Date updates conditional on status */}
            {selectedStatus === 'DO_RECEIVED' && (
              <div className="bg-blue-950/40 p-3 rounded-xl border border-blue-800 text-xs">
                <label className="block text-blue-300 font-semibold mb-1">
                  RECIEVE D/O AND OPEN CONTAINER DATE:
                </label>
                <input
                  type="date"
                  value={doDate}
                  onChange={(e) => setDoDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#061427] border border-blue-700 text-white font-mono focus:outline-none"
                  required
                />
              </div>
            )}

            {selectedStatus === 'DELIVERED' && (
              <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-800 text-xs">
                <label className="block text-emerald-300 font-semibold mb-1">
                  DELIVERY DATE (วันส่งมอบเข้าอู่เรือจริง):
                </label>
                <input
                  type="date"
                  value={delivDate}
                  onChange={(e) => setDelivDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#061427] border border-emerald-700 text-white font-mono focus:outline-none"
                  required
                />
              </div>
            )}

            {/* Notification broadcast checkbox & message */}
            <div className="space-y-2 pt-2 border-t border-blue-950">
              <label className="flex items-center gap-2 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={sendPush}
                  onChange={(e) => setSendPush(e.target.checked)}
                  className="w-4 h-4 rounded text-red-600 focus:ring-red-500 border-slate-700 bg-slate-900"
                />
                <span className="text-white font-semibold flex items-center gap-1.5">
                  <BellRing className="w-3.5 h-3.5 text-red-400" />
                  {t.instantPushCheck}
                </span>
              </label>

              {sendPush && (
                <textarea
                  rows={2}
                  value={customPushMessage}
                  onChange={(e) => setCustomPushMessage(e.target.value)}
                  placeholder={language === 'TH' ? 'ข้อความแจ้งเตือนที่แสดงบนหน้าจอมือถือ...' : 'Alert message shown on smartphone screens...'}
                  className="w-full px-3 py-2 rounded-lg bg-[#061427] border border-blue-900 text-xs text-white focus:outline-none focus:border-red-500"
                />
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-900/40 flex items-center gap-1.5 transition"
              >
                <CheckCircle className="w-4 h-4 text-white" />
                <span>{language === 'TH' ? 'บันทึกสถานะ & แจ้งเตือน' : 'Save & Broadcast'}</span>
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
