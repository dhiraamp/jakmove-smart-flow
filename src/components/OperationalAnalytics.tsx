import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Clock,
  Fuel,
  Leaf,
  DollarSign,
  Truck,
  CheckCircle2,
  AlertCircle,
  PieChart,
  Layers,
  ArrowUpRight,
  Printer,
} from 'lucide-react';
import { OperationalKPIs } from '../types/logistics';

interface OperationalAnalyticsProps {
  kpis: OperationalKPIs;
}

export const OperationalAnalytics: React.FC<OperationalAnalyticsProps> = ({ kpis }) => {
  const [timeRange, setTimeRange] = useState<'TODAY' | 'WEEK' | 'MONTH'>('WEEK');
  const [showExportModal, setShowExportModal] = useState(false);

  // Mock Trend Data for Charts
  const weeklyOtdData = [
    { day: 'Sen', onTime: 95.2, delayed: 4.8, trips: 142 },
    { day: 'Sel', onTime: 96.1, delayed: 3.9, trips: 156 },
    { day: 'Rab', onTime: 94.8, delayed: 5.2, trips: 148 },
    { day: 'Kam', onTime: 97.4, delayed: 2.6, trips: 162 },
    { day: 'Jum', onTime: 96.8, delayed: 3.2, trips: 170 },
    { day: 'Sab', onTime: 98.2, delayed: 1.8, trips: 110 },
    { day: 'Min', onTime: 98.9, delayed: 1.1, trips: 84 },
  ];

  const fuelEfficiencyTrend = [
    { label: 'Sen', actual: 6.1, target: 6.5, savingsLiters: 480 },
    { label: 'Sel', actual: 6.3, target: 6.5, savingsLiters: 520 },
    { label: 'Rab', actual: 6.2, target: 6.5, savingsLiters: 490 },
    { label: 'Kam', actual: 6.6, target: 6.5, savingsLiters: 580 },
    { label: 'Jum', actual: 6.4, target: 6.5, savingsLiters: 540 },
    { label: 'Sab', actual: 6.8, target: 6.5, savingsLiters: 610 },
    { label: 'Min', actual: 6.9, target: 6.5, savingsLiters: 620 },
  ];

  const corridorDistribution = [
    { name: 'Koridor Cikarang & Karawang (Manufaktur)', share: 38, tons: 70.1, color: '#10b981' },
    { name: 'Koridor Tanjung Priok & Marunda (Kontainer)', share: 26, tons: 48.0, color: '#0ea5e9' },
    { name: 'Koridor Tangerang & Bandara Soetta (Kargo Udara)', share: 18, tons: 33.2, color: '#8b5cf6' },
    { name: 'Koridor Jakarta Retail & E-Commerce', share: 12, tons: 22.1, color: '#f59e0b' },
    { name: 'Koridor Sentul & Bogor (FMCG Chilled)', share: 6, tons: 11.2, color: '#ec4899' },
  ];

  const costBreakdown = [
    { category: 'Bahan Bakar Solar & EV Charging', amountRp: 142500000, percent: 42, color: 'bg-emerald-500' },
    { category: 'Tol Jabodetabek & Trans-Jawa', amountRp: 84800000, percent: 25, color: 'bg-cyan-500' },
    { category: 'Uang Jalan & Tunjangan Sopir', amountRp: 67800000, percent: 20, color: 'bg-amber-500' },
    { category: 'Perawatan & Suku Cadang Bengkel', amountRp: 44100000, percent: 13, color: 'bg-purple-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            Dasbor Analitik Operasional & Efisiensi Armada
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Laporan data eksekutif untuk Manajer Operasional: Ketepatan waktu, konsumsi BBM, emisi ESG, dan beban biaya.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time range toggle */}
          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setTimeRange('TODAY')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                timeRange === 'TODAY' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Hari Ini
            </button>
            <button
              onClick={() => setTimeRange('WEEK')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                timeRange === 'WEEK' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              7 Hari Terakhir
            </button>
            <button
              onClick={() => setTimeRange('MONTH')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                timeRange === 'MONTH' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bulan Ini
            </button>
          </div>

          <button
            onClick={() => setShowExportModal(true)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Ekspor Laporan</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* On-Time Delivery */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Rata-Rata OTD</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">96.8%</span>
            <span className="text-xs text-emerald-400 font-bold">+2.3% vs SLA</span>
          </div>
          <p className="text-[11px] text-slate-400">Total 972 pengiriman tepat waktu minggu ini</p>
        </div>

        {/* Turnaround Time */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Turnaround Time (TAT)</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">42.5</span>
            <span className="text-xs text-slate-400 font-normal">Menit</span>
            <span className="text-xs text-emerald-400 font-bold">-8.5 mnt (Lebih Cepat)</span>
          </div>
          <p className="text-[11px] text-slate-400">Waktu proses muat di depo Cikarang & Priok</p>
        </div>

        {/* Fuel OPEX Saved */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Penghematan BBM Solar</span>
            <Fuel className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">3.840 L</span>
            <span className="text-xs text-emerald-400 font-bold">Rp 55.68 Juta</span>
          </div>
          <p className="text-[11px] text-slate-400">Optimalisasi rute AI & cruise RPM stabil</p>
        </div>

        {/* Carbon ESG Footprint */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Reduksi Emisi Karbon</span>
            <Leaf className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">10.29</span>
            <span className="text-xs text-slate-400 font-normal">Ton CO2e</span>
            <span className="text-xs text-teal-400 font-bold">Terselamatkan</span>
          </div>
          <p className="text-[11px] text-slate-400">Memenuhi standar audit kepatuhan hijau ISO 14064</p>
        </div>
      </div>

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: On-Time Delivery Trend (Stacked SVG Bar Chart) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Tren Ketepatan Waktu Pengiriman (OTD vs Keterlambatan)
              </h3>
              <p className="text-xs text-slate-400">Persentase pengiriman tiba sesuai jendela SLA penerima</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span> Tepat Waktu
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span> Tertunda
              </span>
            </div>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-60 w-full pt-4">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Horizontal Reference Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
              <text x="32" y="24" fill="#64748b" fontSize="10" textAnchor="end">100%</text>

              <line x1="40" y1="80" x2="480" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
              <text x="32" y="84" fill="#64748b" fontSize="10" textAnchor="end">95%</text>

              <line x1="40" y1="140" x2="480" y2="140" stroke="#1e293b" strokeDasharray="3 3" />
              <text x="32" y="144" fill="#64748b" fontSize="10" textAnchor="end">90%</text>

              {/* Data Bars */}
              {weeklyOtdData.map((d, i) => {
                const x = 70 + i * 58;
                // Height based on percentage: 100% = 140px
                const onTimeH = (d.onTime / 100) * 140;
                const delayedH = (d.delayed / 100) * 140;

                return (
                  <g key={d.day} className="group cursor-pointer">
                    {/* On-Time Bar */}
                    <rect
                      x={x - 12}
                      y={160 - onTimeH}
                      width="24"
                      height={onTimeH}
                      rx="3"
                      fill="#10b981"
                      className="group-hover:fill-emerald-400 transition"
                    />
                    {/* Delayed Bar Stack on top */}
                    <rect
                      x={x - 12}
                      y={160 - onTimeH - delayedH}
                      width="24"
                      height={delayedH}
                      rx="2"
                      fill="#ef4444"
                    />
                    {/* Day label */}
                    <text
                      x={x}
                      y="180"
                      fill="#94a3b8"
                      fontSize="11"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {d.day}
                    </text>
                    {/* Value percentage */}
                    <text
                      x={x}
                      y={150 - onTimeH}
                      fill="#ffffff"
                      fontSize="10"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {d.onTime}%
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
            <span>Rata-rata OTD tertinggi: <strong className="text-emerald-400">98.9% (Minggu)</strong> karena tidak ada pembatasan ganjil-genap.</span>
          </div>
        </div>

        {/* Chart 2: Fuel Efficiency vs AI Target (Dual Area/Line Curve) */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Fuel className="w-4 h-4 text-teal-400" />
                Efisiensi Konsumsi BBM (km/L) Aktual vs Target AI
              </h3>
              <p className="text-xs text-slate-400">Pencapaian kilometer per liter armada diesel & EV equivalency</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Aktual
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-0.5 bg-emerald-400"></span> Target AI (6.5 km/L)
              </span>
            </div>
          </div>

          {/* SVG Line / Area Graph */}
          <div className="h-60 w-full pt-4">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Reference Grid */}
              <line x1="40" y1="40" x2="480" y2="40" stroke="#1e293b" strokeDasharray="3 3" />
              <text x="32" y="44" fill="#64748b" fontSize="10" textAnchor="end">7.0</text>

              <line x1="40" y1="90" x2="480" y2="90" stroke="#1e293b" strokeDasharray="3 3" />
              <text x="32" y="94" fill="#64748b" fontSize="10" textAnchor="end">6.5</text>

              <line x1="40" y1="140" x2="480" y2="140" stroke="#1e293b" strokeDasharray="3 3" />
              <text x="32" y="144" fill="#64748b" fontSize="10" textAnchor="end">6.0</text>

              {/* AI Target Line (6.5 km/L) */}
              <line x1="40" y1="90" x2="480" y2="90" stroke="#10b981" strokeWidth="2" strokeDasharray="5 4" />

              {/* Actual Line Polygon Fill */}
              <polygon
                points="70,130 130,110 190,120 250,80 310,100 370,60 430,50 430,160 70,160"
                fill="url(#actualGradient)"
              />

              {/* Actual Curve Line */}
              <polyline
                points="70,130 130,110 190,120 250,80 310,100 370,60 430,50"
                fill="none"
                stroke="#06b6d4"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {fuelEfficiencyTrend.map((pt, i) => {
                const x = 70 + i * 60;
                // mapping 6.0 to 140, 7.0 to 40
                const y = 140 - (pt.actual - 6.0) * 100;
                return (
                  <g key={pt.label}>
                    <circle cx={x} cy={y} r="5" fill="#06b6d4" stroke="#0f172a" strokeWidth="2" />
                    <text x={x} y="180" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">
                      {pt.label}
                    </text>
                    <text x={x} y={y - 10} fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle">
                      {pt.actual}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between">
            <span>Rata-rata mingguan: <strong className="text-cyan-400">6.47 km/L</strong> (+18.2% efisiensi dibanding sebelum integrasi AI).</span>
          </div>
        </div>
      </div>

      {/* Secondary Analytics Row: Cargo Tonnage by Corridor & Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Corridor Tonnage Distribution */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                Distribusi Volume Muatan per Koridor Distribusi Jabodetabek
              </h3>
              <p className="text-xs text-slate-400">
                Total kargo aktif hari ini: <strong className="text-white">184.6 Ton</strong>
              </p>
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            {corridorDistribution.map(cor => (
              <div key={cor.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cor.color }} />
                    <span className="font-semibold text-slate-200">{cor.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-mono">{cor.tons} Ton</span>
                    <span className="font-bold text-white">{cor.share}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="h-2 rounded-full transition-all duration-500"
                    style={{ width: `${cor.share}%`, backgroundColor: cor.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Operational Expenditure Structure */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-amber-400" />
              Struktur Biaya Operasional (Bulan Berjalan)
            </h3>
            <p className="text-xs text-slate-400">
              Total Pengeluaran: <strong className="text-white">Rp 339.2 Juta</strong>
            </p>
          </div>

          <div className="space-y-3 pt-2">
            {costBreakdown.map(item => (
              <div key={item.category} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{item.category}</span>
                  <span className="font-bold text-white">{item.percent}%</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono">Rp {(item.amountRp / 1000000).toFixed(1)} Juta</span>
                  <span className="text-emerald-400 font-medium">Dalam Anggaran</span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div className={`h-1.5 rounded-full ${item.color}`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Report Printable Modal */}
      {showExportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Download className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Ekspor Laporan Audit Operasional</h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <p>Laporan audit komprehensif merangkum metrik performa armada berikut:</p>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                <div>• Periode: 2026-09-18 s/d 2026-09-25 WIB</div>
                <div>• Total Armada: 28 Unit Aktif (Utilitas 88.4%)</div>
                <div>• On-Time Delivery Rate: 96.8% (Target SLA Tercapai)</div>
                <div>• Penghematan Bahan Bakar AI: 3.840 Liter Solar (Rp 55.680.000)</div>
                <div>• Total Reduksi Emisi Karbon: 10.29 Ton CO2e</div>
                <div>• Status Kepatuhan HOS Sopir: 97.4% Patuh Regulasi Kemenhub</div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  window.print();
                  setShowExportModal(false);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Simpan PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
