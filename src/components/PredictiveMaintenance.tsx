import React, { useState } from 'react';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Gauge,
  Thermometer,
  Zap,
  Activity,
  FileText,
  DollarSign,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Calendar,
  Check,
} from 'lucide-react';
import { Vehicle, MaintenanceAlert } from '../types/logistics';

interface PredictiveMaintenanceProps {
  vehicles: Vehicle[];
  alerts: MaintenanceAlert[];
  onResolveAlert?: (alertId: string) => void;
}

export const PredictiveMaintenance: React.FC<PredictiveMaintenanceProps> = ({
  vehicles,
  alerts,
  onResolveAlert,
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicles[0]?.id || '');
  const [activeAlertsList, setActiveAlertsList] = useState<MaintenanceAlert[]>(alerts);
  const [analyzingAi, setAnalyzingAi] = useState(false);
  const [aiReport, setAiReport] = useState<any | null>(null);
  const [selectedWorkOrderAlert, setSelectedWorkOrderAlert] = useState<MaintenanceAlert | null>(null);
  const [spkApprovedToast, setSpkApprovedToast] = useState<string | null>(null);

  const currentVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  const handleRunAiDiagnostics = async () => {
    if (!currentVehicle) return;
    setAnalyzingAi(true);
    setAiReport(null);

    try {
      const response = await fetch('/api/ai/predictive-maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleId: currentVehicle.id,
          plate: currentVehicle.plateNumber,
          model: currentVehicle.model,
          mileage: currentVehicle.odometerKm,
          coolantTemp: currentVehicle.telematics.coolantTempC,
          oilPressure: currentVehicle.telematics.oilPressurePsi,
          brakeWear: currentVehicle.telematics.brakePadWearPercent,
          vibrationHz: currentVehicle.telematics.vibrationHz,
          batteryHealth: currentVehicle.telematics.batteryHealthPercent,
        }),
      });

      const json = await response.json();
      if (json.success && json.data) {
        setAiReport(json.data);
      }
    } catch (err) {
      console.error('Error running AI diagnostics:', err);
    } finally {
      setAnalyzingAi(false);
    }
  };

  const handleApproveSpk = (alert: MaintenanceAlert) => {
    setActiveAlertsList(prev =>
      prev.map(a => (a.id === alert.id ? { ...a, isResolved: true } : a))
    );
    if (onResolveAlert) onResolveAlert(alert.id);
    setSelectedWorkOrderAlert(null);
    setSpkApprovedToast(`Surat Perintah Kerja (SPK) untuk ${alert.plateNumber} resmi disetujui & diteruskan ke Bengkel Depo.`);
    setTimeout(() => setSpkApprovedToast(null), 5000);
  };

  const criticalCount = activeAlertsList.filter(a => a.severity === 'CRITICAL' && !a.isResolved).length;
  const warningCount = activeAlertsList.filter(a => a.severity === 'WARNING' && !a.isResolved).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            Sistem Peringatan Dini Pemeliharaan Berbasis Kondisi Mesin
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis prediktif telemetri OBD-II / CAN-Bus untuk mencegah kerusakan mesin mendadak di jalan raya dan menghemat biaya perawatan.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-xl font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
            {criticalCount} Peringatan Kritis
          </span>
          <span className="text-xs px-3 py-1.5 rounded-xl font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
            {warningCount} Waspada
          </span>
        </div>
      </div>

      {spkApprovedToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{spkApprovedToast}</span>
        </div>
      )}

      {/* Main Grid: Live Diagnostics Workstation & Active Alert Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 Cols): Live Vehicle Telematics Diagnostics & AI Analyzer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Telemetri Sensor Mesin OBD-II Real-Time</h3>
              </div>

              {/* Vehicle Selector */}
              <select
                value={selectedVehicleId}
                onChange={e => setSelectedVehicleId(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-1.5 focus:border-emerald-500"
              >
                {vehicles.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.plateNumber} - {v.model}
                  </option>
                ))}
              </select>
            </div>

            {/* Vehicle Header Info */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800/80 text-xs">
              <div>
                <span className="font-extrabold text-white text-sm">{currentVehicle.plateNumber}</span>
                <p className="text-slate-400">{currentVehicle.model} • Driver: {currentVehicle.driverName}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-400">Odometer:</span>
                <span className="font-bold text-emerald-400 block font-mono">
                  {currentVehicle.odometerKm.toLocaleString()} KM
                </span>
              </div>
            </div>

            {/* OBD-II Telematics Gauges Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {/* Coolant Temp */}
              <div
                className={`p-3 rounded-xl border text-center space-y-1 ${
                  currentVehicle.telematics.coolantTempC > 96
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                  <Thermometer className="w-3.5 h-3.5" />
                  <span>Suhu Coolant</span>
                </div>
                <span className="text-xl font-extrabold text-white block">
                  {currentVehicle.telematics.coolantTempC}°C
                </span>
                <span className="text-[10px] text-slate-400 block">Ambang: &lt;95°C</span>
              </div>

              {/* Oil Pressure */}
              <div
                className={`p-3 rounded-xl border text-center space-y-1 ${
                  currentVehicle.telematics.oilPressurePsi < 25
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>Tekanan Oli</span>
                </div>
                <span className="text-xl font-extrabold text-white block">
                  {currentVehicle.telematics.oilPressurePsi} PSI
                </span>
                <span className="text-[10px] text-slate-400 block">Ambang: 28-45 PSI</span>
              </div>

              {/* Brake Pad Wear */}
              <div
                className={`p-3 rounded-xl border text-center space-y-1 ${
                  currentVehicle.telematics.brakePadWearPercent > 75
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                  <Wrench className="w-3.5 h-3.5" />
                  <span>Keausan Kampas Rem</span>
                </div>
                <span className="text-xl font-extrabold text-white block">
                  {currentVehicle.telematics.brakePadWearPercent}%
                </span>
                <span className="text-[10px] text-slate-400 block">Batas Kritis: &gt;75%</span>
              </div>

              {/* Drivetrain Vibration */}
              <div
                className={`p-3 rounded-xl border text-center space-y-1 ${
                  currentVehicle.telematics.vibrationHz > 35
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Getaran Gardan / Kopel</span>
                </div>
                <span className="text-xl font-extrabold text-white block">
                  {currentVehicle.telematics.vibrationHz} Hz
                </span>
                <span className="text-[10px] text-slate-400 block">Batas: &lt;30 Hz</span>
              </div>

              {/* Battery Health */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1 text-slate-300">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kesehatan Aki</span>
                </div>
                <span className="text-xl font-extrabold text-white block">
                  {currentVehicle.telematics.batteryHealthPercent}%
                </span>
                <span className="text-[10px] text-slate-400 block">Voltase 24V Stabil</span>
              </div>

              {/* TPMS Summary */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center space-y-1 text-slate-300">
                <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
                  <Gauge className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Rata-Rata TPMS</span>
                </div>
                <span className="text-xl font-extrabold text-white block">
                  {currentVehicle.telematics.tirePressurePsi.frontLeft} PSI
                </span>
                <span className="text-[10px] text-emerald-400 block">Tekanan Rata</span>
              </div>
            </div>

            {/* Run AI Diagnostics Button */}
            <button
              onClick={handleRunAiDiagnostics}
              disabled={analyzingAi}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {analyzingAi ? 'AI Sedang Menganalisis Pola Telemetri...' : `Jalankan Diagnosa Prediktif AI (${currentVehicle.plateNumber})`}
              </span>
            </button>

            {/* AI Diagnostics Report Result */}
            {aiReport && (
              <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-xs text-white">Hasil Diagnosis Prediktif Gemini AI</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      aiReport.status === 'CRITICAL'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : aiReport.status === 'WARNING'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    STATUS: {aiReport.status}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Prediksi Kegagalan / Mogok:</span>
                    <span className="font-bold text-rose-400">~{aiReport.predictedFailureInKm} KM lagi</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Skor Kesehatan Mesin:</span>
                    <span className="font-bold text-white">{aiReport.healthScore} / 100</span>
                  </div>
                  <p className="text-slate-300 pt-1 leading-relaxed border-t border-slate-800">
                    <strong className="text-slate-200">Diagnosa Teknis:</strong> {aiReport.diagnosis}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs space-y-1.5">
                  <span className="font-semibold text-slate-200 block">Rekomendasi Tindakan:</span>
                  <p className="text-emerald-400 font-medium">{aiReport.recommendedAction}</p>
                  <div className="pt-1 flex items-center justify-between text-slate-400 text-[11px]">
                    <span>Estimasi Biaya Perbaikan:</span>
                    <span className="font-bold text-white font-mono">
                      Rp {aiReport.estimatedCostRp.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column (5 Cols): Active Maintenance Early Warning Alerts & SPK Generator */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-sm text-white">Daftar Peringatan Dini Aktif</h3>
              </div>
              <span className="text-[10px] text-slate-400">Sensor IoT CAN-Bus</span>
            </div>

            <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
              {activeAlertsList.map(alt => (
                <div
                  key={alt.id}
                  className={`p-4 rounded-xl border space-y-2 transition ${
                    alt.isResolved
                      ? 'bg-slate-950/40 border-slate-800/60 opacity-60'
                      : alt.severity === 'CRITICAL'
                      ? 'bg-rose-950/20 border-rose-500/40 hover:bg-rose-950/30'
                      : 'bg-amber-950/20 border-amber-500/40 hover:bg-amber-950/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{alt.plateNumber}</span>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                        alt.isResolved
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : alt.severity === 'CRITICAL'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {alt.isResolved ? 'SPK TERBIT' : alt.severity}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-semibold text-xs text-slate-200">{alt.component}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{alt.diagnosis}</p>
                  </div>

                  <div className="p-2 rounded bg-slate-950/70 border border-slate-800/80 text-[10px] space-y-1">
                    <div className="flex justify-between text-slate-400">
                      <span>Nilai Sensor:</span>
                      <span className="text-white font-mono font-bold">{alt.currentValue}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Sisa Umur Komponen (RUL):</span>
                      <span className="text-rose-400 font-bold">~{alt.predictedFailureKm} KM</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Biaya: <strong className="text-white">Rp {alt.estimatedCostRp.toLocaleString()}</strong>
                    </span>

                    {!alt.isResolved ? (
                      <button
                        onClick={() => setSelectedWorkOrderAlert(alt)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition"
                      >
                        Buka SPK Servis →
                      </button>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Jadwal Servis Masuk
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Surat Perintah Kerja (SPK) Work Order Modal */}
      {selectedWorkOrderAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-base text-white">Surat Perintah Kerja (SPK) Servis Preventif</h3>
                  <p className="text-xs text-slate-400">ID SPK: SPK-{selectedWorkOrderAlert.id.toUpperCase()}-2026</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedWorkOrderAlert(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-400">Armada:</span>
                  <span className="font-bold text-white">{selectedWorkOrderAlert.plateNumber} ({selectedWorkOrderAlert.vehicleModel})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Komponen Target:</span>
                  <span className="font-semibold text-rose-400">{selectedWorkOrderAlert.component}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Risiko Downtime:</span>
                  <span className="text-amber-300">{selectedWorkOrderAlert.downtimeRisk}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-slate-200 block mb-1">Rincian Instruksi Perbaikan:</span>
                <p className="p-3 rounded-xl bg-slate-950 border border-slate-800 leading-relaxed text-slate-200">
                  {selectedWorkOrderAlert.workOrderSuggested}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-slate-400 block text-[11px]">Estimasi Total Biaya Suku Cadang & Jasa:</span>
                  <span className="text-base font-extrabold text-white font-mono">
                    Rp {selectedWorkOrderAlert.estimatedCostRp.toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full font-semibold border border-emerald-500/20">
                  Garansi Suku Cadang OEM
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedWorkOrderAlert(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Tutup
              </button>
              <button
                onClick={() => handleApproveSpk(selectedWorkOrderAlert)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-950/40 transition"
              >
                <Check className="w-4 h-4" />
                <span>Setujui SPK & Jadwalkan ke Bengkel</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
