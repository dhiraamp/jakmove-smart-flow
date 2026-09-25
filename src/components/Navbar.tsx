import React, { useState, useEffect } from 'react';
import { Truck, ShieldCheck, Sparkles, Bell, Search, Activity, Menu, X, Clock, HelpCircle } from 'lucide-react';
import { Vehicle, MaintenanceAlert } from '../types/logistics';

interface NavbarProps {
  onOpenAiAssistant: () => void;
  onOpenRouteOptimizer: () => void;
  onSelectVehicle: (v: Vehicle) => void;
  vehicles: Vehicle[];
  alerts: MaintenanceAlert[];
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  onNavigateTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAiAssistant,
  onOpenRouteOptimizer,
  onSelectVehicle,
  vehicles,
  alerts,
  mobileMenuOpen,
  setMobileMenuOpen,
  onNavigateTab,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Vehicle[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [showAlertMenu, setShowAlertMenu] = useState(false);

  useEffect(() => {
    const updateWibTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
      setCurrentTime(`${timeStr} WIB`);
    };
    updateWibTime();
    const interval = setInterval(updateWibTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    if (!q.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }
    const filtered = vehicles.filter(
      v =>
        v.plateNumber.toLowerCase().includes(q.toLowerCase()) ||
        v.driverName.toLowerCase().includes(q.toLowerCase()) ||
        v.targetDestination.toLowerCase().includes(q.toLowerCase()) ||
        (v.activeShipmentId && v.activeShipmentId.toLowerCase().includes(q.toLowerCase()))
    );
    setSearchResults(filtered);
    setShowSearchDropdown(true);
  };

  const activeAlerts = alerts.filter(a => !a.isResolved);

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand & Status */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => onNavigateTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition transform">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Truck className="w-5 h-5 text-emerald-400 group-hover:text-cyan-300 transition" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                  JakMove
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  SMART-FLOW
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Logistics & Fleet AI Control Tower
              </p>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-800 text-xs text-slate-400">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Telemetri Aktif: <strong className="text-slate-200">24/28 Armada</strong></span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-md relative hidden sm:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setShowSearchDropdown(true)}
              placeholder="Cari plat nomor, sopir, resi JKM/SPX/GTL..."
              className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {showSearchDropdown && (
            <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 max-h-72 overflow-y-auto">
              {searchResults.length === 0 ? (
                <div className="p-3 text-xs text-slate-400 text-center">
                  Tidak ada armada atau resi yang cocok dengan "{searchQuery}"
                </div>
              ) : (
                searchResults.map(veh => (
                  <div
                    key={veh.id}
                    onClick={() => {
                      onSelectVehicle(veh);
                      setShowSearchDropdown(false);
                      setSearchQuery('');
                      onNavigateTab('dashboard');
                    }}
                    className="p-3 border-b border-slate-800 hover:bg-slate-800 cursor-pointer transition flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-emerald-400">{veh.plateNumber}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {veh.typeName}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Driver: <span className="text-slate-200">{veh.driverName}</span> • Ke: {veh.targetDestination}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        {veh.status}
                      </span>
                      <p className="text-[10px] text-slate-400 mt-0.5">{veh.telematics.speedKmH} km/h</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Tools & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live WIB Clock */}
          <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-300 bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-700/60">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono">{currentTime}</span>
          </div>

          {/* Quick Route Optimizer Trigger */}
          <button
            onClick={onOpenRouteOptimizer}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Optimalisasi Rute AI</span>
          </button>

          {/* AI Operational Assistant Button */}
          <button
            onClick={onOpenAiAssistant}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-400 hover:to-cyan-500 text-white shadow-md shadow-cyan-900/30 text-xs font-semibold transition transform hover:scale-[1.02]"
          >
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span className="hidden md:inline">AI Co-Pilot</span>
          </button>

          {/* Alert Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowAlertMenu(!showAlertMenu)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 relative transition"
              aria-label="Peringatan Operasional"
            >
              <Bell className="w-4 h-4" />
              {activeAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                  {activeAlerts.length}
                </span>
              )}
            </button>

            {showAlertMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 p-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-100">Peringatan Operasional & Mesin</span>
                  </div>
                  <span className="text-[10px] text-slate-400">{activeAlerts.length} Belum Selesai</span>
                </div>

                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {activeAlerts.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-4">Semua sistem armada beroperasi normal.</p>
                  ) : (
                    activeAlerts.map(alt => (
                      <div
                        key={alt.id}
                        onClick={() => {
                          setShowAlertMenu(false);
                          onNavigateTab('maintenance');
                        }}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                          alt.severity === 'CRITICAL'
                            ? 'bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20'
                            : 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold">
                          <span>{alt.plateNumber}</span>
                          <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-black/40">
                            {alt.severity}
                          </span>
                        </div>
                        <p className="font-semibold text-slate-200 mt-1">{alt.component}</p>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{alt.diagnosis}</p>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                          <span>Estimasi kerusakan: ~{alt.predictedFailureKm} KM</span>
                          <span className="text-cyan-400 underline">Buka SPK →</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="mt-2 pt-2 border-t border-slate-800 flex justify-between">
                  <button
                    onClick={() => {
                      setShowAlertMenu(false);
                      onNavigateTab('maintenance');
                    }}
                    className="text-[11px] text-emerald-400 hover:underline font-semibold"
                  >
                    Buka Modul Pemeliharaan Lengkap →
                  </button>
                  <button
                    onClick={() => setShowAlertMenu(false)}
                    className="text-[11px] text-slate-400 hover:text-slate-200"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
