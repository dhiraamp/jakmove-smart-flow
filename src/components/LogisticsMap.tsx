import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Layers,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Gauge,
  Thermometer,
  Zap,
  Radio,
  Fuel,
  Maximize2,
  Minimize2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Vehicle, HubLocation } from '../types/logistics';

interface LogisticsMapProps {
  vehicles: Vehicle[];
  hubs: HubLocation[];
  selectedVehicle: Vehicle | null;
  onSelectVehicle: (v: Vehicle | null) => void;
  onOpenOptimizerForVehicle?: (v: Vehicle) => void;
}

export const LogisticsMap: React.FC<LogisticsMapProps> = ({
  vehicles,
  hubs,
  selectedVehicle,
  onSelectVehicle,
  onOpenOptimizerForVehicle,
}) => {
  const [zoom, setZoom] = useState(1);
  const [showTraffic, setShowTraffic] = useState(true);
  const [showHubs, setShowHubs] = useState(true);
  const [showOddEvenZone, setShowOddEvenZone] = useState(false);
  const [selectedHub, setSelectedHub] = useState<HubLocation | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoom(1);

  return (
    <div
      className={`relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl transition-all ${
        isFullscreen ? 'fixed inset-4 z-50 rounded-2xl' : 'h-[480px] lg:h-[540px]'
      }`}
    >
      {/* Top Map Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Status Pills */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/70 text-xs font-semibold text-slate-200 flex items-center gap-2 shadow-lg">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Radar Koridor Jabodetabek</span>
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full text-[10px]">
              {vehicles.filter(v => v.status === 'IN_TRANSIT').length} Bergerak
            </span>
          </div>

          {/* Traffic Legend Pill */}
          <div className="hidden sm:flex items-center gap-3 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/70 text-[11px] text-slate-300 shadow-lg">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Lancar
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Padat
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Macet (Tomang/Cikunir)
            </span>
          </div>
        </div>

        {/* Right Map Action Controls */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/70 shadow-lg pointer-events-auto">
          <button
            onClick={() => setShowTraffic(!showTraffic)}
            title="Toggle Kondisi Kemacetan"
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
              showTraffic ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Lalu Lintas
          </button>
          <button
            onClick={() => setShowHubs(!showHubs)}
            title="Toggle Hub / Depo Kargo"
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
              showHubs ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Hub Logistik
          </button>
          <button
            onClick={() => setShowOddEvenZone(!showOddEvenZone)}
            title="Toggle Zona Ganjil Genap Jakarta"
            className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
              showOddEvenZone ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:text-white'
            }`}
          >
            Ganjil-Genap
          </button>

          <div className="w-[1px] h-4 bg-slate-700 mx-1" />

          <button
            onClick={handleZoomIn}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition"
            title="Perbesar"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition"
            title="Perkecil"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition"
            title="Reset Tampilan"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-slate-300 hover:bg-slate-800 transition"
            title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="w-full h-full overflow-hidden flex items-center justify-center bg-[#070b14] relative select-none">
        <svg
          viewBox="0 0 1000 650"
          className="w-full h-full transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})` }}
        >
          <defs>
            {/* Background Map Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#131e33" strokeWidth="0.8" />
            </pattern>
            {/* Sea water pattern */}
            <linearGradient id="seaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#08182b" />
              <stop offset="100%" stopColor="#0c1f38" />
            </linearGradient>
            {/* Land gradient */}
            <linearGradient id="landGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0c1424" />
              <stop offset="100%" stopColor="#0e172a" />
            </linearGradient>
            {/* Pulse Glow Filters */}
            <filter id="glowGreen" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="glowRed" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Base Background Grid */}
          <rect width="1000" height="650" fill="url(#grid)" />

          {/* Java Sea / Teluk Jakarta Coastline Area */}
          <path
            d="M 0,0 L 1000,0 L 1000,120 Q 820,110 700,135 T 580,125 T 420,140 T 260,115 T 0,130 Z"
            fill="url(#seaGrad)"
            opacity="0.9"
          />
          <text x="500" y="55" fill="#2d4869" fontSize="14" fontWeight="600" textAnchor="middle" letterSpacing="4">
            TELUK JAKARTA (LAUT JAWA)
          </text>

          {/* Land Mass Boundary */}
          <path
            d="M 0,130 Q 260,115 420,140 T 580,125 T 700,135 T 1000,120 L 1000,650 L 0,650 Z"
            fill="url(#landGrad)"
            opacity="0.95"
          />

          {/* Odd-Even Zone (Ganjil-Genap) Overlay Polygon if enabled */}
          {showOddEvenZone && (
            <g opacity="0.3">
              <polygon
                points="410,250 560,250 580,380 430,380"
                fill="#f59e0b"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <text x="495" y="320" fill="#f59e0b" fontSize="12" fontWeight="700" textAnchor="middle">
                ZONA GANJIL-GENAP DKI
              </text>
            </g>
          )}

          {/* Regional Road / Highway Network (Jabodetabek) */}
          <g>
            {/* Tol Jagorawi (Cawang -> Bogor/Sentul) */}
            <path
              d="M 540,310 Q 535,420 540,570"
              fill="none"
              stroke="#1e3a5f"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Tol Jakarta-Cikampek (Cawang -> Bekasi -> Cikarang) */}
            <path
              d="M 540,310 Q 670,335 880,360"
              fill="none"
              stroke="#1e3a5f"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Tol Layang MBZ (Elevated Expressway) */}
            <path
              d="M 580,318 Q 710,340 860,362"
              fill="none"
              stroke="#0ea5e9"
              strokeWidth="2.5"
              strokeDasharray="8 4"
              opacity="0.8"
            />
            {/* Tol Bandara Soedyatmo (Pluit/Tomang -> Soetta) */}
            <path
              d="M 220,160 Q 310,190 410,250"
              fill="none"
              stroke="#1e3a5f"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Tol JORR 1 (Lingkar Luar Cengkareng -> Pondok Pinang -> Cikunir) */}
            <path
              d="M 280,260 Q 320,380 440,430 T 680,410 T 780,350"
              fill="none"
              stroke="#1e3a5f"
              strokeWidth="5"
              strokeLinecap="round"
            />
            {/* Tol JORR 2 W2N (Meruya / Kembangan bypass) */}
            <path
              d="M 330,220 Q 340,340 370,440"
              fill="none"
              stroke="#10b981"
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.9"
            />
            {/* Tol Pelabuhan (Tanjung Priok -> Pluit) */}
            <path
              d="M 380,150 Q 480,135 580,120"
              fill="none"
              stroke="#1e3a5f"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* Tol Dalam Kota (Semanggi / Cawang) */}
            <path
              d="M 410,250 Q 470,270 540,310"
              fill="none"
              stroke="#1e3a5f"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </g>

          {/* Traffic Congestion Overlay Lines */}
          {showTraffic && (
            <g>
              {/* Green Flow - JORR 2 and MBZ */}
              <path
                d="M 330,220 Q 340,340 370,440"
                fill="none"
                stroke="#10b981"
                strokeWidth="3.5"
                opacity="0.9"
                filter="url(#glowGreen)"
              />
              <path
                d="M 580,318 Q 710,340 860,362"
                fill="none"
                stroke="#10b981"
                strokeWidth="3"
                opacity="0.85"
              />

              {/* Red Congestion: Simpang Tomang Bottleneck */}
              <path
                d="M 390,240 Q 415,255 435,260"
                fill="none"
                stroke="#ef4444"
                strokeWidth="6"
                strokeLinecap="round"
                filter="url(#glowRed)"
                className="animate-pulse"
              />
              <circle cx="415" cy="250" r="10" fill="#ef4444" opacity="0.3" className="animate-ping" />

              {/* Orange Congestion: Simpang Cikunir */}
              <path
                d="M 680,335 Q 710,342 730,345"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="5"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* City / Hub Names Watermarks */}
          <text x="500" y="275" fill="#1e293b" fontSize="24" fontWeight="800" textAnchor="middle" letterSpacing="6">
            DKI JAKARTA
          </text>
          <text x="820" y="320" fill="#1e293b" fontSize="18" fontWeight="800" textAnchor="middle" letterSpacing="4">
            BEKASI & CIKARANG
          </text>
          <text x="230" y="330" fill="#1e293b" fontSize="18" fontWeight="800" textAnchor="middle" letterSpacing="4">
            TANGERANG RAYA
          </text>
          <text x="540" y="590" fill="#1e293b" fontSize="18" fontWeight="800" textAnchor="middle" letterSpacing="4">
            KORIDOR BOGOR
          </text>

          {/* Hub Pins */}
          {showHubs &&
            hubs.map(hub => {
              const cx = hub.coordinates.x * 10;
              const cy = hub.coordinates.y * 6.5;
              const isSelected = selectedHub?.id === hub.id;
              return (
                <g
                  key={hub.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedHub(hub)}
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 16 : 12}
                    fill={hub.type === 'PORT' ? '#0ea5e9' : hub.type === 'AIRPORT' ? '#8b5cf6' : '#10b981'}
                    opacity="0.25"
                    className="group-hover:opacity-40 transition"
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 8 : 6}
                    fill={hub.type === 'PORT' ? '#38bdf8' : hub.type === 'AIRPORT' ? '#a78bfa' : '#34d399'}
                    stroke="#0f172a"
                    strokeWidth="2"
                  />
                  <rect
                    x={cx - 45}
                    y={cy + 10}
                    width="90"
                    height="18"
                    rx="4"
                    fill="#0f172a"
                    stroke="#334155"
                    strokeWidth="1"
                    opacity="0.9"
                  />
                  <text
                    x={cx}
                    y={cy + 22}
                    fill="#e2e8f0"
                    fontSize="9"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {hub.code}
                  </text>
                </g>
              );
            })}

          {/* Active Vehicles Markers */}
          {vehicles.map(veh => {
            const vx = veh.coordinates.x * 10;
            const vy = veh.coordinates.y * 6.5;
            const isSelected = selectedVehicle?.id === veh.id;
            const isCritical = veh.telematics.coolantTempC > 96 || veh.telematics.oilPressurePsi < 25;
            const isEv = veh.type === 'EV_BLIND_VAN';
            const isColdChain = veh.type === 'CDD_BOX' && veh.telematics.cargoTemperatureC !== undefined;

            return (
              <g
                key={veh.id}
                className="cursor-pointer transition-all duration-300"
                onClick={() => {
                  onSelectVehicle(veh);
                  setSelectedHub(null);
                }}
              >
                {/* Active Ripple */}
                {veh.status === 'IN_TRANSIT' && (
                  <circle
                    cx={vx}
                    cy={vy}
                    r={isSelected ? 24 : 18}
                    fill={isCritical ? '#ef4444' : isEv ? '#06b6d4' : '#10b981'}
                    opacity="0.2"
                    className="animate-pulse"
                  />
                )}

                {/* Outer Ring */}
                <circle
                  cx={vx}
                  cy={vy}
                  r={isSelected ? 13 : 9}
                  fill={
                    isCritical
                      ? '#ef4444'
                      : veh.status === 'MAINTENANCE'
                      ? '#f97316'
                      : isEv
                      ? '#06b6d4'
                      : isColdChain
                      ? '#38bdf8'
                      : '#10b981'
                  }
                  stroke="#ffffff"
                  strokeWidth={isSelected ? 3 : 1.5}
                />

                {/* Inner Icon representation */}
                <circle cx={vx} cy={vy} r={isSelected ? 5 : 3.5} fill="#090d16" />

                {/* Callout Label Tag */}
                <g transform={`translate(${vx + 12}, ${vy - 12})`}>
                  <rect
                    width="78"
                    height="20"
                    rx="5"
                    fill={isSelected ? '#0284c7' : '#0f172a'}
                    stroke={isSelected ? '#38bdf8' : '#334155'}
                    strokeWidth="1"
                    opacity="0.95"
                  />
                  <text x="6" y="14" fill="#ffffff" fontSize="9" fontWeight="700">
                    {veh.plateNumber.split(' ')[0]} {veh.plateNumber.split(' ')[1]}
                  </text>
                  <text
                    x="72"
                    y="14"
                    fill={isCritical ? '#f87171' : '#34d399'}
                    fontSize="8"
                    fontWeight="600"
                    textAnchor="end"
                  >
                    {veh.telematics.speedKmH}k
                  </text>
                </g>
              </g>
            );
          })}
        </svg>

        {/* Selected Vehicle Floating Telematics Inspector */}
        {selectedVehicle && (
          <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-2xl z-30 text-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-start justify-between pb-2.5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                  <Navigation className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-white tracking-wide">
                      {selectedVehicle.plateNumber}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        selectedVehicle.status === 'IN_TRANSIT'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : selectedVehicle.status === 'LOADING'
                          ? 'bg-cyan-500/20 text-cyan-400'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {selectedVehicle.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{selectedVehicle.model}</p>
                </div>
              </div>
              <button
                onClick={() => onSelectVehicle(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            {/* Location & Destination */}
            <div className="py-2.5 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Posisi Terkini:</span>
                <span className="font-medium text-slate-200">{selectedVehicle.currentLocationName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Tujuan Pengiriman:</span>
                <span className="font-medium text-slate-200">{selectedVehicle.targetDestination}</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span>Estimasi Tiba (ETA):</span>
                <span className="font-bold text-emerald-400">{selectedVehicle.eta}</span>
              </div>
            </div>

            {/* Live OBD-II Telematics Grid */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Kecepatan</span>
                <span className="text-sm font-bold text-slate-100 flex items-center justify-center gap-1 mt-0.5">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  {selectedVehicle.telematics.speedKmH} <span className="text-[10px] font-normal">km/h</span>
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Suhu Mesin</span>
                <span
                  className={`text-sm font-bold flex items-center justify-center gap-1 mt-0.5 ${
                    selectedVehicle.telematics.coolantTempC > 95 ? 'text-rose-400' : 'text-slate-100'
                  }`}
                >
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  {selectedVehicle.telematics.coolantTempC}°C
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">
                  {selectedVehicle.type === 'EV_BLIND_VAN' ? 'Baterai (SoC)' : 'Bahan Bakar'}
                </span>
                <span className="text-sm font-bold text-slate-100 flex items-center justify-center gap-1 mt-0.5">
                  {selectedVehicle.type === 'EV_BLIND_VAN' ? (
                    <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Fuel className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  {selectedVehicle.telematics.fuelLevelPercent}%
                </span>
              </div>
            </div>

            {/* Cold Chain Sensor if applicable */}
            {selectedVehicle.telematics.cargoTemperatureC !== undefined && (
              <div className="mt-2 p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-300 font-semibold">Sensor Cold Chain Kargo:</span>
                </div>
                <span className="font-bold text-white bg-cyan-500/20 px-2 py-0.5 rounded">
                  {selectedVehicle.telematics.cargoTemperatureC}°C
                </span>
              </div>
            )}

            {/* Driver & Action */}
            <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src={selectedVehicle.driverAvatar}
                  alt={selectedVehicle.driverName}
                  className="w-7 h-7 rounded-full object-cover border border-slate-600"
                />
                <div>
                  <p className="text-xs font-semibold text-slate-200">{selectedVehicle.driverName}</p>
                  <p className="text-[10px] text-slate-400">{selectedVehicle.driverPhone}</p>
                </div>
              </div>

              {onOpenOptimizerForVehicle && (
                <button
                  onClick={() => onOpenOptimizerForVehicle(selectedVehicle)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition"
                >
                  Optimalkan Rute AI
                </button>
              )}
            </div>
          </div>
        )}

        {/* Selected Hub Floating Flyout */}
        {selectedHub && (
          <div className="absolute top-16 left-4 sm:w-80 bg-slate-900/95 backdrop-blur-xl border border-slate-700 p-4 rounded-2xl shadow-2xl z-30 text-slate-100">
            <div className="flex items-start justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 uppercase">
                  {selectedHub.type}
                </span>
                <h4 className="font-bold text-sm text-white mt-1">{selectedHub.name}</h4>
                <p className="text-xs text-slate-400">{selectedHub.city}</p>
              </div>
              <button onClick={() => setSelectedHub(null)} className="text-slate-400 hover:text-white p-1">
                ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3 text-center">
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400">Truk Inbound</span>
                <span className="text-base font-bold text-emerald-400 block mt-0.5">
                  {selectedHub.activeInbound} Unit
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400">Truk Outbound</span>
                <span className="text-base font-bold text-cyan-400 block mt-0.5">
                  {selectedHub.activeOutbound} Unit
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
