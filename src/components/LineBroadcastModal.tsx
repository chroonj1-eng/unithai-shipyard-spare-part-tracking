import React, { useState } from 'react';
import {
  X,
  Send,
  MessageSquare,
  Users,
  AlertTriangle,
  CheckCircle2,
  Package,
  Radio,
  History,
  Sparkles,
  Smartphone,
  ExternalLink,
  ChevronDown,
  Layers,
  Ship,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SparePart, UserProfile, LineBroadcastLog } from '../types/sparePart';
import {
  loadLineConfig,
  loadLineBroadcastLogs,
  sendLineBroadcastOrPush,
  buildLineFlexBubble,
} from '../services/lineService';
import { loadRegisteredUsers } from '../utils/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialPart?: SparePart | null;
}

export const LineBroadcastModal: React.FC<Props> = ({ isOpen, onClose, initialPart }) => {
  const { spareParts, currentUser, language } = useApp();

  const [activeTab, setActiveTab] = useState<'COMPOSE' | 'HISTORY'>('COMPOSE');
  const [logs, setLogs] = useState<LineBroadcastLog[]>(() => loadLineBroadcastLogs());

  // Form states
  const [targetType, setTargetType] = useState<'ALL_FRIENDS' | 'ALL_SRMS' | 'JOB_SPECIFIC' | 'DIRECT_USER'>('JOB_SPECIFIC');
  const [selectedJob, setSelectedJob] = useState<string>(initialPart?.job || 'UT-26-081 MV Ocean Splendor (Drydock 1)');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedPartId, setSelectedPartId] = useState<string>(initialPart?.id || '');

  const [title, setTitle] = useState(
    initialPart ? `แจ้งเตือนสถานะอะไหล่ ${initialPart.bookingNo}` : 'แจ้งเตือนสถานะอะไหล่เรือเข้าอู่'
  );
  const [message, setMessage] = useState(
    initialPart
      ? `อะไหล่ ${initialPart.descriptionOfGoods} สำหรับเรือ ${initialPart.job} สถานะปัจจุบัน: ${initialPart.status} (กำหนดส่งมอบ ETA: ${initialPart.eta})`
      : 'เรียน SRM และวิศวกรผู้ควบคุมงาน ตรวจสอบการส่งมอบพัสดุและอะไหล่ประจำวันได้ในระบบ'
  );
  const [isUrgent, setIsUrgent] = useState(initialPart?.isUrgent || false);

  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; recipientCount: number } | null>(null);

  const allUsers = loadRegisteredUsers();
  const config = loadLineConfig();

  if (!isOpen) return null;

  // Unique Jobs list
  const uniqueJobs = Array.from(new Set(spareParts.map((p) => p.job)));

  // Filtered users for Job
  const targetJobUsers = allUsers.filter(u =>
    u.assignedJobs?.some(j => j.toLowerCase().includes(selectedJob.toLowerCase()) || selectedJob.toLowerCase().includes(j.toLowerCase()))
  );

  const handleSelectPart = (partId: string) => {
    setSelectedPartId(partId);
    if (!partId) return;

    const part = spareParts.find((p) => p.id === partId);
    if (!part) return;

    setSelectedJob(part.job);
    setIsUrgent(Boolean(part.isUrgent));
    setTitle(part.isUrgent ? `🚨 แจ้งเตือนอะไหล่ด่วนฉุกเฉิน (${part.bookingNo})` : `📦 อัพเดตสถานะอะไหล่ (${part.bookingNo})`);
    setMessage(
      `เรือ: ${part.job}\nรายการ: ${part.descriptionOfGoods}\nสถานะ: ${part.status}\nกำหนดส่งมอบ (ETA): ${part.eta}\nผู้รับผิดชอบ SRM: ${part.srm || '-'}`
    );
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendResult(null);

    const targetUser = targetType === 'DIRECT_USER'
      ? allUsers.find(u => u.email === selectedUserId)
      : undefined;

    const res = await sendLineBroadcastOrPush({
      targetType,
      title,
      message,
      targetJob: targetType === 'JOB_SPECIFIC' ? selectedJob : undefined,
      targetUser,
      isUrgent,
      senderName: currentUser?.name || 'Admin Logistics',
      allUsers,
      bookingNo: selectedPartId ? spareParts.find(p => p.id === selectedPartId)?.bookingNo : undefined,
    });

    setIsSending(false);
    setSendResult(res);
    setLogs(loadLineBroadcastLogs());

    if (res.success) {
      setTimeout(() => {
        setSendResult(null);
      }, 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#08182f] border border-blue-900 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* LINE Green Top Ribbon */}
        <div className="h-1.5 w-full bg-[#00C300]" />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#07162b] border-b border-blue-900 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00C300]/20 border border-[#00C300]/40 flex items-center justify-center text-[#00C300] font-black text-sm">
              LINE
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  ศูนย์ส่งบรอดแคสต์ LINE Official Account
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {config.lineOaId}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                ส่งข้อความแจ้งเตือนสถานะอะไหล่ตรงเข้า LINE ของ SRM ประจำ Job หรือบรอดแคสต์หาทุกคน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-[#061224] p-0.5 border border-blue-900 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('COMPOSE')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  activeTab === 'COMPOSE' ? 'bg-[#00C300] text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                สร้างข้อความ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('HISTORY')}
                className={`px-3 py-1 rounded-md font-semibold transition ${
                  activeTab === 'HISTORY' ? 'bg-[#00C300] text-black' : 'text-slate-400 hover:text-white'
                }`}
              >
                ประวัติการส่ง ({logs.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
          {sendResult && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>
                  ส่งแจ้งเตือนเข้า LINE สำเร็จเรียบร้อยแล้ว! (ส่งถึง {sendResult.recipientCount} ผู้รับ)
                </span>
              </div>
              <span className="text-[11px] font-mono text-emerald-300">Active Delivered</span>
            </div>
          )}

          {activeTab === 'COMPOSE' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Form Controls Column (7 cols) */}
              <form onSubmit={handleSend} className="lg:col-span-7 space-y-4">
                
                {/* 1. Quick Select From Existing Spare Part */}
                <div className="p-3 rounded-xl bg-[#061224] border border-blue-900/80 space-y-2">
                  <label className="block text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ดึงข้อมูลจากรายการอะไหล่ในระบบ (Auto-Fill):</span>
                  </label>
                  <select
                    value={selectedPartId}
                    onChange={(e) => handleSelectPart(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#091b36] border border-blue-800 text-white text-xs focus:outline-none focus:border-[#00C300]"
                  >
                    <option value="">-- พิมพ์ข้อความอิสระ หรือเลือกอะไหล่ --</option>
                    {spareParts.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.bookingNo} • {p.job} ({p.status})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Target Recipients Scope */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    กลุ่มเป้าหมายผู้รับใน LINE (Recipient Scope) <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setTargetType('JOB_SPECIFIC')}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        targetType === 'JOB_SPECIFIC'
                          ? 'bg-blue-600/20 border-[#00C300] text-white font-bold'
                          : 'bg-[#061224] border-blue-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-white">🎯 SRM ประจำ Job</div>
                      <div className="text-[10px] text-slate-400">ส่งเฉพาะ SRM & In Charge ของ Job นั้น</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetType('ALL_SRMS')}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        targetType === 'ALL_SRMS'
                          ? 'bg-blue-600/20 border-[#00C300] text-white font-bold'
                          : 'bg-[#061224] border-blue-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-white">⚓ SRM ทั้งหมด</div>
                      <div className="text-[10px] text-slate-400">ส่งถึง SRM และ CO-SRM ทุกลำ</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetType('ALL_FRIENDS')}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        targetType === 'ALL_FRIENDS'
                          ? 'bg-blue-600/20 border-[#00C300] text-white font-bold'
                          : 'bg-[#061224] border-blue-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-white">📢 บรอดแคสต์ทุกคน</div>
                      <div className="text-[10px] text-slate-400">ส่งถึงเพื่อนทุกคนใน LINE OA</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTargetType('DIRECT_USER')}
                      className={`p-2.5 rounded-xl border text-left transition ${
                        targetType === 'DIRECT_USER'
                          ? 'bg-blue-600/20 border-[#00C300] text-white font-bold'
                          : 'bg-[#061224] border-blue-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="text-white">👤 ระบุคนเดียว</div>
                      <div className="text-[10px] text-slate-400">ส่งตรงหารายบุคคลที่เลือก</div>
                    </button>
                  </div>
                </div>

                {/* Sub-selector for Job */}
                {targetType === 'JOB_SPECIFIC' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      เลือกโครงการ / เรือเป้าหมาย:
                    </label>
                    <select
                      value={selectedJob}
                      onChange={(e) => setSelectedJob(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#061224] border border-blue-900 text-white text-xs focus:outline-none focus:border-[#00C300]"
                    >
                      {uniqueJobs.map((j) => (
                        <option key={j} value={j}>{j}</option>
                      ))}
                    </select>
                    <span className="text-[10px] text-emerald-300 mt-1 block">
                      ✓ ผู้ที่จะได้รับ: {targetJobUsers.map(u => `${u.name} (${u.position})`).join(', ') || 'ผู้รับผิดชอบโครงการ'}
                    </span>
                  </div>
                )}

                {/* Sub-selector for Individual user */}
                {targetType === 'DIRECT_USER' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      เลือกผู้รับ:
                    </label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#061224] border border-blue-900 text-white text-xs focus:outline-none focus:border-[#00C300]"
                    >
                      <option value="">-- เลือก SRM / In Charge --</option>
                      {allUsers.map((u) => (
                        <option key={u.email} value={u.email}>
                          {u.name} ({u.position}) • {u.lineDisplayName ? `LINE: ${u.lineDisplayName}` : u.email}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    หัวข้อการแจ้งเตือน (LINE Title):
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="เช่น 🚨 แจ้งเตือนอะไหล่ด่วนพิเศษ หรือ 📦 ตรวจรับของแล้ว"
                    className="w-full px-3 py-2 rounded-xl bg-[#061224] border border-blue-900 text-white text-xs focus:outline-none focus:border-[#00C300]"
                  />
                </div>

                {/* Message Body */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    เนื้อหาข้อความ (Message Content):
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="พิมพ์รายละเอียดที่ต้องการแจ้งเตือน..."
                    className="w-full px-3 py-2 rounded-xl bg-[#061224] border border-blue-900 text-white text-xs focus:outline-none focus:border-[#00C300]"
                  />
                </div>

                {/* Urgent Switch */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-[#061224] border border-blue-900">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${isUrgent ? 'text-red-500' : 'text-slate-500'}`} />
                    <div>
                      <span className="text-xs font-bold text-white block">
                        กำหนดเป็นแจ้งเตือนด่วนพิเศษ (Urgent Push)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        การ์ดใน LINE จะเปลี่ยนเป็นแถบสีแดงเพื่อเตือนภัยฉุกเฉิน
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                    className="w-5 h-5 rounded text-red-600 focus:ring-0"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 rounded-xl bg-[#00C300] hover:bg-[#00B000] text-black font-black text-xs shadow-lg shadow-emerald-950/40 flex items-center justify-center gap-2 active:scale-95 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? 'กำลังบรอดแคสต์เข้า LINE...' : '🚀 ยืนยันส่งบรอดแคสต์เข้า LINE ทันที'}</span>
                </button>
              </form>

              {/* Live LINE Flex Message Chat Bubble Preview (5 cols) */}
              <div className="lg:col-span-5 flex flex-col">
                <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-[#00C300]" />
                  <span>ตัวอย่างข้อความจริงในแชท LINE (Live Preview):</span>
                </div>

                {/* Mock Phone / Chat Window */}
                <div className="bg-[#8C9DAE] p-3 rounded-2xl border-2 border-slate-700 shadow-xl flex-1 flex flex-col justify-start">
                  
                  {/* LINE OA Header bar inside chat */}
                  <div className="bg-[#1E2327] text-white p-2 rounded-xl mb-3 flex items-center justify-between text-[11px] shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-[#00C300] flex items-center justify-center text-[10px] font-bold text-black">
                        L
                      </div>
                      <span className="font-bold truncate max-w-[140px]">{config.lineOaName}</span>
                    </div>
                    <span className="text-[9px] text-emerald-400 font-mono">Official</span>
                  </div>

                  {/* LINE Flex Message Card (White Bubble) */}
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden text-slate-800 text-xs animate-in zoom-in-95 duration-150">
                    
                    {/* Header */}
                    <div className={`p-3.5 text-white ${isUrgent ? 'bg-[#D81E27]' : 'bg-[#07172c]'}`}>
                      <div className="text-[9px] font-bold tracking-wider opacity-90 uppercase">
                        UNITHAI SHIPYARD & ENGINEERING
                      </div>
                      <div className="text-sm font-black mt-0.5 flex items-center gap-1">
                        {isUrgent && <span>🚨</span>}
                        <span>{title || 'แจ้งเตือนสถานะอะไหล่'}</span>
                      </div>
                      <div className="text-[10px] opacity-80 mt-0.5">
                        {targetType === 'JOB_SPECIFIC' ? selectedJob : 'Shipyard Material Logistics'}
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-3.5 space-y-2 bg-slate-50">
                      <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed">
                        {message}
                      </div>

                      <div className="pt-2 border-t border-slate-200 grid grid-cols-2 gap-2 text-[10px]">
                        <div>
                          <span className="text-slate-400 block font-semibold">โครงการ / เรือ:</span>
                          <span className="font-bold text-slate-800 truncate block">
                            {targetType === 'JOB_SPECIFIC' ? selectedJob.split(' ')[0] : 'All Shipyard Jobs'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold">สถานะการส่ง:</span>
                          <span className={`font-bold ${isUrgent ? 'text-red-600' : 'text-emerald-600'}`}>
                            {isUrgent ? 'ด่วนพิเศษ (Urgent)' : 'ปกติ (Normal)'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer Button (Official LINE Green) */}
                    <div className="p-2.5 bg-white border-t border-slate-100">
                      <div className="w-full py-2 bg-[#00C300] hover:bg-[#00B000] text-white font-bold text-center rounded-xl shadow-sm text-xs cursor-pointer select-none">
                        ดูรายละเอียดในระบบ UNITHAI
                      </div>
                    </div>

                  </div>

                  <div className="text-right text-[10px] text-slate-700 mt-1 mr-1">
                    12:30 น. • อ่านแล้ว
                  </div>

                </div>
              </div>

            </div>
          )}

          {activeTab === 'HISTORY' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>บันทึกการส่งบรอดแคสต์ทั้งหมด ({logs.length} รายการ):</span>
              </div>

              {logs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs">
                  ยังไม่มีประวัติการส่งบรอดแคสต์
                </div>
              ) : (
                logs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl bg-[#061224] border border-blue-900/80 hover:border-blue-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {log.isUrgent ? (
                          <span className="px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/40 text-[10px] font-bold">
                            🚨 ด่วน
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold">
                            ✓ ปกติ
                          </span>
                        )}
                        <span className="font-bold text-white text-sm">{log.title}</span>
                      </div>
                      <p className="text-slate-300 text-xs">{log.message}</p>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span>เป้าหมาย: <strong className="text-blue-300">{log.targetJob || log.targetType}</strong></span>
                        <span>•</span>
                        <span>ผู้ส่ง: {log.sentBy}</span>
                      </div>
                    </div>

                    <div className="sm:text-right shrink-0">
                      <div className="text-xs font-bold text-emerald-400 font-mono">
                        ส่งถึง {log.recipientCount} คน
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {log.sentAt}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#061224] border-t border-blue-950 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400">
            UNITHAI Shipyard Logistics • LINE Messaging API
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
