import React, { useState } from 'react';
import {
  X,
  Printer,
  Edit,
  Trash2,
  Calendar,
  Package,
  Ship,
  Plane,
  Truck,
  Zap,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  FileCheck,
  Building,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SparePart, PartStatus } from '../types/sparePart';
import { STATUS_MAP } from '../utils/statusHelper';
import { LineBroadcastModal } from './LineBroadcastModal';
import { UnithaiLogo } from './UnithaiLogo';

interface Props {
  part: SparePart;
  onClose: () => void;
  onEdit: (part: SparePart) => void;
}

export const SparePartDetailModal: React.FC<Props> = ({ part, onClose, onEdit }) => {
  const [isLineOpen, setIsLineOpen] = useState(false);
  const {
    deleteSparePart,
    userRole,
    setPartToUpdateStatus,
    setIsQuickStatusModalOpen,
    setIsPrintModalOpen,
    language,
    t,
  } = useApp();

  const meta = STATUS_MAP[part.status];

  const milestones: { status: PartStatus; labelTh: string; labelEn: string; date?: string }[] = [
    { status: 'BOOKING_CONFIRMED', labelTh: 'จองขนส่ง', labelEn: 'Booking Confirmed', date: part.bookingDate },
    { status: 'IN_TRANSIT', labelTh: 'เดินทาง (ETD)', labelEn: 'In Transit', date: part.etd },
    { status: 'CUSTOMS_PORT', labelTh: 'ถึงท่าเรือ (ETA)', labelEn: 'Port & Customs', date: part.eta },
    {
      status: 'DO_RECEIVED',
      labelTh: 'รับ D/O & เปิดตู้',
      labelEn: 'D/O & Open Container',
      date: part.receiveDoAndOpenContainerDate || (language === 'TH' ? 'ยังไม่ระบุ' : 'Pending'),
    },
    {
      status: 'DELIVERED',
      labelTh: 'ส่งมอบเข้าอู่เรือ',
      labelEn: 'Delivered to Yard',
      date: part.deliveryDate || (language === 'TH' ? 'ยังไม่ระบุ' : 'Pending'),
    },
  ];

  const currentStep = meta.stepIndex;

  const handleDelete = () => {
    const confirmMsg = language === 'TH'
      ? `คุณแน่ใจหรือไม่ว่าต้องการลบบุ๊คกิ้ง ${part.bookingNo}?`
      : `Are you sure you want to delete booking ${part.bookingNo}?`;
    if (confirm(confirmMsg)) {
      deleteSparePart(part.id);
      onClose();
    }
  };

  const handleOpenStatusModal = () => {
    setPartToUpdateStatus(part);
    setIsQuickStatusModalOpen(true);
  };

  const handleOpenPrint = () => {
    setIsPrintModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm sm:text-base font-bold text-white">
                  {part.bookingNo}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${meta.badgeClass}`}>
                  {language === 'TH' ? meta.labelTh : meta.labelEn}
                </span>
                {part.isUrgent && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                    {language === 'TH' ? 'ด่วนฉุกเฉิน' : 'Critical Urgent'}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">{part.job}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenPrint}
              title={t.printSlip}
              className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 text-xs flex items-center gap-1.5 transition"
            >
              <Printer className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">{t.printSlip}</span>
            </button>

            {userRole === 'ADMIN' && (
              <>
                <button
                  onClick={() => onEdit(part)}
                  title={t.edit}
                  className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 text-xs flex items-center gap-1.5 transition"
                >
                  <Edit className="w-4 h-4 text-blue-400" />
                  <span className="hidden sm:inline">{t.edit}</span>
                </button>
                <button
                  onClick={handleDelete}
                  title={t.delete}
                  className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scroll Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Milestone Stepper */}
          <div className="bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                {language === 'TH' ? 'ความคืบหน้าการเดินทาง & ส่งมอบ (Logistics Milestone)' : 'Logistics Progress & Milestone Tracking'}
              </span>
              <button
                onClick={handleOpenStatusModal}
                className="px-2.5 py-1 rounded-lg bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border border-cyan-500/40 text-xs font-medium flex items-center gap-1.5 transition"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>{t.updateStatus}</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {milestones.map((m, idx) => {
                const stepNum = idx + 1;
                const isPassed = currentStep >= stepNum;
                const isCurrent = currentStep === stepNum;

                return (
                  <div
                    key={m.status}
                    className={`p-3 rounded-xl border text-xs transition ${
                      isCurrent
                        ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md ring-1 ring-cyan-500/30'
                        : isPassed
                        ? 'bg-slate-900/80 border-emerald-500/40 text-slate-300'
                        : 'bg-slate-900/40 border-slate-800/80 text-slate-500 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-bold text-slate-400">
                        {language === 'TH' ? `ขั้นที่ ${stepNum}` : `Stage ${stepNum}`}
                      </span>
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-600" />
                      )}
                    </div>
                    <div className="font-bold text-white text-xs truncate">
                      {language === 'TH' ? m.labelTh : m.labelEn}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {language === 'TH' ? m.labelEn : m.labelTh}
                    </div>
                    <div className="mt-2 font-mono text-[10px] text-cyan-400 bg-slate-950/60 px-1.5 py-0.5 rounded border border-slate-800 inline-block">
                      {m.date || '-'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Description of Goods Banner */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              DESCRIPTION OF GOODS ({language === 'TH' ? 'รายละเอียดสิ่งของ / อะไหล่เรือ' : 'Item & Technical Details'})
            </span>
            <p className="text-sm sm:text-base font-bold text-white leading-relaxed">
              {part.descriptionOfGoods}
            </p>
            {part.priorityNotes && (
              <div className="mt-2.5 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong className="font-semibold">{language === 'TH' ? 'ข้อความสั่งการ/หมายเหตุ:' : 'Priority Notes / Operational Remarks:'}</strong> {part.priorityNotes}
                </div>
              </div>
            )}
          </div>

          {/* Complete 19 Template Fields Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {language === 'TH' ? 'ข้อมูลจำเพาะครบทั้ง 19 หัวข้อ (UNITHAI Template Specifications)' : 'All 19 Standard UNITHAI Template Specifications'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">1. Booking DATE</span>
                <span className="font-mono font-medium text-white">{part.bookingDate}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">2. BOOKING NO.</span>
                <span className="font-mono font-bold text-cyan-400">{part.bookingNo}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">3. P/O (Purchase Order)</span>
                <span className="font-mono font-medium text-white">{part.po || '-'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">4. AWB/BL</span>
                <span className="font-mono font-medium text-white">{part.awbBl || '-'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">5. FLIGHT / VESSEL</span>
                <span className="font-medium text-white">{part.flightVessel || '-'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">6. SRM (Ship Repair Manager)</span>
                <span className="font-semibold text-white block">{part.srm || '-'}</span>
                {part.srmEmail && (
                  <span className="text-[10px] font-mono text-blue-300 block">{part.srmEmail}</span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">CO-SRM (ผู้ช่วย SRM)</span>
                <span className="font-semibold text-amber-300 block">{part.coSrm || '-'}</span>
                {part.coSrmEmail && (
                  <span className="text-[10px] font-mono text-amber-200 block">{part.coSrmEmail}</span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">IN CHARGE (วิศวกรผู้ควบคุม)</span>
                <span className="font-semibold text-emerald-300 block">{part.inCharge || '-'}</span>
                {part.inChargeEmail && (
                  <span className="text-[10px] font-mono text-emerald-200 block">{part.inChargeEmail}</span>
                )}
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 col-span-1 sm:col-span-2 lg:col-span-3">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">7. JOB (โครงการ / เรือ)</span>
                <span className="font-bold text-white text-sm">{part.job}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">9. SHIPPER/SUPPLIER</span>
                <span className="font-medium text-white">{part.shipperSupplier || '-'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">10. FROM (ต้นทาง / Origin)</span>
                <span className="font-medium text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  {part.from || '-'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">11. TO (ปลายทาง / Destination)</span>
                <span className="font-medium text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  {part.to || '-'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">12. PACKAGE</span>
                <span className="font-medium text-white">{part.package || '-'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">13. WEIGHT (kg)</span>
                <span className="font-mono font-bold text-cyan-300">{part.weight.toLocaleString()} kg</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">14. ETD</span>
                <span className="font-mono font-medium text-white">{part.etd || '-'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-cyan-500/30 bg-cyan-950/20">
                <span className="text-[10px] text-cyan-400 uppercase font-bold block">15. ETA (Estimated Arrival)</span>
                <span className="font-mono font-bold text-cyan-300 text-sm">{part.eta || '-'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-amber-500/30 bg-amber-950/20">
                <span className="text-[10px] text-amber-400 uppercase font-bold block">
                  16. RECIEVE D/O AND OPEN CONTAINER DATE
                </span>
                <span className="font-mono font-bold text-amber-300">
                  {part.receiveDoAndOpenContainerDate || (language === 'TH' ? 'ยังไม่ถึงขั้นตอนรับ D/O' : 'Pending D/O & Inspection')}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-emerald-500/30 bg-emerald-950/20">
                <span className="text-[10px] text-emerald-400 uppercase font-bold block">
                  17. DELIVERY DATE
                </span>
                <span className="font-mono font-bold text-emerald-300">
                  {part.deliveryDate || (language === 'TH' ? 'ยังไม่ได้ส่งมอบ' : 'Not yet delivered')}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">18. TERM (Incoterms)</span>
                <span className="font-mono font-bold text-white">{part.term}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">19. TYPE (Transport Type)</span>
                <span className="font-bold text-white">{part.type}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800">
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                  {language === 'TH' ? 'ตำแหน่งคลังในอู่ (Yard Location)' : 'Yard Location'}
                </span>
                <span className="font-semibold text-cyan-300">{part.yardLocation || 'Warehouse 2'}</span>
              </div>
            </div>
          </div>

          {/* Audit trail */}
          <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-800 pt-3">
            <span>{language === 'TH' ? 'อัพเดตล่าสุด:' : 'Last updated:'} {part.updatedAt}</span>
            <span>{language === 'TH' ? 'โดย:' : 'By:'} {part.updatedBy}</span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-[#07172c] border-t border-blue-900/60 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            {userRole === 'ADMIN' ? (
              <button
                onClick={handleOpenStatusModal}
                className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-600 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-blue-900/40"
              >
                <RotateCw className="w-4 h-4" />
                <span>{language === 'TH' ? 'อัพเดตสถานะ (สิทธิ์ Admin)' : 'Update Status (Admin)'}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={handleOpenStatusModal}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-emerald-900/30 active:scale-95"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'TH' ? 'บันทึกรับอะไหล่' : 'Confirm Received'}</span>
                </button>
                <button
                  onClick={handleOpenStatusModal}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-md shadow-red-900/30 active:scale-95"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>{language === 'TH' ? 'แจ้งอะไหล่ด่วน' : 'Request Urgent'}</span>
                </button>
              </>
            )}

            {/* Direct Send LINE Notification Button */}
            <button
              onClick={() => setIsLineOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#00C300]/20 hover:bg-[#00C300]/30 text-[#00C300] border border-[#00C300]/40 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
              title="ส่งข้อความแจ้งเตือนสถานะอะไหล่นี้เข้า LINE ของ SRM โดยตรง"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>ส่งแจ้งเตือนเข้า LINE</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            {t.close}
          </button>
        </div>

        {/* LINE Broadcast Modal for this part */}
        <LineBroadcastModal
          isOpen={isLineOpen}
          onClose={() => setIsLineOpen(false)}
          initialPart={part}
        />

      </div>
    </div>
  );
};
