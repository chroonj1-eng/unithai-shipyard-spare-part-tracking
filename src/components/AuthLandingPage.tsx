import React, { useState } from 'react';
import {
  ShieldCheck,
  HardHat,
  Anchor,
  Users,
  Mail,
  Lock,
  User,
  Building2,
  Phone,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Smartphone,
  Eye,
  EyeOff,
  Briefcase,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserProfile, AuthRole, JobPosition } from '../types/sparePart';
import { loadRegisteredUsers, registerNewUser } from '../utils/storage';
import { UnithaiLogo } from './UnithaiLogo';

interface Props {
  onSuccessLogin?: () => void;
}

export const AuthLandingPage: React.FC<Props> = ({ onSuccessLogin }) => {
  const { login, language, spareParts } = useApp();

  const [mode, setMode] = useState<'SIGN_IN' | 'REGISTER'>('SIGN_IN');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Sign In Form States
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmailPrefix, setRegEmailPrefix] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<AuthRole>('USER');
  const [regPosition, setRegPosition] = useState<JobPosition>('IN_CHARGE');
  const [regDepartment, setRegDepartment] = useState('Ship Repair Operations');
  const [regPhone, setRegPhone] = useState('');
  const [regLineId, setRegLineId] = useState('');
  const [regSelectedJob, setRegSelectedJob] = useState('UT-26-081 MV Ocean Splendor (Drydock 1)');

  // Quick Demo Accounts
  const registeredUsers = loadRegisteredUsers();

  const handleQuickSignIn = (user: UserProfile) => {
    login(user);
    if (onSuccessLogin) onSuccessLogin();
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    let email = signInEmail.trim().toLowerCase();
    if (!email.includes('@')) {
      email = `${email}@unithai.com`;
    }

    if (!email.endsWith('@unithai.com')) {
      setErrorMessage('กรุณาใช้อีเมลบริษัทที่ลงท้ายด้วย @unithai.com เท่านั้น');
      return;
    }

    // Check if account exists in registered users
    const allUsers = loadRegisteredUsers();
    const found = allUsers.find(u => u.email.toLowerCase() === email);

    if (found) {
      login(found);
      if (onSuccessLogin) onSuccessLogin();
    } else {
      // If valid @unithai.com email not yet registered, offer auto-register or notify
      setErrorMessage(`ไม่พบบัญชี ${email} ในระบบ กรุณาคลิกแท็บ "ลงทะเบียนผู้ใช้ใหม่" เพื่อสร้างบัญชี`);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const cleanPrefix = regEmailPrefix.trim().toLowerCase().replace(/@unithai\.com$/i, '').replace(/@.*$/, '');
    if (!cleanPrefix) {
      setErrorMessage('กรุณาระบุชื่ออีเมลบริษัท');
      return;
    }

    const fullEmail = `${cleanPrefix}@unithai.com`;

    if (!regName.trim()) {
      setErrorMessage('กรุณากรอกชื่อ - นามสกุล');
      return;
    }

    const newUser: UserProfile = {
      email: fullEmail,
      name: regName.trim(),
      role: regRole,
      position: regRole === 'ADMIN' ? 'ADMIN' : regPosition,
      department: regDepartment,
      phone: regPhone.trim() || undefined,
      lineUserId: regLineId.trim() || undefined,
      lineDisplayName: regLineId.trim() || regName.trim(),
      password: regPassword || 'unithai123',
      assignedJobs: regRole === 'ADMIN' ? undefined : [regSelectedJob],
      registeredAt: new Date().toISOString(),
    };

    const res = registerNewUser(newUser);
    if (!res.success) {
      setErrorMessage(res.error || 'เกิดข้อผิดพลาดในการลงทะเบียน');
      return;
    }

    setSuccessMessage(`ลงทะเบียนสำเร็จ! เข้าสู่ระบบในฐานะ ${newUser.name} (${newUser.position})`);
    setTimeout(() => {
      login(newUser);
      if (onSuccessLogin) onSuccessLogin();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#061224] text-slate-100 flex flex-col justify-between selection:bg-red-600 selection:text-white relative overflow-hidden">
      
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Corporate Top Ribbon */}
      <div className="h-1.5 w-full flex shrink-0">
        <div className="h-full flex-1 bg-[#D81E27]" />
        <div className="h-full flex-1 bg-white" />
        <div className="h-full flex-1 bg-[#004B9B]" />
      </div>

      {/* Main Container */}
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-1 flex flex-col justify-center">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-white p-3 rounded-2xl shadow-xl border border-slate-200 mb-4">
            <UnithaiLogo className="h-9 sm:h-11" showText={true} lightBackground={true} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            ระบบติดตามอะไหล่เรือ UNITHAI Shipyard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto mt-2 leading-relaxed">
            ระบบบริหารจัดการพัสดุและแจ้งเตือนสถานะอะไหล่เรือแบบเรียลไทม์ (Real-Time Logistics)
            <br />
            <span className="text-blue-300 font-medium">
              กำหนดสิทธิ์การเข้าถึงข้อมูลตามโครงการ (Job Assignment) สำหรับ SRM, CO-SRM และ IN CHARGE
            </span>
          </p>
        </div>

        {/* Auth Card */}
        <div className="max-w-xl w-full mx-auto bg-[#081a35] border border-blue-900/80 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-md">
          
          {/* Sign In vs Register Tabs */}
          <div className="flex border-b border-blue-900 bg-[#061326] text-xs font-bold">
            <button
              onClick={() => {
                setMode('SIGN_IN');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
                mode === 'SIGN_IN'
                  ? 'border-[#D81E27] text-white bg-blue-950/60 font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-4 h-4 text-red-500" />
              <span>เข้าสู่ระบบ (Sign In)</span>
            </button>

            <button
              onClick={() => {
                setMode('REGISTER');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`flex-1 py-3.5 px-4 flex items-center justify-center gap-2 border-b-2 transition ${
                mode === 'REGISTER'
                  ? 'border-[#D81E27] text-white bg-blue-950/60 font-black'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>ลงทะเบียนใหม่ (@unithai.com)</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            
            {/* Feedback Notifications */}
            {errorMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-950/70 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* TAB 1: SIGN IN */}
            {mode === 'SIGN_IN' && (
              <div className="space-y-5">
                <form onSubmit={handleSignInSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1.5">
                      อีเมลบริษัท (Corporate Email):
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={signInEmail}
                        onChange={(e) => setSignInEmail(e.target.value)}
                        placeholder="เช่น somchai.s@unithai.com"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#061326] border border-blue-900 text-white text-xs font-mono focus:outline-none focus:border-red-500 transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1.5">
                      รหัสผ่าน (Password):
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={signInPassword}
                        onChange={(e) => setSignInPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#061326] border border-blue-900 text-white text-xs font-mono focus:outline-none focus:border-red-500 transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-[#D81E27] hover:from-blue-600 hover:to-red-600 text-white text-xs font-bold shadow-lg shadow-blue-950 transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>เข้าสู่ระบบ (Sign In)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>

                {/* Quick Select Predefined Company Accounts */}
                <div className="pt-4 border-t border-blue-900/60">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-cyan-400" />
                      <span>หรือเลือกเข้าสู่ระบบด่วน (Quick Switch Accounts):</span>
                    </span>
                    <span className="text-[10px] text-slate-400">คลิก 1 ครั้งเข้าได้ทันที</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                    {registeredUsers.slice(0, 6).map((u) => {
                      const isAdmin = u.role === 'ADMIN';
                      return (
                        <button
                          key={u.email}
                          type="button"
                          onClick={() => handleQuickSignIn(u)}
                          className="p-2.5 rounded-xl bg-[#061326] border border-blue-900/60 hover:bg-[#0c2448] hover:border-blue-600 text-left transition group flex items-start gap-2.5"
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${
                              isAdmin
                                ? 'bg-red-600/20 text-red-400 border border-red-500/40'
                                : u.position === 'SRM'
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                                : u.position === 'CO_SRM'
                                ? 'bg-amber-600/20 text-amber-400 border border-amber-500/40'
                                : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                            }`}
                          >
                            {isAdmin ? '👑' : u.position === 'SRM' ? '⚓' : u.position === 'CO_SRM' ? '🤝' : '🔧'}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                              {u.name}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono truncate">
                              {u.email}
                            </div>
                            <div className="text-[9px] text-blue-300 font-semibold mt-0.5 truncate">
                              {isAdmin ? 'ดูทุก Job ในอู่' : u.assignedJobs?.[0] || u.position}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: REGISTER NEW ACCOUNT */}
            {mode === 'REGISTER' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>ข้อกำหนดความปลอดภัยของ UNITHAI:</span>
                  </div>
                  <span>
                    การลงทะเบียนจะต้องใช้อีเมลบริษัทที่ลงท้ายด้วย{' '}
                    <strong className="text-white font-mono bg-blue-900/60 px-1 py-0.5 rounded">
                      @unithai.com
                    </strong>{' '}
                    เท่านั้น เพื่อจับคู่สิทธิ์เข้าดูงาน Job ที่ตนเองรับผิดชอบ
                  </span>
                </div>

                {/* Email input with locked @unithai.com suffix */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    อีเมลบริษัท (Corporate Email) <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex items-center">
                    <div className="relative flex-1">
                      <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={regEmailPrefix}
                        onChange={(e) => setRegEmailPrefix(e.target.value.toLowerCase().replace(/@.*$/, ''))}
                        placeholder="เช่น somchai.s"
                        className="w-full pl-9 pr-3 py-2.5 rounded-l-xl bg-[#061326] border border-blue-900 text-white text-xs font-mono focus:outline-none focus:border-red-500"
                      />
                    </div>
                    <div className="px-3.5 py-2.5 bg-blue-950 border border-l-0 border-blue-900 rounded-r-xl text-blue-300 font-mono text-xs font-bold select-none">
                      @unithai.com
                    </div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    ระบบจะสร้างอีเมลเป็น: {regEmailPrefix ? `${regEmailPrefix.trim().toLowerCase()}@unithai.com` : 'yourname@unithai.com'}
                  </span>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    ชื่อ - นามสกุล หรือ ฉายาเรียกขานหน้างาน <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="เช่น สมชาย ศักดิ์ชัย (SRM 1)"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#061326] border border-blue-900 text-white text-xs focus:outline-none focus:border-red-500"
                    />
                  </div>
                </div>

                {/* Password & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1.5">
                      กำหนดรหัสผ่าน (Password) <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="ตั้งรหัสผ่านสำหรับเข้าใช้งาน"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#061326] border border-blue-900 text-white text-xs focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1.5">
                      เบอร์โทรศัพท์ติดต่อภายในอู่เรือ:
                    </label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="เช่น 081-999-8888"
                      className="w-full px-3 py-2.5 rounded-xl bg-[#061326] border border-blue-900 text-white text-xs focus:outline-none focus:border-red-500 font-mono"
                    />
                  </div>
                </div>

                {/* LINE Account Link for Notifications */}
                <div>
                  <label className="block text-xs font-bold text-[#00C300] mb-1.5 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded bg-[#00C300]/20 text-[#00C300] font-black text-[10px]">LINE</span>
                      <span>LINE User ID หรือ LINE ID (สำหรับรับแจ้งเตือนสถานะอะไหล่):</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-normal">แนะนำเพื่อรับพุชเข้าไลน์</span>
                  </label>
                  <input
                    type="text"
                    value={regLineId}
                    onChange={(e) => setRegLineId(e.target.value)}
                    placeholder="เช่น U98a76b54c... หรือ line_id_somchai"
                    className="w-full px-3 py-2.5 rounded-xl bg-[#061326] border border-blue-900 text-emerald-300 text-xs focus:outline-none focus:border-[#00C300] font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    เมื่อแอดมินส่งบรอดแคสต์หรือสถานะอะไหล่ใน Job ของคุณเปลี่ยน ระบบจะส่งข้อความเข้าห้องแชท LINE ทันที
                  </span>
                </div>

                {/* Status / Role Selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1.5">
                      พาร์ทการเข้าใช้งาน (Portal Role) <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as AuthRole)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#061326] border border-blue-900 text-white text-xs focus:outline-none focus:border-red-500"
                    >
                      <option value="USER">ทีมหน้างาน / ช่าง (USER PORTAL)</option>
                      <option value="ADMIN">ฝ่ายจัดซื้อ & คลังสินค้า (ADMIN PORTAL)</option>
                    </select>
                  </div>

                  {regRole === 'USER' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-200 mb-1.5">
                        ตำแหน่งในโครงการเรือ (Position) <span className="text-rose-400">*</span>
                      </label>
                      <select
                        value={regPosition}
                        onChange={(e) => setRegPosition(e.target.value as JobPosition)}
                        className="w-full px-3 py-2.5 rounded-xl bg-[#061326] border border-blue-900 text-white text-xs focus:outline-none focus:border-red-500 font-semibold"
                      >
                        <option value="SRM">⚓ SRM (Ship Repair Manager)</option>
                        <option value="CO_SRM">🤝 CO-SRM (ผู้ช่วย SRM)</option>
                        <option value="IN_CHARGE">🔧 IN CHARGE (วิศวกรผู้ควบคุมงาน)</option>
                        <option value="STAFF">👷 STAFF (ทีมงานหน้างานทั่วไป)</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Job Assignment for USER role */}
                {regRole === 'USER' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1.5">
                      เลือก Job / เรือที่ได้รับมอบหมายให้ดูแล: <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={regSelectedJob}
                      onChange={(e) => setRegSelectedJob(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-[#061326] border border-blue-900 text-white text-xs focus:outline-none focus:border-red-500 font-medium"
                    >
                      <option value="UT-26-081 MV Ocean Splendor (Drydock 1)">
                        UT-26-081 MV Ocean Splendor (Drydock 1)
                      </option>
                      <option value="UT-26-079 MT Siam Pearl (Quay 3)">
                        UT-26-079 MT Siam Pearl (Quay 3)
                      </option>
                      <option value="UT-26-084 Tugboat UNITHAI 5">
                        UT-26-084 Tugboat UNITHAI 5
                      </option>
                      <option value="UT-26-075 MV Pacific Navigator">
                        UT-26-075 MV Pacific Navigator
                      </option>
                      <option value="UT-26-088 Bulk Carrier Golden Horizon">
                        UT-26-088 Bulk Carrier Golden Horizon
                      </option>
                    </select>
                    <span className="text-[10px] text-emerald-400 mt-1 block">
                      ✓ คุณจะมองเห็นและจัดการได้เฉพาะอะไหล่ของ Job นี้เท่านั้น จะไม่ปะปนกับงานของคนอื่น
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 mt-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-700 hover:from-emerald-500 hover:to-blue-600 text-white text-xs font-bold shadow-lg shadow-emerald-950/40 transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ยืนยันการลงทะเบียน & เข้าใช้งานทันที</span>
                </button>
              </form>
            )}

          </div>

        </div>

      </div>

      {/* Corporate Footer */}
      <footer className="border-t border-blue-950 bg-[#040e1c] py-4 text-center text-xs text-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>UNITHAI SHIPYARD AND ENGINEERING LTD. • Laem Chabang Shipyard</span>
          <span className="text-slate-400">Real-Time Synchronization Active • ISO 9001 / Maritime Standard</span>
        </div>
      </footer>

    </div>
  );
};
