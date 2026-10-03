import React, { useState } from 'react';
import {
  X,
  Download,
  Smartphone,
  Laptop,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  QrCode,
  ShieldCheck,
  Share2,
  PlusSquare,
  ArrowRight,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { UnithaiLogo } from './UnithaiLogo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const AppInstallModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [copied, setCopied] = useState(false);
  const [activePlatform, setActivePlatform] = useState<'ANDROID' | 'IOS' | 'DESKTOP'>('ANDROID');

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';
  // Public URL that can be opened on phone
  const directAppUrl = 'https://ais-pre-yawqseyikckzgegt32ykkx-780430525371.asia-southeast1.run.app';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directAppUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleTriggerInstall = async () => {
    if (isInstallable) {
      await install();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#08182f] border border-blue-900 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        
        {/* Tricolor Ribbon on top */}
        <div className="h-1.5 w-full flex shrink-0">
          <div className="h-full flex-1 bg-[#D81E27]" />
          <div className="h-full flex-1 bg-white" />
          <div className="h-full flex-1 bg-[#004B9B]" />
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-[#07162b] border-b border-blue-900/80 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white p-1 border border-slate-200 flex items-center justify-center shadow-md shrink-0">
              <img
                src="/unithai-logo-emblem.png"
                alt="UNITHAI App Icon"
                className="w-10 h-10 object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                  ดาวน์โหลด & ติดตั้งแอป UNITHAI
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase">
                  PWA Ready
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                ติดตั้งลงบนหน้าจอมือถือ (Android / iOS) และคอมพิวเตอร์ เพื่อใช้งานเหมือนแอปจริง
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
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Direct Install One-Click Banner (if browser prompt is ready) */}
          {isInstallable && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-900/60 to-emerald-900/60 border border-emerald-500/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-emerald-400" />
                  <span>เบราว์เซอร์ของคุณพร้อมติดตั้งทันที!</span>
                </h3>
                <p className="text-xs text-slate-200 mt-1">
                  คลิกปุ่มเพื่อดาวน์โหลดและเพิ่มไอคอนแอพ UNITHAI ลงในเครื่องของคุณได้เลย
                </p>
              </div>
              <button
                onClick={handleTriggerInstall}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-900/40 flex items-center gap-2 transition active:scale-95 shrink-0"
              >
                <Download className="w-4 h-4" />
                <span>คลิกติดตั้งลงเครื่องทันที</span>
              </button>
            </div>
          )}

          {/* Quick Link & Direct Open Box */}
          <div className="p-4 rounded-xl bg-[#061224] border border-blue-900/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span>ลิงก์เข้าใช้งานแอปโดยตรง (เปิดบนเบราว์เซอร์มือถือ):</span>
              </span>
              <a
                href={directAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                <span>เปิดในแท็บใหม่</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={directAppUrl}
                className="flex-1 px-3 py-2 rounded-xl bg-[#091b36] border border-blue-800 text-xs font-mono text-blue-200 select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`px-3 py-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition ${
                  copied
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : 'bg-blue-900/40 border-blue-700 text-slate-200 hover:bg-blue-800/50'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}</span>
              </button>
            </div>
          </div>

          {/* Platform Tab Switcher */}
          <div>
            <div className="flex rounded-xl bg-[#061326] p-1 border border-blue-900/60 mb-3 text-xs font-bold">
              <button
                onClick={() => setActivePlatform('ANDROID')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activePlatform === 'ANDROID'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4 text-emerald-400" />
                <span>Android (Chrome)</span>
              </button>
              <button
                onClick={() => setActivePlatform('IOS')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activePlatform === 'IOS'
                    ? 'bg-[#D81E27] text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4 text-slate-200" />
                <span>iPhone / iPad (iOS)</span>
              </button>
              <button
                onClick={() => setActivePlatform('DESKTOP')}
                className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition ${
                  activePlatform === 'DESKTOP'
                    ? 'bg-blue-950 text-white border border-blue-600 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span>คอมพิวเตอร์ (PC / Mac)</span>
              </button>
            </div>

            {/* Platform Guides */}
            {activePlatform === 'ANDROID' && (
              <div className="p-4 rounded-xl bg-[#071933] border border-blue-800 space-y-3 animate-in fade-in duration-150">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">🤖</span>
                  <span>วิธีติดตั้งลงบนมือถือ Android (Google Chrome):</span>
                </h4>
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-[#051122]">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                    <span>เปิดลิงก์แอปบน <strong>Google Chrome</strong> ในมือถือของคุณ</span>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-[#051122]">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                    <span>แตะปุ่ม <strong>"ติดตั้งแอพ" (Install)</strong> ที่มุมบน หรือแตะเมนู <strong>จุด 3 จุด (⋮)</strong> มุมขวาบน</span>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-[#051122]">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                    <span>เลือก <strong>"ติดตั้งแอป" (Install app)</strong> หรือ <strong>"เพิ่มลงในหน้าจอหลัก" (Add to Home screen)</strong></span>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-[#051122]">
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">✓</span>
                    <span className="text-emerald-300">ไอคอนแอป UNITHAI จะปรากฏบนหน้าจอมือถือ พร้อมใช้งานแบบเต็มหน้าจอและรับการแจ้งเตือนพุชได้ตลอดเวลา!</span>
                  </div>
                </div>
              </div>
            )}

            {activePlatform === 'IOS' && (
              <div className="p-4 rounded-xl bg-[#071933] border border-blue-800 space-y-3 animate-in fade-in duration-150">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center text-[10px]">🍏</span>
                  <span>วิธีติดตั้งลงบน iPhone / iPad (Safari):</span>
                </h4>
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-[#051122]">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                    <span>เปิดลิงก์แอปบนเบราว์เซอร์ <strong>Safari</strong> ใน iPhone หรือ iPad</span>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-[#051122]">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                    <span>แตะปุ่ม <strong>แชร์ (Share)</strong> สี่เหลี่ยมลูกศรชี้ขึ้น ที่แถบล่างสุดของหน้าจอ</span>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-[#051122]">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                    <span>เลื่อนลงมาแล้วแตะเลือก <strong>"เพิ่มไปยังหน้าจอโฮม" (Add to Home Screen)</strong></span>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-[#051122]">
                    <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">4</span>
                    <span>แตะปุ่ม <strong>"เพิ่ม" (Add)</strong> มุมขวาบน เพื่อสร้างไอคอนแอป UNITHAI บนหน้าจอโฮม</span>
                  </div>
                </div>
              </div>
            )}

            {activePlatform === 'DESKTOP' && (
              <div className="p-4 rounded-xl bg-[#071933] border border-blue-800 space-y-3 animate-in fade-in duration-150">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-cyan-400" />
                  <span>วิธีติดตั้งลงบนคอมพิวเตอร์ (Windows PC / Mac):</span>
                </h4>
                <div className="space-y-2.5 text-xs text-slate-300">
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-[#051122]">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">1</span>
                    <span>เปิดแอปบน <strong>Google Chrome</strong> หรือ <strong>Microsoft Edge</strong></span>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-[#051122]">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">2</span>
                    <span>มองหาไอคอนรูป <strong>คอมพิวเตอร์พร้อมลูกศรดาวน์โหลด</strong> ที่ช่องพิมพ์ URL (Address Bar) ด้านขวาบน</span>
                  </div>
                  <div className="flex items-start gap-3 p-2 rounded-lg bg-[#051122]">
                    <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">3</span>
                    <span>คลิก <strong>"ติดตั้ง" (Install)</strong> เพื่อเปิดเป็นหน้าต่างโปรแกรมแยกเฉพาะ ไม่มีแถบเบราว์เซอร์กวนใจ</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Benefits summary list */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[11px] text-slate-300">
            <div className="p-2.5 rounded-xl bg-[#061224] border border-blue-900/60 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>เปิดใช้งานได้แม้อยู่ในจุดอับสัญญาณ (Offline Cache)</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#061224] border border-blue-900/60 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-red-400 shrink-0" />
              <span>รับการแจ้งเตือนพุชเมื่ออะไหล่ถึงท่าเรือหรือมีงานด่วน</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#061224] border border-blue-900/60 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
              <span>เปิดทำงานเต็มหน้าจอ สวยงาม เร็วเหมือน Native App</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#061224] border-t border-blue-950 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-400">
            UNITHAI Shipyard & Engineering • PWA Standalone Ready
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
          >
            ปิดหน้าต่าง
          </button>
        </div>

      </div>
    </div>
  );
};
