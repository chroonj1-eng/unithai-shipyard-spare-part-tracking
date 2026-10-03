import React, { useState } from 'react';
import {
  X,
  Package,
  Calendar,
  Ship,
  Plane,
  Truck,
  Zap,
  Building,
  MapPin,
  Scale,
  FileText,
  AlertCircle,
  BellRing,
  Wand2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SparePart, TransportType, Incoterm, PartStatus } from '../types/sparePart';

interface Props {
  partToEdit?: SparePart | null;
  onClose: () => void;
}

export const SparePartFormModal: React.FC<Props> = ({ partToEdit, onClose }) => {
  const { addSparePart, updateSparePart, language, t } = useApp();

  const isEditing = !!partToEdit;

  // 19 Template Fields
  const [bookingDate, setBookingDate] = useState(partToEdit?.bookingDate || new Date().toISOString().slice(0, 10));
  const [bookingNo, setBookingNo] = useState(partToEdit?.bookingNo || `BK-UT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [po, setPo] = useState(partToEdit?.po || `PO-${new Date().getFullYear()}-${Math.floor(8000 + Math.random() * 1999)}`);
  const [awbBl, setAwbBl] = useState(partToEdit?.awbBl || '');
  const [flightVessel, setFlightVessel] = useState(partToEdit?.flightVessel || '');
  const [srm, setSrm] = useState(partToEdit?.srm || 'สมชาย ศักดิ์ชัย (SRM 1)');
  const [srmEmail, setSrmEmail] = useState(partToEdit?.srmEmail || 'somchai.s@unithai.com');
  const [coSrm, setCoSrm] = useState(partToEdit?.coSrm || 'วรวิทย์ กาญจนา (CO-SRM)');
  const [coSrmEmail, setCoSrmEmail] = useState(partToEdit?.coSrmEmail || 'worawit.k@unithai.com');
  const [inCharge, setInCharge] = useState(partToEdit?.inCharge || 'อนุชา ทองอยู่ (In Charge)');
  const [inChargeEmail, setInChargeEmail] = useState(partToEdit?.inChargeEmail || 'anucha.t@unithai.com');
  const [job, setJob] = useState(partToEdit?.job || 'UT-26-081 MV Ocean Splendor (Drydock 1)');
  const [descriptionOfGoods, setDescriptionOfGoods] = useState(partToEdit?.descriptionOfGoods || '');
  const [shipperSupplier, setShipperSupplier] = useState(partToEdit?.shipperSupplier || '');
  const [fromLocation, setFromLocation] = useState(partToEdit?.from || '');
  const [toLocation, setToLocation] = useState(partToEdit?.to || 'UNITHAI Shipyard Laem Chabang');
  const [pkg, setPkg] = useState(partToEdit?.package || '1 Wooden Crate');
  const [weight, setWeight] = useState<number>(partToEdit?.weight || 150);
  const [etd, setEtd] = useState(partToEdit?.etd || new Date().toISOString().slice(0, 10));
  const [eta, setEta] = useState(partToEdit?.eta || new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10));
  const [receiveDoAndOpenContainerDate, setReceiveDoAndOpenContainerDate] = useState(partToEdit?.receiveDoAndOpenContainerDate || '');
  const [deliveryDate, setDeliveryDate] = useState(partToEdit?.deliveryDate || '');
  const [term, setTerm] = useState<Incoterm>(partToEdit?.term || 'CIF');
  const [type, setType] = useState<TransportType>(partToEdit?.type || 'Air Freight');

  // Metadata
  const [status, setStatus] = useState<PartStatus>(partToEdit?.status || 'BOOKING_CONFIRMED');
  const [isUrgent, setIsUrgent] = useState<boolean>(partToEdit?.isUrgent || false);
  const [priorityNotes, setPriorityNotes] = useState(partToEdit?.priorityNotes || '');
  const [yardLocation, setYardLocation] = useState(partToEdit?.yardLocation || 'Warehouse 2');
  const [sendPushAlert, setSendPushAlert] = useState<boolean>(true);

  // Quick Preset Templates for Shipyard Common Parts
  const applyPreset = (presetType: 'air_urgent' | 'sea_fcl' | 'courier') => {
    if (presetType === 'air_urgent') {
      setType('Air Freight');
      setTerm('DAP');
      setDescriptionOfGoods('Main Engine Piston Crown & Rings (MAN B&W 6S60MC)');
      setShipperSupplier('MAN Energy Solutions Denmark / Singapore');
      setFromLocation('Copenhagen Airport (CPH)');
      setToLocation('UNITHAI Shipyard Laem Chabang, Engine Bay');
      setPkg('2 Wooden Crates (ISPM-15)');
      setWeight(850);
      setFlightVessel('TG951 / B777 Cargo');
      setAwbBl('AWB 217-84910283');
      setIsUrgent(true);
      setStatus('IN_TRANSIT');
      setPriorityNotes('งานซ่อมฉุกเฉินเรือเทียบท่า ต้องตรวจปล่อยด่วนทันทีที่ลงเครื่อง');
    } else if (presetType === 'sea_fcl') {
      setType('Sea Freight FCL');
      setTerm('CIF');
      setDescriptionOfGoods('Steel Plates & Marine Profile Angles (DH36 Grade DNV Class)');
      setShipperSupplier('POSCO Steel Pohang, South Korea');
      setFromLocation('Busan Port, South Korea');
      setToLocation('UNITHAI Shipyard Laem Chabang B4 Quay');
      setPkg('1 x 40ft Flat Rack Container (PCU481920)');
      setWeight(14500);
      setFlightVessel('M/V HYUNDAI FORWARD V.019S');
      setAwbBl('HMM-PUS-9918234');
      setIsUrgent(false);
      setStatus('CUSTOMS_PORT');
      setPriorityNotes('เหล็กแผ่นสำหรับเปลี่ยนผิวท้องเรืออู่แห้ง 2 ตรวจสอบเอกสาร Mill Cert ให้พร้อม');
    } else {
      setType('Courier / Express');
      setTerm('DDP');
      setDescriptionOfGoods('Bridge Radar Magnetron & PCB Control Cards (Furuno FAR-3220)');
      setShipperSupplier('Furuno Electric Co., Ltd. Nishinomiya Japan');
      setFromLocation('Osaka Kansai Airport (KIX)');
      setToLocation('UNITHAI Shipyard Electronics Workshop');
      setPkg('1 Reinforced Carton Box (Electrostatic safe)');
      setWeight(14.5);
      setFlightVessel('FedEx Priority Flight FX5012');
      setAwbBl('FX-7719-2041-99');
      setIsUrgent(true);
      setStatus('IN_TRANSIT');
      setPriorityNotes('อะไหล่อิเล็กทรอนิกส์เดินเรือ ช่างไฟฟ้าต้องเทสต์ก่อนออกทะเล');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bookingNo.trim() || !descriptionOfGoods.trim()) {
      alert('กรุณากรอก Booking No. และ รายละเอียดสินค้า/อะไหล่');
      return;
    }

    const assignedEmails = Array.from(new Set([
      srmEmail.trim().toLowerCase(),
      coSrmEmail.trim().toLowerCase(),
      inChargeEmail.trim().toLowerCase(),
    ].filter(Boolean)));

    if (isEditing && partToEdit) {
      updateSparePart(
        partToEdit.id,
        {
          bookingDate,
          bookingNo,
          po,
          awbBl,
          flightVessel,
          srm,
          srmEmail,
          coSrm,
          coSrmEmail,
          inCharge,
          inChargeEmail,
          assignedEmails,
          job,
          descriptionOfGoods,
          shipperSupplier,
          from: fromLocation,
          to: toLocation,
          package: pkg,
          weight,
          etd,
          eta,
          receiveDoAndOpenContainerDate,
          deliveryDate,
          term,
          type,
          status,
          isUrgent,
          priorityNotes,
          yardLocation,
        },
        sendPushAlert
          ? `อัพเดตข้อมูลบุ๊คกิ้ง ${bookingNo}: สถานะ ${status} (ETA: ${eta})`
          : undefined,
        isUrgent ? 'urgent' : 'normal'
      );
    } else {
      addSparePart({
        bookingDate,
        bookingNo,
        po,
        awbBl,
        flightVessel,
        srm,
        srmEmail,
        coSrm,
        coSrmEmail,
        inCharge,
        inChargeEmail,
        assignedEmails,
        job,
        descriptionOfGoods,
        shipperSupplier,
        from: fromLocation,
        to: toLocation,
        package: pkg,
        weight,
        etd,
        eta,
        receiveDoAndOpenContainerDate,
        deliveryDate,
        term,
        type,
        status,
        isUrgent,
        priorityNotes,
        yardLocation,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {isEditing
                  ? language === 'TH'
                    ? `แก้ไขข้อมูลอะไหล่: ${partToEdit.bookingNo}`
                    : `Edit Spare Part: ${partToEdit.bookingNo}`
                  : language === 'TH'
                  ? 'เพิ่มรายการแจ้งเตือน Spare Part ใหม่'
                  : 'Add New Spare Part Booking'}
              </h3>
              <p className="text-xs text-slate-400">
                {language === 'TH'
                  ? 'กรอกข้อมูลตามเทมเพลตมาตรฐาน 19 หัวข้อของ UNITHAI SHIPYARD'
                  : 'Standard 19-topic logistics template for UNITHAI SHIPYARD'}
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

        {/* Quick Presets (Only when adding) */}
        {!isEditing && (
          <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
              <Wand2 className="w-3.5 h-3.5 text-cyan-400" />
              {language === 'TH' ? 'เติมข้อมูลตัวอย่างด่วน:' : 'Quick Presets:'}
            </span>
            <button
              type="button"
              onClick={() => applyPreset('air_urgent')}
              className="px-2.5 py-1 rounded-md bg-blue-900/40 text-blue-300 border border-blue-800 hover:bg-blue-800/60 whitespace-nowrap transition"
            >
              ✈️ {language === 'TH' ? 'อะไหล่แอร์เร่งด่วน (AOG Piston)' : 'Air Urgent AOG'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('sea_fcl')}
              className="px-2.5 py-1 rounded-md bg-cyan-900/40 text-cyan-300 border border-cyan-800 hover:bg-cyan-800/60 whitespace-nowrap transition"
            >
              🚢 {language === 'TH' ? 'ตู้คอนเทนเนอร์เหล็กแผ่น (FCL Steel)' : 'Sea Freight FCL Container'}
            </button>
            <button
              type="button"
              onClick={() => applyPreset('courier')}
              className="px-2.5 py-1 rounded-md bg-amber-900/40 text-amber-300 border border-amber-800 hover:bg-amber-800/60 whitespace-nowrap transition"
            >
              ⚡ {language === 'TH' ? 'พัสดุด่วนอิเล็กทรอนิกส์ (Radar PCB)' : 'Express Courier'}
            </button>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Section 1: Core Identifiers (Booking Date, Booking No, PO, AWB/BL, SRM, Job) */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>1. ข้อมูลเอกสาร & การระบุตัวตน (Identifiers & Booking)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  Booking DATE <span className="text-rose-400">*</span>
                </label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  BOOKING NO. <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={bookingNo}
                  onChange={(e) => setBookingNo(e.target.value)}
                  placeholder="เช่น BK-UT-2026-0901"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  P/O (Purchase Order)
                </label>
                <input
                  type="text"
                  value={po}
                  onChange={(e) => setPo(e.target.value)}
                  placeholder="เช่น PO-2026-8812"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  AWB/BL (Air Waybill / Bill of Lading)
                </label>
                <input
                  type="text"
                  value={awbBl}
                  onChange={(e) => setAwbBl(e.target.value)}
                  placeholder="เช่น AWB 020-94812041 หรือ ONE-BKK-99201"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  SRM (SRM Number)
                </label>
                <input
                  type="text"
                  value={srm}
                  onChange={(e) => setSrm(e.target.value)}
                  placeholder="เช่น SRM-44910"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  JOB (รหัสงาน / เรือซ่อม) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  value={job}
                  onChange={(e) => setJob(e.target.value)}
                  placeholder="เช่น UT-26-081 MV Ocean Splendor"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-medium"
                  required
                />
              </div>

              {/* Team Assignment for Scoped User Access */}
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 pt-2 border-t border-slate-800">
                <span className="text-[11px] font-bold text-amber-400 block mb-2">
                  👥 มอบหมายผู้รับผิดชอบ Job (SRM, CO-SRM, IN CHARGE เพื่อจำกัดสิทธิ์การมองเห็นเฉพาะงาน):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                    <label className="block text-[11px] font-bold text-blue-300">1. SRM (Ship Repair Manager)</label>
                    <input
                      type="text"
                      value={srm}
                      onChange={(e) => setSrm(e.target.value)}
                      placeholder="ชื่อ SRM เช่น สมชาย ศักดิ์ชัย"
                      className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                    <input
                      type="email"
                      value={srmEmail}
                      onChange={(e) => setSrmEmail(e.target.value)}
                      placeholder="อีเมล เช่น somchai.s@unithai.com"
                      className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-blue-300 text-xs font-mono"
                    />
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                    <label className="block text-[11px] font-bold text-amber-300">2. CO-SRM (ผู้ช่วย SRM)</label>
                    <input
                      type="text"
                      value={coSrm}
                      onChange={(e) => setCoSrm(e.target.value)}
                      placeholder="ชื่อ CO-SRM เช่น วรวิทย์ กาญจนา"
                      className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                    <input
                      type="email"
                      value={coSrmEmail}
                      onChange={(e) => setCoSrmEmail(e.target.value)}
                      placeholder="อีเมล เช่น worawit.k@unithai.com"
                      className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-amber-200 text-xs font-mono"
                    />
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 space-y-1.5">
                    <label className="block text-[11px] font-bold text-emerald-300">3. IN CHARGE (วิศวกรผู้ควบคุม)</label>
                    <input
                      type="text"
                      value={inCharge}
                      onChange={(e) => setInCharge(e.target.value)}
                      placeholder="ชื่อ In Charge เช่น อนุชา ทองอยู่"
                      className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-white text-xs"
                    />
                    <input
                      type="email"
                      value={inChargeEmail}
                      onChange={(e) => setInChargeEmail(e.target.value)}
                      placeholder="อีเมล เช่น anucha.t@unithai.com"
                      className="w-full px-2.5 py-1.5 rounded bg-slate-950 border border-slate-700 text-emerald-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Goods & Transport (Description, Shipper, Flight/Vessel, From, To, Package, Weight) */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Package className="w-4 h-4" />
              <span>2. รายละเอียดสินค้า & เส้นทางขนส่ง (Goods & Routing)</span>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  DESCRIPTION OF GOODS (ชื่อและรายละเอียดอะไหล่) <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={2}
                  value={descriptionOfGoods}
                  onChange={(e) => setDescriptionOfGoods(e.target.value)}
                  placeholder="เช่น Main Engine Exhaust Valve Spindle & Seat Rings (Wärtsilä 6L50DF)"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    SHIPPER/SUPPLIER (ผู้ส่ง / ซัพพลายเออร์)
                  </label>
                  <input
                    type="text"
                    value={shipperSupplier}
                    onChange={(e) => setShipperSupplier(e.target.value)}
                    placeholder="เช่น Wärtsilä Services AG, MAN Energy"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    FLIGHT / VESSEL (เที่ยวบิน / ชื่อเรือขนส่ง)
                  </label>
                  <input
                    type="text"
                    value={flightVessel}
                    onChange={(e) => setFlightVessel(e.target.value)}
                    placeholder="เช่น TG921 / B777 หรือ M/V ONE HONOLULU"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    PACKAGE (ลักษณะหีบห่อ)
                  </label>
                  <input
                    type="text"
                    value={pkg}
                    onChange={(e) => setPkg(e.target.value)}
                    placeholder="เช่น 2 Wooden Crates, 4 Pallets, 1 Container"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    FROM (ต้นทาง)
                  </label>
                  <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    placeholder="เช่น Zurich Airport (ZRH), Kobe Port"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    TO (ปลายทาง)
                  </label>
                  <input
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    placeholder="UNITHAI Shipyard Laem Chabang"
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 mb-1 font-medium">
                    WEIGHT (kg) (น้ำหนัก กิโลกรัม)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={weight}
                    onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Milestones & Logistics Terms (ETD, ETA, D/O Date, Delivery Date, TERM, TYPE) */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
              <Calendar className="w-4 h-4" />
              <span>3. กำหนดการส่งมอบ & เงื่อนไข (Schedule, DO, Term & Type)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  ETD (Estimated Departure)
                </label>
                <input
                  type="date"
                  value={etd}
                  onChange={(e) => setEtd(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium text-cyan-300">
                  ETA (Estimated Arrival) <span className="text-rose-400">*</span>
                </label>
                <input
                  type="date"
                  value={eta}
                  onChange={(e) => setEta(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-cyan-500/50 text-white focus:outline-none focus:border-cyan-400 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium text-amber-300">
                  RECIEVE D/O AND OPEN CONTAINER DATE
                </label>
                <input
                  type="date"
                  value={receiveDoAndOpenContainerDate}
                  onChange={(e) => setReceiveDoAndOpenContainerDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium text-emerald-300">
                  DELIVERY DATE (ส่งมอบเข้าอู่เรือ)
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-emerald-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  TERM (Incoterms)
                </label>
                <select
                  value={term}
                  onChange={(e) => setTerm(e.target.value as Incoterm)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-mono"
                >
                  <option value="FOB">FOB (Free on Board)</option>
                  <option value="CIF">CIF (Cost, Insurance & Freight)</option>
                  <option value="EXW">EXW (Ex Works)</option>
                  <option value="DDP">DDP (Delivered Duty Paid)</option>
                  <option value="DAP">DAP (Delivered at Place)</option>
                  <option value="CFR">CFR (Cost and Freight)</option>
                  <option value="FCA">FCA (Free Carrier)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  TYPE (ประเภทการขนส่ง)
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as TransportType)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Air Freight">✈️ Air Freight (ทางอากาศ)</option>
                  <option value="Sea Freight FCL">🚢 Sea Freight FCL (ตู้คอนเทนเนอร์เต็มตู้)</option>
                  <option value="Sea Freight LCL">📦 Sea Freight LCL (สินค้าไม่เต็มตู้)</option>
                  <option value="Courier / Express">⚡ Courier / Express (พัสดุด่วน)</option>
                  <option value="Land Freight">🚛 Land Freight (ทางบก/รถบรรทุก)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Operational Status & Push Alert Broadcast Option */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <BellRing className="w-4 h-4" />
              <span>4. สถานะงาน & การแจ้งเตือนพุช (Status & Push Notification)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  สถานะการดำเนินงาน (Status)
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as PartStatus)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400 font-semibold"
                >
                  <option value="BOOKING_CONFIRMED">จองขนส่งแล้ว (Booking Confirmed)</option>
                  <option value="IN_TRANSIT">กำลังเดินทาง (In Transit)</option>
                  <option value="CUSTOMS_PORT">ถึงท่าเรือ/สนามบิน รอตรวจปล่อย (Port / Customs)</option>
                  <option value="DO_RECEIVED">รับ D/O & เปิดตู้คอนเทนเนอร์แล้ว (DO Received & Opened)</option>
                  <option value="OUT_FOR_DELIVERY">กำลังจัดส่งเข้าอู่เรือ (Out for Delivery)</option>
                  <option value="DELIVERED">ส่งมอบเข้าอู่เรือแล้ว (Delivered to Yard)</option>
                  <option value="URGENT_HOLD">เร่งด่วน / ติดปัญหา (Urgent / Hold)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-medium">
                  ตำแหน่งจัดส่งในอู่เรือ (Yard Location)
                </label>
                <input
                  type="text"
                  value={yardLocation}
                  onChange={(e) => setYardLocation(e.target.value)}
                  placeholder="เช่น Drydock #1, Warehouse 2, Quay 3"
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-500 focus:ring-rose-400 border-slate-700 bg-slate-900"
                  />
                  <span className="text-rose-400 font-bold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    ทำเครื่องหมายเป็นงานอะไหล่ด่วนฉุกเฉิน (Urgent Part)
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1 text-xs font-medium">
                บันทึกการส่งมอบ / ข้อความสั่งการเพิ่มเติม
              </label>
              <input
                type="text"
                value={priorityNotes}
                onChange={(e) => setPriorityNotes(e.target.value)}
                placeholder="เช่น รอช่างเครื่องกลมารับชิ้นส่วนที่คลัง 2 พร้อมใบเบิก"
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="pt-2 border-t border-slate-800">
              <label className="flex items-center gap-2 cursor-pointer bg-blue-950/40 p-3 rounded-lg border border-blue-800/40">
                <input
                  type="checkbox"
                  checked={sendPushAlert}
                  onChange={(e) => setSendPushAlert(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-400 focus:ring-cyan-400 border-slate-700 bg-slate-900"
                />
                <div>
                  <span className="text-cyan-300 font-bold text-xs flex items-center gap-1.5">
                    <BellRing className="w-4 h-4" />
                    {t.instantPushCheck}
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {t.instantPushDesc}
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-teal-400 text-white text-xs font-bold shadow-lg shadow-cyan-500/20 transition active:scale-95 flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>{isEditing ? t.save : t.saveAndNotify}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
