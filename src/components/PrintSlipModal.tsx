import React from 'react';
import { X, Printer, QrCode, Shield, CheckCircle, Package } from 'lucide-react';
import { SparePart } from '../types/sparePart';
import { STATUS_MAP } from '../utils/statusHelper';
import { UnithaiLogo } from './UnithaiLogo';

interface Props {
  part: SparePart;
  onClose: () => void;
}

export const PrintSlipModal: React.FC<Props> = ({ part, onClose }) => {
  const meta = STATUS_MAP[part.status];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Top Bar */}
        <div className="p-3 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Package className="w-4 h-4 text-cyan-400" />
            <span>ใบกำกับสินค้า & บันทึกรับอะไหล่อู่เรือ (UNITHAI Material Receipt Slip)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition shadow-md"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>สั่งพิมพ์เอกสาร</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet (Styled for white paper printable) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-950">
          <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-xl shadow-xl max-w-2xl mx-auto border border-slate-200 print:shadow-none print:p-0 print:border-none">
            
            {/* Header / Brand */}
            <div className="border-b-2 border-blue-900 pb-3 mb-4 flex items-start justify-between relative">
              <div className="absolute -bottom-[2px] left-0 w-28 h-[3px] bg-[#D81E27]" />
              <div>
                <div className="flex items-center gap-3">
                  <div className="p-1 border border-slate-200 rounded bg-white">
                    <UnithaiLogo className="h-7" showText={true} lightBackground={true} />
                  </div>
                  <div>
                    <h1 className="text-base font-black text-blue-950 uppercase tracking-tight">
                      UNITHAI SHIPYARD AND ENGINEERING LTD.
                    </h1>
                    <p className="text-[10px] text-slate-600">
                      Laem Chabang Port, Chonburi 20230 Thailand • Logistics & Materials Division
                    </p>
                  </div>
                </div>
                <h2 className="text-sm font-bold text-[#D81E27] mt-2 uppercase tracking-wider flex items-center gap-2">
                  <span>SPARE PART TRACKING & DELIVERY VOUCHER</span>
                  <span className="text-[10px] text-slate-500 font-normal font-sans">(ใบกำกับและตรวจรับอะไหล่เรือ)</span>
                </h2>
              </div>

              {/* QR Code Simulation & Barcode */}
              <div className="text-right flex flex-col items-end">
                <div className="p-2 border border-slate-300 rounded bg-slate-50 flex items-center justify-center">
                  <QrCode className="w-12 h-12 text-slate-800" />
                </div>
                <span className="text-[9px] font-mono font-bold text-slate-600 mt-1">
                  {part.bookingNo}
                </span>
              </div>
            </div>

            {/* Primary Details Matrix (The 19 Template Fields) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs mb-4 bg-slate-50 p-3 rounded-lg border border-slate-200">
              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">Booking DATE</span>
                <span className="font-mono font-bold text-slate-900">{part.bookingDate}</span>
              </div>
              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">BOOKING NO.</span>
                <span className="font-mono font-bold text-blue-700">{part.bookingNo}</span>
              </div>
              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">P/O NO.</span>
                <span className="font-mono font-bold text-slate-900">{part.po || '-'}</span>
              </div>
              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">AWB / B/L</span>
                <span className="font-mono font-bold text-slate-900">{part.awbBl || '-'}</span>
              </div>

              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">FLIGHT / VESSEL</span>
                <span className="font-medium text-slate-900">{part.flightVessel || '-'}</span>
              </div>
              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">SRM NO.</span>
                <span className="font-mono font-medium text-slate-900">{part.srm || '-'}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">JOB (VESSEL / PROJECT)</span>
                <span className="font-bold text-slate-900">{part.job}</span>
              </div>
            </div>

            {/* Goods Description & Specification */}
            <div className="border border-slate-200 rounded-lg p-3 mb-4">
              <span className="text-[9px] font-semibold text-slate-500 uppercase block mb-1">
                DESCRIPTION OF GOODS (รายละเอียดสิ่งของ / อะไหล่)
              </span>
              <p className="text-xs font-bold text-slate-900 leading-relaxed">
                {part.descriptionOfGoods}
              </p>
              {part.priorityNotes && (
                <div className="mt-2 text-[11px] bg-amber-50 text-amber-900 p-2 rounded border border-amber-200 font-medium">
                  <strong>หมายเหตุ / ข้อความเร่งด่วน:</strong> {part.priorityNotes}
                </div>
              )}
            </div>

            {/* Logistics Parameters Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs mb-4">
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">SHIPPER / SUPPLIER</span>
                <span className="font-medium text-slate-900">{part.shipperSupplier || '-'}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">ORIGIN (FROM)</span>
                <span className="font-medium text-slate-900">{part.from || '-'}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">DESTINATION (TO)</span>
                <span className="font-medium text-slate-900">{part.to || '-'}</span>
              </div>

              <div className="p-2 border border-slate-200 rounded">
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">PACKAGE</span>
                <span className="font-medium text-slate-900">{part.package || '-'}</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">WEIGHT</span>
                <span className="font-mono font-bold text-slate-900">{part.weight.toLocaleString()} kg</span>
              </div>
              <div className="p-2 border border-slate-200 rounded">
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">TERM / TYPE</span>
                <span className="font-semibold text-slate-900">{part.term} • {part.type}</span>
              </div>
            </div>

            {/* Schedule & D/O Milestones */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs mb-6 bg-slate-50 p-2.5 rounded border border-slate-200">
              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">ETD</span>
                <span className="font-mono text-slate-800">{part.etd || '-'}</span>
              </div>
              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">ETA</span>
                <span className="font-mono font-bold text-blue-800">{part.eta || '-'}</span>
              </div>
              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">D/O & OPEN CONTAINER</span>
                <span className="font-mono font-semibold text-amber-800">{part.receiveDoAndOpenContainerDate || '-'}</span>
              </div>
              <div>
                <span className="text-[9px] font-semibold text-slate-500 uppercase block">DELIVERY DATE</span>
                <span className="font-mono font-bold text-emerald-800">{part.deliveryDate || '-'}</span>
              </div>
            </div>

            {/* Current Status Stamp */}
            <div className="flex items-center justify-between p-3 rounded-lg border-2 border-slate-800 bg-slate-100 mb-6">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-600 block">CURRENT STATUS</span>
                <span className="text-sm font-black text-slate-900">
                  {meta.labelTh} ({meta.labelEn})
                </span>
                <div className="text-[10px] text-slate-500 mt-0.5">
                  Yard Location: {part.yardLocation || 'UNITHAI Yard'}
                </div>
              </div>
              <div className="px-3 py-1 rounded bg-slate-900 text-white text-xs font-mono font-bold">
                {part.status}
              </div>
            </div>

            {/* Signatures */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-300 text-center text-xs">
              <div>
                <div className="border-b border-slate-400 h-10 mb-1" />
                <span className="font-semibold text-slate-800">ผู้จัดส่ง / โลจิสติกส์</span>
                <p className="text-[10px] text-slate-500">Logistics Officer</p>
              </div>
              <div>
                <div className="border-b border-slate-400 h-10 mb-1" />
                <span className="font-semibold text-slate-800">เจ้าหน้าที่คลังสินค้า</span>
                <p className="text-[10px] text-slate-500">Warehouse Inspector</p>
              </div>
              <div>
                <div className="border-b border-slate-400 h-10 mb-1" />
                <span className="font-semibold text-slate-800">วิศวกรผู้รับมอบอะไหล่</span>
                <p className="text-[10px] text-slate-500">Project Engineer / Superintendent</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
