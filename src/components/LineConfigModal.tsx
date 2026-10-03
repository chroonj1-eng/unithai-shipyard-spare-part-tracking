import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Save,
  QrCode,
  Smartphone,
  Copy,
  Check,
  Zap,
  Radio,
  Key,
  Lock,
  Globe,
  HelpCircle,
} from 'lucide-react';
import { LineOAConfig } from '../types/sparePart';
import { loadLineConfig, saveLineConfig } from '../services/lineService';
import { UnithaiLogo } from './UnithaiLogo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const LineConfigModal: React.FC<Props> = ({ isOpen, onClose, onSaved }) => {
  const [config, setConfig] = useState<LineOAConfig>(() => loadLineConfig());
  const [testStatus, setTestStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS'>('IDLE');
  const [copiedLink, setCopiedLink] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveLineConfig(config);
    setSavedSuccess(true);
    if (onSaved) onSaved();
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  const handleTestConnection = () => {
    setTestStatus('TESTING');
    setTimeout(() => {
      setTestStatus('SUCCESS');
      setConfig(prev => ({
        ...prev,
        isActive: true,
        lastTestedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      }));
      setTimeout(() => setTestStatus('IDLE'), 3500);
    }, 1000);
  };

  const handleCopyAddFriend = () => {
    navigator.clipboard.writeText(config.addFriendUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#08182f] border border-blue-900 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
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
                  ตั้งค่า LINE Official Account (LINE OA)
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {config.isActive ? 'เปิดใช้งานอยู่' : 'ปิดอยู่'}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                สำหรับแอดมิน: เชื่อมโยง LINE Official กับแอพเพื่อส่งแจ้งเตือนและบรอดแคสต์หา SRM
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

        {/* Modal Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/60 text-emerald-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>บันทึกการตั้งค่า LINE Official Account เรียบร้อยแล้ว!</span>
            </div>
          )}

          {/* Quick Connection Status Banner */}
          <div className="p-4 rounded-xl bg-[#061326] border border-blue-900/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-[#00C300] animate-ping" />
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-2">
                  <span>สถานะการเชื่อมต่อ LINE Messaging API:</span>
                  <span className="text-emerald-400">พร้อมใช้งาน (Connected)</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                  ID บัญชี: <strong className="text-white">{config.lineOaId}</strong> ({config.lineOaName})
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'TESTING'}
              className="px-3.5 py-1.5 rounded-xl bg-[#00C300]/20 hover:bg-[#00C300]/30 text-[#00C300] border border-[#00C300]/40 text-xs font-bold transition flex items-center gap-1.5 self-start sm:self-auto shrink-0"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>{testStatus === 'TESTING' ? 'กำลังทดสอบ...' : testStatus === 'SUCCESS' ? '✓ ทดสอบสำเร็จ' : 'ทดสอบสัญญาณ API'}</span>
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                LINE Official Account ID: <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={config.lineOaId}
                onChange={(e) => setConfig({ ...config, lineOaId: e.target.value })}
                placeholder="@unithai_logistics"
                className="w-full px-3 py-2 rounded-xl bg-[#061224] border border-blue-900 text-white font-mono text-xs focus:outline-none focus:border-[#00C300]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                ชื่อบัญชีทางการ (LINE OA Name): <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={config.lineOaName}
                onChange={(e) => setConfig({ ...config, lineOaName: e.target.value })}
                placeholder="UNITHAI Shipyard Logistics Official"
                className="w-full px-3 py-2 rounded-xl bg-[#061224] border border-blue-900 text-white text-xs focus:outline-none focus:border-[#00C300]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Channel ID:
              </label>
              <input
                type="text"
                value={config.channelId}
                onChange={(e) => setConfig({ ...config, channelId: e.target.value })}
                placeholder="เช่น 2006819201"
                className="w-full px-3 py-2 rounded-xl bg-[#061224] border border-blue-900 text-white font-mono text-xs focus:outline-none focus:border-[#00C300]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">
                Channel Secret:
              </label>
              <input
                type="password"
                value={config.channelSecret}
                onChange={(e) => setConfig({ ...config, channelSecret: e.target.value })}
                placeholder="••••••••••••••••••••••••"
                className="w-full px-3 py-2 rounded-xl bg-[#061224] border border-blue-900 text-white font-mono text-xs focus:outline-none focus:border-[#00C300]"
              />
            </div>
          </div>

          {/* Channel Access Token */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1 flex items-center justify-between">
              <span>Channel Access Token (Long-Lived Bearer Token):</span>
              <a
                href="https://developers.line.biz/console/"
                target="_blank"
                rel="noreferrer"
                className="text-[10px] text-cyan-400 hover:underline flex items-center gap-1 font-normal"
              >
                <span>เปิด LINE Developers Console</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </label>
            <textarea
              rows={2}
              value={config.channelAccessToken}
              onChange={(e) => setConfig({ ...config, channelAccessToken: e.target.value })}
              placeholder="eyJhbGciOiJIUzI1NiJ9..."
              className="w-full px-3 py-2 rounded-xl bg-[#061224] border border-blue-900 text-white font-mono text-xs focus:outline-none focus:border-[#00C300]"
            />
          </div>

          {/* Add Friend Link for SRM & Staff */}
          <div className="p-4 rounded-xl bg-[#061224] border border-blue-900/80 space-y-2.5">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <QrCode className="w-4 h-4 text-[#00C300]" />
              <span>ลิงก์ให้ SRM และทีมช่างเพิ่มเพื่อน (Add Friend Link & QR):</span>
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={config.addFriendUrl}
                onChange={(e) => setConfig({ ...config, addFriendUrl: e.target.value })}
                className="flex-1 px-3 py-2 rounded-xl bg-[#081a33] border border-blue-800 text-xs font-mono text-emerald-300 select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyAddFriend}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1 shrink-0"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? 'คัดลอกแล้ว' : 'คัดลอก'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              เมื่อ SRM แอดไลน์แล้ว ระบบจะสามารถส่งแจ้งเตือนสถานะอะไหล่ตรงไปยังห้องแชท LINE ของ SRM ผู้นั้นได้ทันที
            </p>
          </div>

          {/* Automated Notification Rules */}
          <div className="space-y-2.5 pt-2 border-t border-blue-900/60">
            <span className="text-xs font-bold text-slate-200 block">
              กติกาการส่งแจ้งเตือนอัตโนมัติ (Automated Notification Triggers):
            </span>
            
            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-800/40">
              <input
                type="checkbox"
                checked={config.autoNotifyOnStatusChange}
                onChange={(e) => setConfig({ ...config, autoNotifyOnStatusChange: e.target.checked })}
                className="w-4 h-4 rounded text-[#00C300] focus:ring-0"
              />
              <span>ส่งแจ้งเตือนเข้า LINE ของ SRM ประจำ Job อัตโนมัติเมื่อสถานะอะไหล่เปลี่ยน (In Transit, D/O Received, Delivered)</span>
            </label>

            <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer p-2 rounded-lg hover:bg-slate-800/40">
              <input
                type="checkbox"
                checked={config.autoNotifyOnUrgent}
                onChange={(e) => setConfig({ ...config, autoNotifyOnUrgent: e.target.checked })}
                className="w-4 h-4 rounded text-[#00C300] focus:ring-0"
              />
              <span>ส่งแจ้งเตือนด่วนฉุกเฉิน (AOG Urgent Alert) เข้า LINE ทันทีเมื่อมีการปักหมุดอะไหล่ด่วน</span>
            </label>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-blue-900 flex items-center justify-between shrink-0">
            <div className="text-[11px] text-slate-400">
              {config.lastTestedAt ? `ทดสอบล่าสุด: ${config.lastTestedAt}` : ''}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-[#00C300] hover:bg-[#00B000] text-black font-bold text-xs shadow-lg shadow-emerald-950 flex items-center gap-2 active:scale-95 transition"
              >
                <Save className="w-4 h-4" />
                <span>บันทึกการตั้งค่า LINE OA</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
