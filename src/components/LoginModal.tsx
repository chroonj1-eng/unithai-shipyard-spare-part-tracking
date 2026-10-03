import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  HardHat,
  UserCheck,
  Mail,
  ChevronRight,
  Anchor,
  Check,
  Building2,
  Users,
  Briefcase,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProfile, AuthRole, JobPosition } from '../types/sparePart';
import { DEFAULT_USERS } from '../data/initialData';
import { UnithaiLogo } from './UnithaiLogo';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { currentUser, login, language } = useApp();

  const [activeTab, setActiveTab] = useState<'QUICK' | 'CUSTOM'>('QUICK');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState<AuthRole>('USER');
  const [customPosition, setCustomPosition] = useState<JobPosition>('IN_CHARGE');
  const [customDepartment, setCustomDepartment] = useState('Ship Repair Operations');
  const [customJob, setCustomJob] = useState('UT-26-081 MV Ocean Splendor (Drydock 1)');

  if (!isOpen) return null;

  const handleSelectPredefined = (user: UserProfile) => {
    login(user);
    onClose();
  };

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    let email = customEmail.trim().toLowerCase();
    if (!email.includes('@')) {
      email = `${email}@unithai.com`;
    }

    const newUser: UserProfile = {
      email,
      name: customName.trim() || email.split('@')[0],
      role: customRole,
      position: customRole === 'ADMIN' ? 'ADMIN' : customPosition,
      department: customDepartment,
      assignedJobs: customRole === 'ADMIN' ? undefined : [customJob],
    };

    login(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#08182f] border border-blue-900 rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Tricolor Ribbon on top */}
        <div className="h-1.5 w-full flex shrink-0">
          <div className="h-full flex-1 bg-[#D81E27]" />
          <div className="h-full flex-1 bg-white" />
          <div className="h-full flex-1 bg-[#004B9B]" />
        </div>

        {/* Modal Header */}
        <div className="p-4 sm:p-6 bg-[#07162b] border-b border-blue-900/80 flex items-start justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-md border border-slate-200 shrink-0">
              <UnithaiLogo className="h-7 sm:h-8" showText={true} lightBackground={true} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
                {language === 'TH' ? 'เข้าสู่ระบบแยกสิทธิ์ตาม Job งาน' : 'UNITHAI Portal Authentication'}
              </h2>
              <p className="text-xs text-slate-300">
                {language === 'TH'
                  ? 'กำหนดสิทธิ์การเข้าถึงข้อมูลตามโครงการ (Job Assignment) สำหรับ SRM, CO-SRM และวิศวกรผู้ควบคุมงาน'
                  : 'Role-based access matching company emails to assigned ship repair jobs'}
              </p>
            </div>
          </div>
          {currentUser && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-blue-900 bg-[#061326] shrink-0 text-xs font-bold">
          <button
            onClick={() => setActiveTab('QUICK')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'QUICK'
                ? 'border-[#D81E27] text-white bg-blue-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-red-500" />
            <span>{language === 'TH' ? '1. เลือกโปรไฟล์ทดสอบด่วน (Quick Switch)' : '1. Quick Select Profiles'}</span>
          </button>
          <button
            onClick={() => setActiveTab('CUSTOM')}
            className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
              activeTab === 'CUSTOM'
                ? 'border-[#D81E27] text-white bg-blue-950/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4 text-blue-400" />
            <span>{language === 'TH' ? '2. ระบุอีเมลบริษัท (@unithai.com)' : '2. Enter Custom Email'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">

          {activeTab === 'QUICK' ? (
            <div className="space-y-3">
              <div className="text-xs text-slate-300 mb-2">
                {language === 'TH'
                  ? 'คลิกเลือกโปรไฟล์ด้านล่างเพื่อทดสอบการแยกพาร์ท Admin และ User โดยระบบจะกรองให้เห็นเฉพาะ Job ที่เกี่ยวข้องทันที:'
                  : 'Click a profile below to switch roles and see job-scoped filtering in real-time:'}
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {DEFAULT_USERS.map((user) => {
                  const isCurrent = currentUser?.email.toLowerCase() === user.email.toLowerCase();
                  const isAdmin = user.role === 'ADMIN';

                  return (
                    <button
                      key={user.email}
                      type="button"
                      onClick={() => handleSelectPredefined(user)}
                      className={`w-full p-3.5 rounded-xl border text-left flex items-start justify-between gap-3 transition group ${
                        isCurrent
                          ? 'bg-blue-900/40 border-red-500 shadow-md ring-1 ring-red-500/50'
                          : 'bg-[#0a1c36] border-blue-900/60 hover:bg-[#0e274c] hover:border-blue-700'
                      }`}
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                            isAdmin
                              ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                              : user.position === 'SRM'
                              ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                              : user.position === 'CO_SRM'
                              ? 'bg-amber-600/20 text-amber-400 border border-amber-500/40'
                              : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                          }`}
                        >
                          {isAdmin ? (
                            <ShieldCheck className="w-5 h-5" />
                          ) : user.position === 'SRM' ? (
                            <Anchor className="w-5 h-5" />
                          ) : user.position === 'CO_SRM' ? (
                            <Users className="w-5 h-5" />
                          ) : (
                            <HardHat className="w-5 h-5" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm group-hover:text-red-400 transition">
                              {user.name}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                                isAdmin
                                  ? 'bg-red-600 text-white'
                                  : user.position === 'SRM'
                                  ? 'bg-blue-600 text-white'
                                  : user.position === 'CO_SRM'
                                  ? 'bg-amber-500 text-slate-950 font-extrabold'
                                  : 'bg-emerald-600 text-white'
                              }`}
                            >
                              {user.position === 'ADMIN'
                                ? '👑 ADMIN (ดูทุก Job)'
                                : user.position === 'SRM'
                                ? '⚓ SRM'
                                : user.position === 'CO_SRM'
                                ? '🤝 CO-SRM'
                                : '🔧 IN CHARGE'}
                            </span>
                          </div>

                          <div className="text-xs text-blue-300 font-mono mt-0.5 flex items-center gap-2 flex-wrap">
                            <span>{user.email}</span>
                            {user.lineDisplayName && (
                              <span className="inline-flex items-center gap-1 text-[10px] text-[#00C300] font-mono bg-[#00C300]/10 px-1.5 py-0.5 rounded border border-[#00C300]/30">
                                💬 LINE: {user.lineDisplayName}
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-300 mt-1">
                            {isAdmin ? (
                              <span className="text-emerald-400 font-semibold">
                                ✓ มีสิทธิ์เข้าถึงและจัดการอะไหล่ทุก Job ทุกลำในอู่เรือ 100%
                              </span>
                            ) : (
                              <span>
                                📌 <strong className="text-white">รับผิดชอบ Job:</strong>{' '}
                                {user.assignedJobs?.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1.5 self-center">
                        {isCurrent ? (
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold">
                            <Check className="w-3.5 h-3.5" />
                            {language === 'TH' ? 'กำลังใช้งาน' : 'Active'}
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-slate-400 group-hover:text-white flex items-center">
                            {language === 'TH' ? 'สลับเข้าใช้งาน' : 'Switch'}
                            <ChevronRight className="w-4 h-4 ml-0.5" />
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleCustomLogin} className="space-y-4">
              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900 text-xs text-slate-300">
                {language === 'TH'
                  ? 'กรอกอีเมลบริษัท @unithai.com ของคุณ พร้อมกำหนดตำแหน่ง เพื่อให้ระบบเชื่อมโยงข้อมูลเรือ/Job ที่คุณต้องรับผิดชอบโดยอัตโนมัติ'
                  : 'Enter your company email to dynamically scope spare parts to your designated ship repair project.'}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {language === 'TH' ? 'อีเมลบริษัท (Corporate Email):' : 'Company Email:'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="เช่น somchai.s@unithai.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#061326] border border-blue-900 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {language === 'TH' ? 'ชื่อ - นามสกุล หรือ ตำแหน่งเรียกขาน:' : 'Full Name / Call Name:'}
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="เช่น สมชาย ศักดิ์ชัย"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#061326] border border-blue-900 text-white text-xs focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {language === 'TH' ? 'พาร์ทการใช้งาน (Portal Role):' : 'Portal Role:'}
                  </label>
                  <select
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value as AuthRole)}
                    className="w-full px-3 py-2 rounded-xl bg-[#061326] border border-blue-900 text-white text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="USER">{language === 'TH' ? 'พาร์ท USER (ทีมหน้างาน / ช่าง)' : 'USER Portal (Field Team)'}</option>
                    <option value="ADMIN">{language === 'TH' ? 'พาร์ท ADMIN (แอดมิน / จัดซื้อ)' : 'ADMIN Portal (Full Access)'}</option>
                  </select>
                </div>

                {customRole === 'USER' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      {language === 'TH' ? 'ตำแหน่งใน Job (Position):' : 'Project Position:'}
                    </label>
                    <select
                      value={customPosition}
                      onChange={(e) => setCustomPosition(e.target.value as JobPosition)}
                      className="w-full px-3 py-2 rounded-xl bg-[#061326] border border-blue-900 text-white text-xs focus:outline-none focus:border-red-500"
                    >
                      <option value="SRM">SRM (Ship Repair Manager)</option>
                      <option value="CO_SRM">CO-SRM (Co-Ship Repair Manager)</option>
                      <option value="IN_CHARGE">IN CHARGE (วิศวกรผู้ควบคุมงาน)</option>
                      <option value="STAFF">STAFF (ทีมงานหน้างาน)</option>
                    </select>
                  </div>
                )}
              </div>

              {customRole === 'USER' && (
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">
                    {language === 'TH' ? 'Job เรือที่ได้รับมอบหมายให้ดูแล:' : 'Assigned Vessel / Job:'}
                  </label>
                  <select
                    value={customJob}
                    onChange={(e) => setCustomJob(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#061326] border border-blue-900 text-white text-xs focus:outline-none focus:border-red-500"
                  >
                    <option value="UT-26-081 MV Ocean Splendor (Drydock 1)">UT-26-081 MV Ocean Splendor (Drydock 1)</option>
                    <option value="UT-26-079 MT Siam Pearl (Quay 3)">UT-26-079 MT Siam Pearl (Quay 3)</option>
                    <option value="UT-26-084 Tugboat UNITHAI 5">UT-26-084 Tugboat UNITHAI 5</option>
                    <option value="UT-26-075 MV Pacific Navigator">UT-26-075 MV Pacific Navigator</option>
                    <option value="UT-26-088 Bulk Carrier Golden Horizon">UT-26-088 Bulk Carrier Golden Horizon</option>
                  </select>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-[#D81E27] hover:from-blue-600 hover:to-red-600 text-white text-xs font-bold shadow-lg shadow-blue-950 transition active:scale-95"
                >
                  {language === 'TH' ? 'เข้าสู่ระบบด้วยอีเมลนี้' : 'Sign in with Company Email'}
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer info banner */}
        <div className="p-3 bg-[#061224] border-t border-blue-950 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>UNITHAI Shipyard & Engineering • Single Sign-On Ready</span>
          </div>
          <span>v2.4 Role Scoped</span>
        </div>

      </div>
    </div>
  );
};
