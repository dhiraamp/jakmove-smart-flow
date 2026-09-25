import React, { useState } from 'react';
import {
  Truck,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  ShieldCheck,
  CheckCircle2,
  Filter,
  Thermometer,
  Zap,
  Fuel,
  Radio,
  ExternalLink,
} from 'lucide-react';
import { Vehicle, HubLocation, MaintenanceAlert, OperationalKPIs } from '../types/logistics';
import { LogisticsMap } from './LogisticsMap';
import { RECENT_LOGISTICS_EVENTS } from '../data/mockLogisticsData';

interface DashboardOverviewProps {
  vehicles: Vehicle[];
  hubs: HubLocation[];
  kpis: OperationalKPIs;
  alerts: MaintenanceAlert[];
  onSelectVehicle: (v: Vehicle) => void;
  onOpenRouteOptimizer: (originVehicle?: Vehicle) => void;
  onNavigateTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  vehicles,
  hubs,
  kpis,
  alerts,
  onSelectVehicle,
  onOpenRouteOptimizer,
  onNavigateTab,
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'IN_TRANSIT' | 'LOADING' | 'IDLE' | 'MAINTENANCE'>('ALL');
  const [selectedMapVehicle, setSelectedMapVehicle] = useState<Vehicle | null>(null);

  const filteredVehicles = vehicles.filter(v => {
    if (activeFilter === 'ALL') return true;
    return v.status === activeFilter;
  });

  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL' && !a.isResolved);

