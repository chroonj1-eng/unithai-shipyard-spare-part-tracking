import React from 'react';
import {
  RotateCw,
  Printer,
  Calendar,
  Package,
  MapPin,
  Clock,
  AlertTriangle,
  Scale,
  FileText,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SparePart } from '../types/sparePart';
import { STATUS_MAP } from '../utils/statusHelper';

interface Props {
  parts: SparePart[];
}

export const CardView: React.FC<Props> = ({ parts }) => {
  const {
    setSelectedPart,
    setPartToUpdateStatus,
    setIsQuickStatusModalOpen,
    setIsPrintModalOpen,
    userRole,
    language,
    isDark,
    t,
  } = useApp();

  const handleQuickStatus = (e: React.MouseEvent, part: SparePart) => {
    e.stopPropagation();
    setPartToUpdateStatus(part);
    setIsQuickStatusModalOpen(true);
  };

  const handlePrint = (e: React.MouseEvent, part: SparePart) => {
    e.stopPropagation();
    setSelectedPart(part);
    setIsPrintModalOpen(true);
  };

  if (parts.length === 0) {
    return (
      <div className={`border rounded-2xl p-12 text-center transition-colors ${
        isDark ? 'bg-slate-900/50 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500 shadow-sm'
      }`}>
        <p className={`text-base font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
          {language === 'TH' ? 'ไม่พบข้อมูล Spare Part ที่ค้นหา' : 'No spare parts found matching query'}
        </p>
        <p className={`text-xs mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {language === 'TH' ? 'ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรอง' : 'Try searching different keywords or clear filters'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {parts.map((p) => {
        const meta = STATUS_MAP[p.status];
        return (
          <div
            key={p.id}
            onClick={() => setSelectedPart(p)}
            className={`border rounded-2xl p-4 sm:p-5 cursor-pointer transition-all flex flex-col justify-between group ${
              isDark
                ? 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/50 shadow-lg hover:shadow-cyan-500/10'
                : 'bg-white border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md'
            }`}
          >
            <div>
              {/* Top row: Booking No, Type & Status */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {p.isUrgent && (
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping shrink-0" />
                  )}
                  <span className={`font-mono font-bold text-xs sm:text-sm tracking-wide truncate ${
                    isDark ? 'text-cyan-400' : 'text-blue-700'
                  }`}>
                    {p.bookingNo}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold border shrink-0 ${meta.badgeClass}`}
                >
                  {language === 'TH' ? meta.labelTh : meta.labelEn}
                </span>
              </div>

              {/* Job Name */}
              <div className={`text-xs font-bold mb-2 line-clamp-1 transition ${
                isDark ? 'text-white group-hover:text-cyan-300' : 'text-slate-900 group-hover:text-blue-600'
              }`}>
                {p.job}
              </div>

              {/* Description of Goods */}
              <p className={`text-xs line-clamp-2 leading-relaxed mb-3 p-2.5 rounded-xl border ${
                isDark
                  ? 'text-slate-300 bg-slate-950/40 border-slate-800/80'
                  : 'text-slate-700 bg-slate-50 border-slate-200'
              }`}>
                {p.descriptionOfGoods}
              </p>

              {/* Details Matrix */}
              <div className={`grid grid-cols-2 gap-2 text-[11px] mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <div className="flex items-center gap-1.5 truncate">
                  <Package className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{p.package || '-'}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <Scale className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className={`font-mono ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{p.weight} kg</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{p.from || '-'}</span>
                </div>
                <div className="flex items-center gap-1.5 truncate">
                  <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>{p.term}</span>
                  <span>•</span>
                  <span className="truncate">{p.type}</span>
                </div>
              </div>

              {/* ETA & D/O Highlight Strip */}
              <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs mb-3 ${
                isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-blue-50/70 border-blue-200/80'
              }`}>
                <div>
                  <span className={`text-[10px] uppercase font-bold block ${
                    isDark ? 'text-cyan-400' : 'text-blue-700'
                  }`}>
                    {language === 'TH' ? 'ETA ถึงไทย' : 'ETA Arrival'}
                  </span>
                  <span className={`font-mono font-bold text-xs ${
                    isDark ? 'text-white' : 'text-slate-900'
                  }`}>{p.eta || '-'}</span>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] uppercase font-bold block ${
                    isDark ? 'text-amber-400' : 'text-amber-700'
                  }`}>
                    {language === 'TH' ? 'วันเปิดตู้ D/O' : 'D/O & Open Cont.'}
                  </span>
                  <span className={`font-mono font-semibold text-xs ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {p.receiveDoAndOpenContainerDate || (language === 'TH' ? 'รอ D/O' : 'Pending D/O')}
                  </span>
                </div>
              </div>

              {p.priorityNotes && (
                <div className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 p-2 rounded-lg line-clamp-1 mb-3">
                  ⚠️ {p.priorityNotes}
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className={`pt-3 border-t flex items-center justify-between gap-2 text-xs ${
              isDark ? 'border-slate-800' : 'border-slate-200'
            }`}>
              <button
                onClick={(e) => handleQuickStatus(e, p)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition ${
                  userRole === 'ADMIN'
                    ? isDark
                      ? 'bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-300'
                      : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 border border-slate-200'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                }`}
              >
                <RotateCw className="w-3.5 h-3.5 group-hover:text-white" />
                <span>
                  {userRole === 'ADMIN'
                    ? t.updateStatus
                    : (language === 'TH' ? 'บันทึกรับ / แจ้งด่วน' : 'Receive / Urgent')}
                </span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => handlePrint(e, p)}
                  title={t.printSlip}
                  className={`p-1.5 rounded-lg transition ${
                    isDark
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  <Printer className="w-3.5 h-3.5" />
                </button>
                <span className={`text-xs flex items-center gap-0.5 transition ${
                  isDark ? 'text-slate-500 group-hover:text-cyan-400' : 'text-slate-400 group-hover:text-blue-600'
                }`}>
                  <span>{t.viewDetails}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

          </div>
        );
      })}
    </div>
  );
};
