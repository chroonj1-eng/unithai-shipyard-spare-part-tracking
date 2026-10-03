import React from 'react';
import {
  MoreVertical,
  RotateCw,
  Printer,
  Eye,
  AlertTriangle,
  Plane,
  Ship,
  Truck,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SparePart } from '../types/sparePart';
import { STATUS_MAP } from '../utils/statusHelper';

interface Props {
  parts: SparePart[];
}

export const TableView: React.FC<Props> = ({ parts }) => {
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
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        <p className="text-base font-semibold text-slate-300">
          {language === 'TH' ? 'ไม่พบข้อมูล Spare Part ที่ค้นหา' : 'No spare parts found matching query'}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'TH' ? 'ลองเปลี่ยนคำค้นหา หรือรีเซ็ตตัวกรองด้านบน' : 'Try searching different keywords or clear filters'}
        </p>
      </div>
    );
  }

  return (
    <div className={`border rounded-2xl overflow-hidden transition-colors ${
      isDark ? 'bg-slate-900/80 border-slate-800 shadow-xl' : 'bg-white border-slate-200 shadow-md'
    }`}>
      
      {/* Scrollable Container */}
      <div className="overflow-x-auto relative">
        <table className="w-full text-left text-xs border-collapse whitespace-nowrap">
          
          {/* Header Row: All 19 Columns */}
          <thead>
            <tr className={`uppercase tracking-wider font-bold border-b text-[11px] ${
              isDark ? 'bg-slate-950 text-slate-300 border-slate-800' : 'bg-slate-100 text-slate-700 border-slate-200'
            }`}>
              <th className={`py-3.5 px-4 sticky left-0 z-10 border-r min-w-[140px] ${
                isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-100 border-slate-200 text-slate-900'
              }`}>
                BOOKING NO.
              </th>
              <th className="py-3.5 px-3 min-w-[120px]">{language === 'TH' ? 'สถานะ (STATUS)' : 'STATUS'}</th>
              <th className="py-3.5 px-3 min-w-[160px]">{language === 'TH' ? 'JOB (โครงการ/เรือ)' : 'JOB (VESSEL / PROJECT)'}</th>
              <th className="py-3.5 px-4 min-w-[240px]">DESCRIPTION OF GOODS</th>
              <th className="py-3.5 px-3 min-w-[100px]">Booking DATE</th>
              <th className="py-3.5 px-3 min-w-[120px]">P/O</th>
              <th className="py-3.5 px-3 min-w-[130px]">AWB/BL</th>
              <th className="py-3.5 px-3 min-w-[140px]">FLIGHT / VESSEL</th>
              <th className="py-3.5 px-3 min-w-[90px]">SRM</th>
              <th className="py-3.5 px-3 min-w-[160px]">SHIPPER/SUPPLIER</th>
              <th className="py-3.5 px-3 min-w-[110px]">FROM</th>
              <th className="py-3.5 px-3 min-w-[120px]">TO</th>
              <th className="py-3.5 px-3 min-w-[110px]">PACKAGE</th>
              <th className="py-3.5 px-3 min-w-[90px]">WEIGHT (kg)</th>
              <th className="py-3.5 px-3 min-w-[100px]">ETD</th>
              <th className={`py-3.5 px-3 min-w-[100px] ${isDark ? 'text-cyan-400' : 'text-blue-600 font-bold'}`}>ETA</th>
              <th className={`py-3.5 px-3 min-w-[150px] ${isDark ? 'text-amber-400' : 'text-amber-700 font-bold'}`}>
                RECIEVE D/O & OPEN CONT.
              </th>
              <th className={`py-3.5 px-3 min-w-[120px] ${isDark ? 'text-emerald-400' : 'text-emerald-700 font-bold'}`}>DELIVERY DATE</th>
              <th className="py-3.5 px-3 min-w-[80px]">TERM</th>
              <th className="py-3.5 px-3 min-w-[110px]">TYPE</th>
              <th className={`py-3.5 px-4 text-center sticky right-0 z-10 border-l ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                {language === 'TH' ? 'การจัดการ' : 'ACTIONS'}
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className={`divide-y text-xs ${isDark ? 'divide-slate-800/80 text-slate-300' : 'divide-slate-200 text-slate-700'}`}>
            {parts.map((p) => {
              const meta = STATUS_MAP[p.status];
              return (
                <tr
                  key={p.id}
                  onClick={() => setSelectedPart(p)}
                  className={`cursor-pointer transition group ${
                    isDark ? 'hover:bg-slate-800/60' : 'hover:bg-blue-50/60'
                  }`}
                >
                  {/* Sticky Booking No */}
                  <td className={`py-3 px-4 font-mono font-bold sticky left-0 z-10 border-r transition-colors ${
                    isDark
                      ? 'bg-slate-900 group-hover:bg-slate-800/90 border-slate-800 text-white'
                      : 'bg-white group-hover:bg-blue-50/80 border-slate-200 text-slate-900'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      {p.isUrgent && (
                        <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0 animate-pulse" />
                      )}
                      <span className={isDark ? 'text-cyan-400' : 'text-blue-700 font-bold'}>{p.bookingNo}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${meta.badgeClass}`}
                    >
                      {language === 'TH' ? meta.labelTh : meta.labelEn}
                    </span>
                  </td>

                  {/* JOB */}
                  <td className={`py-3 px-3 font-semibold max-w-[200px] truncate ${isDark ? 'text-white' : 'text-slate-900'}`} title={p.job}>
                    {p.job}
                  </td>

                  {/* DESCRIPTION OF GOODS */}
                  <td className={`py-3 px-4 max-w-[300px] truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`} title={p.descriptionOfGoods}>
                    <div className="truncate font-medium">{p.descriptionOfGoods}</div>
                    {p.priorityNotes && (
                      <div className="text-[10px] text-amber-500 truncate">
                        ⚠️ {p.priorityNotes}
                      </div>
                    )}
                  </td>

                  {/* Booking Date */}
                  <td className="py-3 px-3 font-mono text-slate-400">{p.bookingDate}</td>

                  {/* P/O */}
                  <td className="py-3 px-3 font-mono text-slate-300">{p.po || '-'}</td>

                  {/* AWB/BL */}
                  <td className="py-3 px-3 font-mono text-slate-300">{p.awbBl || '-'}</td>

                  {/* FLIGHT / VESSEL */}
                  <td className="py-3 px-3 text-slate-300 max-w-[160px] truncate" title={p.flightVessel}>
                    {p.flightVessel || '-'}
                  </td>

                  {/* SRM */}
                  <td className="py-3 px-3 font-mono text-slate-400">{p.srm || '-'}</td>

                  {/* SHIPPER/SUPPLIER */}
                  <td className="py-3 px-3 text-slate-300 max-w-[180px] truncate" title={p.shipperSupplier}>
                    {p.shipperSupplier || '-'}
                  </td>

                  {/* FROM */}
                  <td className="py-3 px-3 text-slate-400">{p.from || '-'}</td>

                  {/* TO */}
                  <td className="py-3 px-3 text-slate-400 max-w-[140px] truncate" title={p.to}>
                    {p.to || '-'}
                  </td>

                  {/* PACKAGE */}
                  <td className="py-3 px-3 text-slate-300">{p.package || '-'}</td>

                  {/* WEIGHT */}
                  <td className="py-3 px-3 font-mono font-medium text-cyan-300">
                    {p.weight.toLocaleString()}
                  </td>

                  {/* ETD */}
                  <td className="py-3 px-3 font-mono text-slate-400">{p.etd || '-'}</td>

                  {/* ETA */}
                  <td className="py-3 px-3 font-mono font-bold text-cyan-400">{p.eta || '-'}</td>

                  {/* RECIEVE D/O AND OPEN CONTAINER DATE */}
                  <td className="py-3 px-3 font-mono font-semibold text-amber-300">
                    {p.receiveDoAndOpenContainerDate || '-'}
                  </td>

                  {/* DELIVERY DATE */}
                  <td className="py-3 px-3 font-mono font-semibold text-emerald-400">
                    {p.deliveryDate || '-'}
                  </td>

                  {/* TERM */}
                  <td className="py-3 px-3 font-mono font-bold text-slate-300">{p.term}</td>

                  {/* TYPE */}
                  <td className="py-3 px-3">
                    <span className="text-[11px] font-medium text-slate-300">
                      {p.type}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className={`py-3 px-3 sticky right-0 z-10 text-center border-l transition-colors ${
                    isDark
                      ? 'bg-slate-900 group-hover:bg-slate-800/90 border-slate-800'
                      : 'bg-white group-hover:bg-blue-50/80 border-slate-200'
                  }`}>
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={(e) => handleQuickStatus(e, p)}
                        title={
                          userRole === 'ADMIN'
                            ? (language === 'TH' ? 'อัพเดตสถานะ (สิทธิ์ Admin)' : 'Update Status (Admin)')
                            : (language === 'TH' ? 'บันทึกรับอะไหล่ / แจ้งอะไหล่ด่วน' : 'Confirm Received / Request Urgent')
                        }
                        className={`p-1.5 rounded-lg transition ${
                          userRole === 'ADMIN'
                            ? isDark
                              ? 'bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-400'
                              : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-600'
                            : isDark
                            ? 'bg-emerald-950/60 hover:bg-emerald-600 hover:text-white text-emerald-400 border border-emerald-700/50'
                            : 'bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 border border-emerald-300'
                        }`}
                      >
                        <RotateCw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handlePrint(e, p)}
                        title={t.printSlip}
                        className={`p-1.5 rounded-lg transition ${
                          isDark ? 'bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white' : 'bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white'
                        }`}
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPart(p);
                        }}
                        title={t.viewDetails}
                        className={`p-1.5 rounded-lg transition ${
                          isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Footer */}
      <div className={`p-3 border-t flex items-center justify-between text-xs px-4 transition-colors ${
        isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
      }`}>
        <span>
          {language === 'TH'
            ? `แสดงทั้งหมด ${parts.length} รายการ (19 คอลัมน์ตามเทมเพลตมาตรฐาน)`
            : `Showing all ${parts.length} shipments (Standard 19-column template)`}
        </span>
        <span className="text-slate-400 hidden sm:inline">
          {language === 'TH' ? 'คลิกที่แถวเพื่อเปิดดูรายละเอียดฉบับเต็ม' : 'Click on any row to open full specifications'}
        </span>
      </div>

    </div>
  );
};
