import React from 'react';
import { WifiOff, HardDrive, CheckCircle } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { useApp } from '../context/AppContext';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t } = useApp();

  if (isOnline) return null;

  return (
    <aside
      aria-label="Offline Mode Notification"
      className="fixed bottom-4 left-4 z-50 flex items-center gap-2.5 rounded-xl bg-amber-500 text-slate-950 px-3.5 py-2 text-xs font-semibold shadow-2xl animate-in slide-in-from-bottom duration-300 border border-amber-300 ring-2 ring-amber-400/30"
    >
      <div className="w-2.5 h-2.5 rounded-full bg-slate-950 animate-ping" />
      <WifiOff className="w-4 h-4 shrink-0" />
      <div>
        <p className="font-bold leading-tight">{t.offlineTitle}</p>
        <p className="text-[10px] text-slate-900/80 font-normal">
          {t.offlineDesc}
        </p>
      </div>
    </aside>
  );
};

