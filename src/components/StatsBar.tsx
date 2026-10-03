import React from 'react';
import { Package, PlaneTakeoff, PackageCheck, CheckCircle2, AlertOctagon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const StatsBar: React.FC = () => {
  const { accessibleSpareParts, selectedStatusFilter, setSelectedStatusFilter, isDark, t } = useApp();

  const totalCount = accessibleSpareParts.length;
  const inTransitCount = accessibleSpareParts.filter((p) => p.status === 'IN_TRANSIT' || p.status === 'CUSTOMS_PORT').length;
  const doReceivedCount = accessibleSpareParts.filter((p) => p.status === 'DO_RECEIVED').length;
  const deliveredCount = accessibleSpareParts.filter((p) => p.status === 'DELIVERED').length;
  const urgentCount = accessibleSpareParts.filter((p) => p.isUrgent || p.status === 'URGENT_HOLD').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 text-xs">
        
        {/* Total Shipments */}
        <button
          onClick={() => setSelectedStatusFilter('ALL')}
          className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
            selectedStatusFilter === 'ALL'
              ? isDark
                ? 'bg-blue-950/50 border-blue-500 shadow-md ring-1 ring-blue-500/40'
                : 'bg-blue-50/90 border-blue-400 shadow-md ring-1 ring-blue-300'
              : isDark
              ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
              : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'
          }`}
        >
          <div>
            <span className={`text-[11px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.statTotal}</span>
            <span className={`text-lg sm:text-xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalCount}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0">
            <Package className="w-4 h-4" />
          </div>
        </button>

        {/* In Transit */}
        <button
          onClick={() => setSelectedStatusFilter('IN_TRANSIT')}
          className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
            selectedStatusFilter === 'IN_TRANSIT'
              ? isDark
                ? 'bg-indigo-950/50 border-indigo-500 shadow-md ring-1 ring-indigo-500/40'
                : 'bg-indigo-50/90 border-indigo-400 shadow-md ring-1 ring-indigo-300'
              : isDark
              ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
              : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'
          }`}
        >
          <div>
            <span className={`text-[11px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.statInTransit}</span>
            <span className={`text-lg sm:text-xl font-black font-mono ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>{inTransitCount}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0">
            <PlaneTakeoff className="w-4 h-4" />
          </div>
        </button>

        {/* DO Received & Open Container */}
        <button
          onClick={() => setSelectedStatusFilter('DO_RECEIVED')}
          className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
            selectedStatusFilter === 'DO_RECEIVED'
              ? isDark
                ? 'bg-cyan-950/50 border-cyan-500 shadow-md ring-1 ring-cyan-500/40'
                : 'bg-cyan-50/90 border-cyan-400 shadow-md ring-1 ring-cyan-300'
              : isDark
              ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
              : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'
          }`}
        >
          <div>
            <span className={`text-[11px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.statDoReceived}</span>
            <span className={`text-lg sm:text-xl font-black font-mono ${isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>{doReceivedCount}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-600 flex items-center justify-center shrink-0">
            <PackageCheck className="w-4 h-4" />
          </div>
        </button>

        {/* Delivered to Yard */}
        <button
          onClick={() => setSelectedStatusFilter('DELIVERED')}
          className={`p-3 rounded-xl border text-left transition flex items-center justify-between ${
            selectedStatusFilter === 'DELIVERED'
              ? isDark
                ? 'bg-emerald-950/50 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                : 'bg-emerald-50/90 border-emerald-400 shadow-md ring-1 ring-emerald-300'
              : isDark
              ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
              : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'
          }`}
        >
          <div>
            <span className={`text-[11px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.statDelivered}</span>
            <span className={`text-lg sm:text-xl font-black font-mono ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>{deliveredCount}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </button>

        {/* Urgent Parts */}
        <button
          onClick={() => setSelectedStatusFilter('URGENT')}
          className={`p-3 rounded-xl border text-left transition flex items-center justify-between col-span-2 sm:col-span-1 ${
            selectedStatusFilter === 'URGENT'
              ? isDark
                ? 'bg-rose-950/50 border-rose-500 shadow-md ring-1 ring-rose-500/40'
                : 'bg-rose-50/90 border-rose-400 shadow-md ring-1 ring-rose-300'
              : isDark
              ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/60'
              : 'bg-white border-slate-200 hover:bg-slate-50 shadow-sm'
          }`}
        >
          <div>
            <span className={`text-[11px] block font-medium ${isDark ? 'text-rose-300' : 'text-rose-600'}`}>{t.statUrgent}</span>
            <span className={`text-lg sm:text-xl font-black font-mono ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>{urgentCount}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0 animate-pulse">
            <AlertOctagon className="w-4 h-4" />
          </div>
        </button>

      </div>
    </div>
  );
};

