import React from 'react';
import { RotateCw, AlertTriangle, Clock, MapPin, CheckCircle2, LayoutDashboard } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SparePart, PartStatus } from '../types/sparePart';
import { STATUS_MAP } from '../utils/statusHelper';

interface Props {
  parts: SparePart[];
}

export const KanbanView: React.FC<Props> = ({ parts }) => {
  const { setSelectedPart, setPartToUpdateStatus, setIsQuickStatusModalOpen, language, isDark } = useApp();

  const columns: { status: PartStatus; titleTh: string; titleEn: string; color: string }[] = [
    { status: 'BOOKING_CONFIRMED', titleTh: 'จองขนส่งแล้ว', titleEn: 'Booking Confirmed', color: 'border-blue-500/40 bg-blue-500/10 text-blue-500' },
    { status: 'IN_TRANSIT', titleTh: 'กำลังเดินทาง', titleEn: 'In Transit', color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-500' },
    { status: 'CUSTOMS_PORT', titleTh: 'ถึงท่าเรือ/สนามบิน', titleEn: 'Port & Customs', color: 'border-amber-500/40 bg-amber-500/10 text-amber-500' },
    { status: 'DO_RECEIVED', titleTh: 'รับ D/O & เปิดตู้แล้ว', titleEn: 'D/O & Open Container', color: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-600' },
    { status: 'DELIVERED', titleTh: 'ส่งมอบเข้าอู่เรือแล้ว', titleEn: 'Delivered to Yard', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600' },
  ];

  const handleQuickStatus = (e: React.MouseEvent, part: SparePart) => {
    e.stopPropagation();
    setPartToUpdateStatus(part);
    setIsQuickStatusModalOpen(true);
  };

  return (
    <div className="space-y-3">
      {/* Dashboard Subheader */}
      <div className={`flex items-center justify-between text-xs px-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        <div className="flex items-center gap-2">
          <LayoutDashboard className="w-4 h-4 text-blue-600" />
          <span className={`font-bold tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {language === 'TH' ? 'DASHBOARD: แดชบอร์ดติดตามสถานะการขนส่ง' : 'DASHBOARD: Logistics Pipeline Overview'}
          </span>
        </div>
        <span>
          {language === 'TH' ? 'รวมทั้งหมด' : 'Total Pipeline'}: {parts.length} {language === 'TH' ? 'รายการ' : 'shipments'}
        </span>
      </div>

      {/* Columns Grid */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar min-h-[550px]">
        {columns.map((col) => {
          const colParts = parts.filter((p) => {
            if (col.status === 'IN_TRANSIT') {
              return p.status === 'IN_TRANSIT' || p.status === 'OUT_FOR_DELIVERY';
            }
            return p.status === col.status;
          });

          return (
            <div
              key={col.status}
              className={`w-72 sm:w-80 shrink-0 border rounded-2xl flex flex-col max-h-[75vh] transition-colors ${
                isDark
                  ? 'bg-slate-900/60 border-slate-800'
                  : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              {/* Column Header */}
              <div className={`p-3.5 border-b rounded-t-2xl flex items-center justify-between ${
                isDark ? 'border-slate-800 bg-slate-950/60' : 'border-slate-200 bg-slate-50/90'
              }`}>
                <div>
                  <h4 className={`text-xs font-bold flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${col.color.split(' ')[1]}`} />
                    <span>{language === 'TH' ? col.titleTh : col.titleEn}</span>
                  </h4>
                  <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    {language === 'TH' ? col.titleEn : col.titleTh}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
                  isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'
                }`}>
                  {colParts.length}
                </span>
              </div>

              {/* Column Scrollable Content */}
              <div className="p-3 overflow-y-auto space-y-2.5 flex-1">
                {colParts.length === 0 ? (
                  <div className={`py-8 text-center text-xs ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                    {language === 'TH' ? 'ไม่มีรายการในขั้นตอนนี้' : 'No shipments in this stage'}
                  </div>
                ) : (
                  colParts.map((p) => {
                    return (
                      <div
                        key={p.id}
                        onClick={() => setSelectedPart(p)}
                        className={`p-3 rounded-xl border shadow-sm cursor-pointer transition ${
                          isDark
                            ? 'bg-slate-950/80 border-slate-800/90 hover:border-cyan-500/40 hover:bg-slate-900/80'
                            : 'bg-slate-50/80 border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/40'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1.5">
                          <span className={`font-mono font-bold text-xs truncate ${isDark ? 'text-cyan-400' : 'text-blue-700'}`}>
                            {p.bookingNo}
                          </span>
                          {p.isUrgent && (
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-500 text-[9px] font-bold border border-rose-500/30">
                              {language === 'TH' ? 'ด่วน' : 'Urgent'}
                            </span>
                          )}
                        </div>

                        <div className={`text-[11px] font-bold truncate mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {p.job}
                        </div>

                        <p className={`text-[11px] line-clamp-2 leading-relaxed mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                          {p.descriptionOfGoods}
                        </p>

                        <div className={`flex items-center justify-between text-[10px] pt-2 border-t ${
                          isDark ? 'border-slate-800/80 text-slate-400' : 'border-slate-200 text-slate-500'
                        }`}>
                          <span className={`font-mono ${isDark ? 'text-cyan-300' : 'text-blue-600 font-semibold'}`}>ETA: {p.eta}</span>
                          <button
                            onClick={(e) => handleQuickStatus(e, p)}
                            className="flex items-center gap-1 hover:text-blue-600 transition"
                          >
                            <RotateCw className="w-3 h-3" />
                            <span>{language === 'TH' ? 'อัพเดต' : 'Update'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