  return (
    <div className="space-y-6">
      {/* Top Banner KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Active Fleet */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Armada Beroperasi</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Truck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {kpis.activeFleetCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ {kpis.totalFleetCount} Unit</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Utilitas {kpis.fleetUtilizationRate}% (Optimal)</span>
          </div>
        </div>

        {/* KPI 2: On-Time Delivery Rate */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">On-Time Delivery (OTD)</span>
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {kpis.onTimeDeliveryRate}%
            </span>
            <span className="text-xs text-cyan-400 font-medium">+1.4% MoM</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Target Ditjen Logistik: &gt;95%</span>
          </div>
        </div>

        {/* KPI 3: AI Fuel Savings */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Efisiensi Bahan Bakar AI</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              3.840 <span className="text-sm font-normal text-slate-400">L</span>
            </span>
            <span className="text-xs text-emerald-400 font-medium">Hemat 24.8%</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-teal-400 font-medium">
            <span className="font-semibold">Rp {(kpis.totalCostSavedRp / 1000000).toFixed(1)} Juta OPEX Hemat</span>
          </div>
        </div>

        {/* KPI 4: Predictive Maintenance Warnings */}
        <div
          onClick={() => onNavigateTab('maintenance')}
          className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 shadow-xl cursor-pointer hover:border-slate-700 transition relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">Peringatan Kondisi Mesin</span>
            <div
              className={`p-2 rounded-xl border ${
                criticalAlerts.length > 0
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {criticalAlerts.length}{' '}
              <span className="text-sm font-normal text-slate-400">Kritis</span>
            </span>
            <span className="text-xs text-amber-400 font-medium">
              {alerts.filter(a => a.severity === 'WARNING').length} Waspada
            </span>
          </div>
          <div className="mt-2 flex items-center gap-1 text-[11px] text-cyan-400 font-medium">
            <span>Lihat SPK & Diagnosa OBD-II →</span>
          </div>
        </div>
      </div>

      {/* Main Section: Interactive Map with Telematics Radar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400" />
              Pemantauan Armada Real-Time & Arteri Tol Jabodetabek
            </h2>
            <p className="text-xs text-slate-400">
              Pelacakan posisi satelit GPS, kondisi kemacetan, koridor ganjil-genap, dan telemetri langsung kendaraan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenRouteOptimizer()}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow-lg shadow-emerald-950/40"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Simulasi Optimalisasi Rute AI</span>
            </button>
          </div>
        </div>

        <LogisticsMap
          vehicles={vehicles}
          hubs={hubs}
          selectedVehicle={selectedMapVehicle}
          onSelectVehicle={v => {
            setSelectedMapVehicle(v);
            if (v) onSelectVehicle(v);
          }}
          onOpenOptimizerForVehicle={v => onOpenRouteOptimizer(v)}
        />
      </div>

      {/* Two-Column Section: Active Fleet Telematics Cards + Live Logistics Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Active Fleet Telematics Directory */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400" />
                Daftar Telemetri Armada ({filteredVehicles.length} Unit)
              </h3>
              <p className="text-[11px] text-slate-400">
                Pembaruan telematika sensor CAN-Bus & OBD-II setiap 5 detik
              </p>
            </div>

            {/* Status Filter Chips */}
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs overflow-x-auto">
              <button
                onClick={() => setActiveFilter('ALL')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeFilter === 'ALL'
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setActiveFilter('IN_TRANSIT')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeFilter === 'IN_TRANSIT'
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                In-Transit
              </button>
              <button
                onClick={() => setActiveFilter('LOADING')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeFilter === 'LOADING'
                    ? 'bg-cyan-500/20 text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Bongkar/Muat
              </button>
              <button
                onClick={() => setActiveFilter('IDLE')}
                className={`px-2.5 py-1 rounded-lg font-medium transition ${
                  activeFilter === 'IDLE'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Idle
              </button>
            </div>
          </div>

          {/* Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredVehicles.map(veh => {
              const isCritical =
                veh.telematics.coolantTempC > 96 || veh.telematics.oilPressurePsi < 25;
              const isEv = veh.type === 'EV_BLIND_VAN';
              return (
                <div
                  key={veh.id}
                  onClick={() => {
                    setSelectedMapVehicle(veh);
                    onSelectVehicle(veh);
                  }}
                  className={`p-4 rounded-xl border bg-slate-900/80 hover:bg-slate-850 hover:border-slate-700 cursor-pointer transition shadow-md group ${
                    isCritical ? 'border-rose-500/40 bg-rose-950/10' : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white group-hover:text-emerald-400 transition">
                          {veh.plateNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            veh.status === 'IN_TRANSIT'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : veh.status === 'LOADING'
                              ? 'bg-cyan-500/20 text-cyan-400'
                              : veh.status === 'MAINTENANCE'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {veh.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{veh.typeName}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-white">
                        {veh.telematics.speedKmH} <span className="text-[10px] text-slate-400 font-normal">km/h</span>
                      </span>
                      <p className="text-[10px] text-slate-400">{veh.telematics.engineRpm} RPM</p>
                    </div>
                  </div>

                  {/* Route & Destination */}
                  <div className="mt-3 p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Lokasi:</span>
                      <span className="text-slate-200 truncate max-w-[190px]">{veh.currentLocationName}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Tujuan:</span>
                      <span className="text-slate-200 truncate max-w-[190px]">{veh.targetDestination}</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>ETA:</span>
                      <span className="text-emerald-400 font-bold">{veh.eta}</span>
                    </div>
                  </div>

                  {/* Telemetry Bar */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <img
                        src={veh.driverAvatar}
                        alt={veh.driverName}
                        className="w-5 h-5 rounded-full object-cover border border-slate-700"
                      />
                      <span className="truncate max-w-[110px]">{veh.driverName}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Thermometer
                          className={`w-3 h-3 ${
                            veh.telematics.coolantTempC > 95 ? 'text-rose-400' : 'text-slate-400'
                          }`}
                        />
                        {veh.telematics.coolantTempC}°C
                      </span>

                      <span className="flex items-center gap-1">
                        {isEv ? (
                          <Zap className="w-3 h-3 text-cyan-400" />
                        ) : (
                          <Fuel className="w-3 h-3 text-emerald-400" />
                        )}
                        {veh.telematics.fuelLevelPercent}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Live Event Stream & Dispatch Quick Actions */}
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <h3 className="text-sm font-bold text-white">Live Event Stream Logistik</h3>
              </div>
              <span className="text-[10px] text-slate-400">WIB Real-Time</span>
            </div>

            <div className="space-y-3">
              {RECENT_LOGISTICS_EVENTS.map(evt => (
                <div key={evt.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${evt.badgeColor}`}>
                      {evt.badge}
                    </span>
                    <span className="text-[10px] text-slate-400">{evt.time}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-snug pt-0.5">{evt.text}</p>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateTab('cross-platform')}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 border border-slate-700 transition"
            >
              <span>Buka Pelacakan Resi Lintas Platform</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>

          {/* Quick Ganjil-Genap Compliance Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/20 space-y-2">
            <div className="flex items-center gap-2 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-bold uppercase">Aturan Ganjil-Genap Jakarta</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hari ini berlaku plat nomor <strong className="text-amber-300 font-bold">GANJIL</strong> di 25 ruas jalan protokol Jakarta (06:00 - 10:00 &amp; 16:00 - 21:00 WIB). AI Route Optimizer secara otomatis memfilter jalur non-berlaku bagi armada logistik kering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
