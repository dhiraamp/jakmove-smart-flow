import React from 'react';
import {
  LayoutDashboard,
  Truck,
  BarChart3,
  Route,
  Wrench,
  ShieldAlert,
  Share2,
  Cpu,
  Sparkles,
  MapPin,
  Flame,
  CheckCircle2,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  criticalAlertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  mobileMenuOpen,
  setMobileMenuOpen,
  criticalAlertCount,
}) => {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Monitoring Real-Time',
      icon: LayoutDashboard,
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400',
    },
    {
      id: 'fleet',
      label: 'Manajemen Armada',
      icon: Truck,
      badge: '28 Unit',
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'analytics',
      label: 'Analitik Operasional',
      icon: BarChart3,
      badge: null,
      badgeColor: '',
    },
    {
      id: 'route-optimizer',
      label: 'Optimalisasi Rute AI',
      icon: Route,
      badge: 'Eco 94%',
      badgeColor: 'bg-teal-500/20 text-teal-300',
    },
    {
      id: 'maintenance',
      label: 'Peringatan Pemeliharaan',
      icon: Wrench,
      badge: criticalAlertCount > 0 ? `${criticalAlertCount} Kritis` : 'OK',
      badgeColor: criticalAlertCount > 0 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-400',
    },
    {
      id: 'compliance',
      label: 'Kepatuhan Pengemudi',
      icon: ShieldAlert,
      badge: 'HOS 98%',
      badgeColor: 'bg-slate-800 text-slate-300',
    },
    {
      id: 'cross-platform',
      label: 'API Pelacakan Kiriman',
      icon: Share2,
      badge: 'REST/v1',
      badgeColor: 'bg-cyan-500/20 text-cyan-300',
    },
  ];

  const handleSelect = (id: string) => {
    onTabChange(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 border-r border-slate-800 p-4 shrink-0 min-h-[calc(100vh-4rem)]">
        <div className="space-y-1">
          <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Modul Operasional
          </p>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* AI Performance Indicator Box */}
        <div className="mt-auto pt-4 border-t border-slate-800">
          <div className="p-3 rounded-xl bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/40 border border-emerald-500/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Efisiensi AI Aktif</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                +24.8%
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Penghematan BBM bulan ini: <strong className="text-slate-200">3.840 Liter</strong> (Rp 55.68 Juta).
            </p>
            <div className="mt-2.5 w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-400 to-emerald-400 h-1.5 rounded-full w-[88%]" />
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-[80vw] bg-slate-900 border-r border-slate-800 p-5 flex flex-col h-full z-10 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-sm text-slate-100">JakMove Smart Flow</span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <nav className="space-y-1 flex-1 overflow-y-auto">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-3 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400">
              <p>Jakarta Logistics Command v2.6</p>
              <p className="text-[10px] text-slate-400 mt-1">Status Sistem: 100% Operational</p>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar for quick access */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-around">
        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === 'dashboard' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] font-medium">Radar</span>
        </button>
        <button
          onClick={() => onTabChange('fleet')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === 'fleet' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span className="text-[10px] font-medium">Armada</span>
        </button>
        <button
          onClick={() => onTabChange('route-optimizer')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === 'route-optimizer' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Route className="w-4 h-4" />
          <span className="text-[10px] font-medium">Rute AI</span>
        </button>
        <button
          onClick={() => onTabChange('maintenance')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === 'maintenance' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span className="text-[10px] font-medium">Servis</span>
        </button>
        <button
          onClick={() => onTabChange('analytics')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg transition ${
            activeTab === 'analytics' ? 'text-emerald-400' : 'text-slate-400'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span className="text-[10px] font-medium">Analitik</span>
        </button>
      </div>
    </>
  );
};
