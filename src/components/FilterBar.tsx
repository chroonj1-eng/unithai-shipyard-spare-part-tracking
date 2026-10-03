import React, { useMemo } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  LayoutDashboard,
  CalendarDays,
  X,
  Plus,
  Ship,
  Plane,
  Truck,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ViewMode } from '../types/sparePart';

export const FilterBar: React.FC = () => {
  const {
    accessibleSpareParts,
    searchQuery,
    setSearchQuery,
    selectedJobFilter,
    setSelectedJobFilter,
    selectedStatusFilter,
    setSelectedStatusFilter,
    selectedTypeFilter,
    setSelectedTypeFilter,
    viewMode,
    setViewMode,
    setIsAddModalOpen,
    userRole,
    language,
    isDark,
    t,
  } = useApp();

  // Extract unique Jobs scoped to user's access
  const jobOptions = useMemo(() => {
    const set = new Set<string>();
    accessibleSpareParts.forEach((p) => {
      if (p.job) set.add(p.job);
    });
    return Array.from(set);
  }, [accessibleSpareParts]);

  const statusOptions = [
    { value: 'ALL', label: t.statusAll },
    { value: 'BOOKING_CONFIRMED', label: t.statusBookingConfirmed },
    { value: 'IN_TRANSIT', label: t.statusInTransit },
    { value: 'CUSTOMS_PORT', label: t.statusCustomsPort },
    { value: 'DO_RECEIVED', label: t.statusDoReceived },
    { value: 'DELIVERED', label: t.statusDelivered },
    { value: 'URGENT', label: t.statusUrgent },
  ];

  const typeOptions = [
    { value: 'ALL', label: t.filterAllTypes },
    { value: 'Air Freight', label: '✈️ Air Freight' },
    { value: 'Sea Freight FCL', label: '🚢 Sea Freight FCL' },
    { value: 'Sea Freight LCL', label: '📦 Sea Freight LCL' },
    { value: 'Courier / Express', label: '⚡ Courier Express' },
    { value: 'Land Freight', label: '🚛 Land Freight' },
  ];

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedJobFilter('ALL');
    setSelectedStatusFilter('ALL');
    setSelectedTypeFilter('ALL');
  };

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedJobFilter !== 'ALL' ||
    selectedStatusFilter !== 'ALL' ||
    selectedTypeFilter !== 'ALL';

  return (
    <div className={`p-4 sticky top-16 z-20 backdrop-blur-md transition-colors border-b ${
      isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200 shadow-sm'
    }`}>
      <div className="max-w-7xl mx-auto space-y-3">
        
        {/* Top Line: Search Input + View Mode Switcher + Add Button */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          
          {/* Universal Search Bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className={`w-full pl-10 pr-10 py-2 rounded-xl text-xs sm:text-sm shadow-inner transition-colors focus:outline-none ${
                isDark
                  ? 'bg-slate-950/80 border border-slate-700/80 text-white placeholder:text-slate-500 focus:border-cyan-400'
                  : 'bg-slate-50 border border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-blue-500'
              }`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 p-1 rounded-md text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Controls: View Switcher & Action */}
          <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
            {/* View Mode Toggle */}
            <div className={`flex items-center p-1 rounded-xl text-xs border transition-colors ${
              isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-100 border-slate-200'
            }`}>
              
              {/* 1. Table View */}
              <button
                onClick={() => setViewMode('table')}
                title={language === 'TH' ? 'ตาราง 19 คอลัมน์ (Table View)' : '19-Column Full Table View'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  viewMode === 'table'
                    ? isDark
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                      : 'bg-white text-blue-700 font-bold border border-slate-300 shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.viewTable}</span>
              </button>

              {/* 2. Simplified Card View */}
              <button
                onClick={() => setViewMode('cards')}
                title={language === 'TH' ? 'การ์ดสรุปรายการ (เข้าใจง่าย เหมาะกับมือถือและแท็บเล็ต)' : 'Mobile Summary Cards'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  viewMode === 'cards'
                    ? isDark
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                      : 'bg-white text-blue-700 font-bold border border-slate-300 shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'TH' ? 'การ์ดสรุปรายการ' : 'Cards'}</span>
              </button>

              {/* 3. DASH BOARD */}
              <button
                onClick={() => setViewMode('kanban')}
                title={language === 'TH' ? 'แดชบอร์ดติดตามสถานะงานตามขั้นตอนขนส่ง (DASHBOARD)' : 'Logistics Pipeline DASHBOARD'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  viewMode === 'kanban'
                    ? isDark
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                      : 'bg-white text-blue-700 font-bold border border-slate-300 shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="font-bold tracking-wider">DASHBOARD</span>
              </button>

              {/* 4. Timeline View */}
              <button
                onClick={() => setViewMode('timeline')}
                title={language === 'TH' ? 'ไทม์ไลน์กำหนดส่ง (ETA Timeline)' : 'Chronological ETA Timeline'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                  viewMode === 'timeline'
                    ? isDark
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                      : 'bg-white text-blue-700 font-bold border border-slate-300 shadow-sm'
                    : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{language === 'TH' ? 'ไทม์ไลน์' : 'Timeline'}</span>
              </button>
            </div>

            {/* Admin Add Booking Button */}
            {userRole === 'ADMIN' && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-700 via-blue-600 to-red-600 hover:from-blue-600 hover:to-red-500 text-white font-semibold text-xs transition shadow-md active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>{t.addBooking}</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Filter Strip: Job Dropdown, Status Chips, Type Filter */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          
          {/* Job Filter Dropdown */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <Ship className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            <span className={`text-[11px] whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.filterShipProject}</span>
            <select
              value={selectedJobFilter}
              onChange={(e) => setSelectedJobFilter(e.target.value)}
              className={`bg-transparent font-medium text-xs focus:outline-none max-w-[180px] truncate ${
                isDark ? 'text-white' : 'text-slate-800'
              }`}
            >
              <option value="ALL" className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}>{t.filterAllJobs}</option>
              {jobOptions.map((job) => (
                <option key={job} value={job} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}>
                  {job}
                </option>
              ))}
            </select>
          </div>

          {/* Transport Type Filter */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <Plane className="w-3.5 h-3.5 text-teal-500 shrink-0" />
            <span className={`text-[11px] whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.filterTransport}</span>
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className={`bg-transparent font-medium text-xs focus:outline-none ${
                isDark ? 'text-white' : 'text-slate-800'
              }`}
            >
              {typeOptions.map((item) => (
                <option key={item.value} value={item.value} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Quick Chips */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar flex-1">
            {statusOptions.map((opt) => {
              const isSelected = selectedStatusFilter === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setSelectedStatusFilter(opt.value)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition whitespace-nowrap ${
                    isSelected
                      ? isDark
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm font-semibold'
                        : 'bg-blue-600 text-white border border-blue-600 shadow-sm font-semibold'
                      : isDark
                      ? 'bg-slate-950/40 text-slate-400 hover:text-white border border-slate-800'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/30 text-[11px] transition shrink-0"
            >
              <X className="w-3 h-3" />
              <span>{t.clearFilters}</span>
            </button>
          )}

        </div>

      </div>
    </div>
  );
};
