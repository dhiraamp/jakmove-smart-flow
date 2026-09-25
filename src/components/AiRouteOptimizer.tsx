import React, { useState } from 'react';
import {
  Sparkles,
  Route,
  ArrowRight,
  TrendingDown,
  Clock,
  Fuel,
  Leaf,
  DollarSign,
  AlertTriangle,
  CheckCircle2,
  Send,
  Sliders,
  ShieldCheck,
  Zap,
  Info,
  Layers,
} from 'lucide-react';
import { Vehicle, RouteOptimizationResult } from '../types/logistics';

interface AiRouteOptimizerProps {
  initialVehicle?: Vehicle | null;
}

export const AiRouteOptimizer: React.FC<AiRouteOptimizerProps> = ({ initialVehicle }) => {
  const [origin, setOrigin] = useState('Pelabuhan Tanjung Priok (JICT)');
  const [destination, setDestination] = useState('Distribution Center Cikarang Dry Port');
  const [waypoints, setWaypoints] = useState<string[]>(['Kawasan Pergudangan Pluit']);
  const [vehicleType, setVehicleType] = useState(
    initialVehicle?.typeName || 'CDD Box (Diesel 6 Roda)'
  );
  const [cargoType, setCargoType] = useState('General Cargo FMCG');
  const [priority, setPriority] = useState<'fuel_efficiency' | 'fastest_time' | 'eco_lowest_co2' | 'avoid_congestion'>('fuel_efficiency');
  const [oddEvenRule, setOddEvenRule] = useState(true);

  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RouteOptimizationResult | null>(null);
  const [appliedNotification, setAppliedNotification] = useState<string | null>(null);

  const handleOptimize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setAppliedNotification(null);

    try {
      const response = await fetch('/api/ai/optimize-route', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          destination,
          waypoints,
          vehicleType,
          cargoType,
          priority,
          oddEvenRule,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setResult(json.data);
      }
    } catch (err) {
      console.error('Error optimizing route:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToDriver = () => {
    setAppliedNotification('Rute AI Eco-Smart berhasil disinkronisasi ke konsol tablet pengemudi & GPS telematic onboard!');
    setTimeout(() => setAppliedNotification(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Optimalisasi Rute AI & Efisiensi Bahan Bakar
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Algoritma AI menganalisis kemacetan real-time Jakarta, aturan ganjil-genap, tonase muatan, dan putaran RPM mesin untuk rute paling hemat bahan bakar.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5" />
            Model AI: Gemini 3.8 Flash Aktif
          </span>
        </div>
      </div>

      {/* Main Grid: Form Inputs (Left) and AI Results Comparison (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form: Parameters Configuration (5 Cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-cyan-400" />
              <h3 className="font-bold text-sm text-white">Parameter Pengiriman & Armada</h3>
            </div>
            <span className="text-[10px] text-slate-400">Jabodetabek Corridor</span>
          </div>

          <form onSubmit={handleOptimize} className="space-y-3.5 text-xs">
            {/* Origin Hub */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Titik Asal (Hub Penjemputan / Gudang)</label>
              <select
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:border-emerald-500"
              >
                <option value="Pelabuhan Tanjung Priok (JICT)">Pelabuhan Tanjung Priok (JICT)</option>
                <option value="Terminal Kargo Bandara Soekarno-Hatta">Terminal Kargo Bandara Soetta</option>
                <option value="Central Logistics Hub Cakung">Central Logistics Hub Cakung</option>
                <option value="Distribution Center Cikarang Dry Port">DC Cikarang Dry Port</option>
                <option value="Kawasan Pergudangan Pluit">Kawasan Pergudangan Pluit</option>
                <option value="MM2100 Industrial Logistics Cibitung">MM2100 Cibitung</option>
              </select>
            </div>

            {/* Destination Hub */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Titik Tujuan Pengiriman</label>
              <select
                value={destination}
                onChange={e => setDestination(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:border-emerald-500"
              >
                <option value="Distribution Center Cikarang Dry Port">DC Cikarang Dry Port (GIIC)</option>
                <option value="Hypermart Mall Puri Indah, Jakarta Barat">Hypermart Puri Indah, Jakbar</option>
                <option value="Logistics Depot BSD Serpong">Logistics Depot BSD Serpong</option>
                <option value="DC Sentul Terpadu Bogor">DC Sentul Terpadu Bogor</option>
                <option value="Fulfillment Hub Cilandak KKO, Jakarta Selatan">Hub Cilandak KKO, Jaksel</option>
                <option value="Kawasan Berikat MM2100 Cibitung">Kawasan Berikat MM2100 Cibitung</option>
              </select>
            </div>

            {/* Vehicle Type */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tipe Kendaraan</label>
                <select
                  value={vehicleType}
                  onChange={e => setVehicleType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:border-emerald-500"
                >
                  <option value="CDD Box (Diesel 6 Roda)">CDD Box (6 Ban)</option>
                  <option value="Blind Van Listrik (EV)">Blind Van Listrik (EV)</option>
                  <option value="Fuso Heavy Duty (8 Ton)">Fuso Heavy Duty (8 Ton)</option>
                  <option value="Wingbox 10 Roda (16 Ton)">Wingbox 10 Roda (16 Ton)</option>
                  <option value="Tronton Trailer Kontainer 40ft">Tronton Trailer Kontainer</option>
                  <option value="CDE Engkel 4 Roda">CDE Engkel 4 Roda</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sensitivitas Kargo</label>
                <select
                  value={cargoType}
                  onChange={e => setCargoType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:border-emerald-500"
                >
                  <option value="General Cargo FMCG">General Cargo (FMCG)</option>
                  <option value="Cold Chain (-18°C Chilled)">Cold Chain (-18°C Pangan)</option>
                  <option value="High Value Electronics">Elektronik Bernilai Tinggi</option>
                  <option value="Heavy Industrial Machinery">Mesin Berat Industri</option>
                </select>
              </div>
            </div>

            {/* Prioritas Optimasi */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Prioritas Optimasi AI</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPriority('fuel_efficiency')}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    priority === 'fuel_efficiency'
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="block font-semibold">Efisiensi Bahan Bakar</span>
                  <span className="text-[10px] opacity-80">Jelajah RPM stabil & tol hemat</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPriority('fastest_time')}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    priority === 'fastest_time'
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="block font-semibold">Waktu Tercepat</span>
                  <span className="text-[10px] opacity-80">Bypass kemacetan via tol MBZ/JORR</span>
                </button>
              </div>
            </div>

            {/* Odd Even Rule Checkbox */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <div>
                  <span className="font-semibold text-slate-200 block">Kepatuhan Ganjil-Genap Jakarta</span>
                  <span className="text-[10px] text-slate-400">Verifikasi plat nomor dengan tanggal hari ini</span>
                </div>
              </div>
              <input
                type="checkbox"
                checked={oddEvenRule}
                onChange={e => setOddEvenRule(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isLoading ? 'Menjalankan Analisis AI...' : 'Jalankan Optimalisasi Rute AI'}</span>
            </button>
          </form>
        </div>

        {/* Right Output: Comparative Analysis (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {!result && !isLoading && (
            <div className="h-full flex flex-col items-center justify-center p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-emerald-400 border border-slate-700">
                <Route className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Siap Menghitung Rute Paling Hemat</h3>
              <p className="text-xs text-slate-400 max-w-md">
                Klik tombol <strong className="text-emerald-400">"Jalankan Optimalisasi Rute AI"</strong> untuk melihat perbandingan rute standar vs rute pintar AI, kalkulasi penghematan BBM solar/kWh, serta rekomendasi lajur bebas hambatan.
              </p>
              <button
                onClick={() => handleOptimize()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-semibold"
              >
                Mulai Simulasi Standar Sekarang
              </button>
            </div>
          )}

          {isLoading && (
            <div className="h-full flex flex-col items-center justify-center p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
              <h3 className="font-bold text-sm text-white">AI Mengkalkulasi Koridor Terbaik...</h3>
              <p className="text-xs text-slate-400">
                Membaca sensor lalu lintas JORR W2N, MBZ Elevated, dan konsumsi energi armada.
              </p>
            </div>
          )}

          {result && !isLoading && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* Notification Banner when applied */}
              {appliedNotification && (
                <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{appliedNotification}</span>
                </div>
              )}

              {/* Rationale Summary Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-slate-200">Hasil Analisis Rekayasa Rute AI</span>
                  </div>
                  <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Eco-Score {result.ecoScore}/100
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{result.summary}</p>
              </div>

              {/* Side-by-Side Route Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Standard Route Card */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-slate-400 uppercase">Rute Standar (Tanpa AI)</span>
                    <span className="text-[10px] text-rose-400 font-semibold">Banyak Hambatan</span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium">{result.standardRoute.routeVia}</p>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Jarak Tempuh:</span>
                      <span className="font-semibold text-white">{result.standardRoute.distanceKm} KM</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Estimasi Waktu:</span>
                      <span className="font-semibold text-rose-400">{result.standardRoute.durationMins} Menit</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Konsumsi Solar:</span>
                      <span className="font-semibold text-white">{result.standardRoute.fuelLiters} Liter</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Tarif Tol:</span>
                      <span className="font-semibold text-white">Rp {result.standardRoute.tollCostRp.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Emisi CO2:</span>
                      <span className="font-semibold text-slate-400">{result.standardRoute.co2Kg} kg</span>
                    </div>
                  </div>
                </div>

                {/* AI Eco-Smart Route Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/40 space-y-3 shadow-xl relative overflow-hidden">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-500/30">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs font-extrabold text-emerald-400 uppercase">Rute Cerdas AI Eco-Flow</span>
                    </div>
                    <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/20 px-2 py-0.5 rounded">
                      Rekomendasi Utama
                    </span>
                  </div>

                  <p className="text-xs text-white font-medium">{result.optimizedRoute.routeVia}</p>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between text-slate-400">
                      <span>Jarak Tempuh:</span>
                      <span className="font-semibold text-white">{result.optimizedRoute.distanceKm} KM</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Estimasi Waktu:</span>
                      <span className="font-bold text-emerald-400">{result.optimizedRoute.durationMins} Menit</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Konsumsi Solar:</span>
                      <span className="font-bold text-emerald-400">{result.optimizedRoute.fuelLiters} Liter</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Tarif Tol:</span>
                      <span className="font-semibold text-white">Rp {result.optimizedRoute.tollCostRp.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Emisi CO2:</span>
                      <span className="font-bold text-teal-400">{result.optimizedRoute.co2Kg} kg</span>
                    </div>
                  </div>

                  {/* Savings Highlights Badge */}
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] space-y-1">
                    <div className="flex items-center justify-between text-emerald-300 font-bold">
                      <span>Penghematan BBM Solar:</span>
                      <span>{result.optimizedRoute.fuelSavedLiters} L (Rp {result.optimizedRoute.costSavedRp.toLocaleString()})</span>
                    </div>
                    <div className="flex items-center justify-between text-teal-300">
                      <span>Waktu Dipangkas:</span>
                      <span>{result.standardRoute.durationMins - result.optimizedRoute.durationMins} Menit Lebih Cepat</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Traffic Bottlenecks Avoided */}
              {result.trafficBottlenecks && result.trafficBottlenecks.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Titik Kemacetan yang Berhasil Dihindari AI:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {result.trafficBottlenecks.map((b, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                        <span className="font-bold text-slate-200 block">{b.location}</span>
                        <span className="text-[11px] text-rose-400 font-semibold">{b.status}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">{b.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Turn-by-Turn AI Guidance */}
              {result.aiRecommendations && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <h4 className="font-bold text-slate-200 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-cyan-400" />
                    Instruksi Taktis untuk Pengemudi & Dispatcher:
                  </h4>
                  <ul className="space-y-1.5 text-slate-300 pl-4 list-disc">
                    {result.aiRecommendations.map((rec, idx) => (
                      <li key={idx} className="leading-relaxed">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action: Send to Driver */}
              <div className="flex justify-end">
                <button
                  onClick={handleApplyToDriver}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>Terapkan ke Pengemudi & Kirim ke GPS Truk</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
