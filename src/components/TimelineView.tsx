import React from 'react';
import { Calendar, Package, MapPin, RotateCw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SparePart } from '../types/sparePart';
import { STATUS_MAP } from '../utils/statusHelper';

interface Props {
  parts: SparePart[];
}

export const TimelineView: React.FC<Props> = ({ parts }) => {
  const { setSelectedPart, setPartToUpdateStatus, setIsQuickStatusModalOpen, userRole, language, t } = useApp();

  // Sort parts by ETA ascending
  const sortedParts = [...parts].sort((a, b) => (a.eta || '').localeCompare(b.eta || ''));

  if (sortedParts.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        <p className="text-base font-semibold text-slate-300">
          {language === 'TH' ? 'ไม่พบข้อมูล Spare Part ที่ค้นหา' : 'No spare parts found matching query'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl max-w-4xl mx-auto">
      <div className="relative border-l-2 border-slate-800 ml-4 sm:ml-8 space-y-6 sm:space-y-8 py-2">
        {sortedParts.map((p) => {
          const meta = STATUS_MAP[p.status];
          const isDelivered = p.status === 'DELIVERED';

          return (
            <div key={p.id} className="relative pl-6 sm:pl-8 group">
              {/* Timeline Node Icon */}
              <div
                className={`absolute -left-[17px] top-1.5 w-8 h-8 rounded-full border-2 flex items-center justify-center transition shadow-md ${
                  isDelivered
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                    : p.isUrgent
                    ? 'bg-rose-950 border-rose-500 text-rose-400 animate-pulse'
                    : 'bg-slate-950 border-cyan-500 text-cyan-400'
                }`}
              >
                {isDelivered ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Calendar className="w-4 h-4" />
                )}
              </div>

              {/* Card Container */}
              <div
                onClick={() => setSelectedPart(p)}
                className="bg-slate-950/70 border border-slate-800/90 hover:border-cyan-500/50 rounded-xl p-4 shadow-md cursor-pointer transition hover:bg-slate-900/80"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-cyan-400 text-sm">
                      {p.bookingNo}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${meta.badgeClass}`}
                    >
                      {language === 'TH' ? meta.labelTh : meta.labelEn}
                    </span>
                    {p.isUrgent && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500 text-white">
                        {language === 'TH' ? 'ด่วน' : 'Urgent'}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <div className="font-mono text-cyan-300 font-bold bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      ETA: {p.eta}
                    </div>
                    {p.receiveDoAndOpenContainerDate && (
                      <div className="font-mono text-amber-300 text-[11px] bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                        {language === 'TH' ? 'เปิดตู้ D/O' : 'D/O Opened'}: {p.receiveDoAndOpenContainerDate}
                      </div>
                    )}
                  </div>
                </div>

                <div className="font-bold text-white text-xs sm:text-sm mb-1">{p.job}</div>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">
                  {p.descriptionOfGoods}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span>{p.type}</span>
                    <span>•</span>
                    <span>{p.package || '-'}</span>
                    <span>•</span>
                    <span>{p.weight} kg</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPartToUpdateStatus(p);
                      setIsQuickStatusModalOpen(true);
                    }}
                    className={`flex items-center gap-1 font-bold text-xs px-2.5 py-1 rounded-lg transition ${
                      userRole === 'ADMIN'
                        ? 'text-cyan-400 hover:text-cyan-300 bg-slate-800/80 hover:bg-slate-800'
                        : 'text-emerald-300 hover:text-white bg-emerald-950/80 hover:bg-emerald-600 border border-emerald-700/50'
                    }`}
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>
                      {userRole === 'ADMIN'
                        ? t.updateStatus
                        : (language === 'TH' ? 'บันทึกรับ / แจ้งด่วน' : 'Receive / Urgent')}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
