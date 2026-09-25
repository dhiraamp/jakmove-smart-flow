import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Clock,
  UserCheck,
  Award,
  Zap,
  Activity,
  ClipboardCheck,
  ChevronRight,
  Eye,
  AlertCircle,
  ThumbsUp,
  FileCheck,
} from 'lucide-react';
import { DriverComplianceReport } from '../types/logistics';
import { INITIAL_DRIVER_COMPLIANCE } from '../data/mockLogisticsData';

export const DriverCompliance: React.FC = () => {
  const [drivers, setDrivers] = useState<DriverComplianceReport[]>(INITIAL_DRIVER_COMPLIANCE);
  const [selectedDriver, setSelectedDriver] = useState<DriverComplianceReport>(INITIAL_DRIVER_COMPLIANCE[0]);
  const [showPreTripModal, setShowPreTripModal] = useState(false);
  const [checklistToast, setChecklistToast] = useState<string | null>(null);

  // Pre-trip checklist state
  const [checklist, setChecklist] = useState({
    brakeFluid: true,
    tiresTreadPressure: true,
    headlightsTurnSignals: true,
    engineOilLevel: true,
    emergencyEquipment: true,
    documentsSimKir: true,
  });

  const handleCompleteInspection = () => {
    setDrivers(prev =>
      prev.map(d =>
        d.driverId === selectedDriver.driverId ? { ...d, preTripInspectionDone: true } : d
      )
    );
    setSelectedDriver(prev => ({ ...prev, preTripInspectionDone: true }));
    setShowPreTripModal(false);
    setChecklistToast(`Checklist inspeksi pra-perjalanan untuk ${selectedDriver.driverName} berhasil diverifikasi secara digital.`);
    setTimeout(() => setChecklistToast(null), 5000);
  };

  const averageSafetyScore = Math.round(
    drivers.reduce((acc, d) => acc + d.safetyScore, 0) / drivers.length
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            Modul Laporan Kepatuhan & Keselamatan Pengemudi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitoring telematika perilaku berkendara, sensor kelelahan ADAS/DMS, kepatuhan batas jam mengemudi (HOS Kemenhub), dan inspeksi harian.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs flex items-center gap-2">
            <span className="text-slate-400">Rata-rata Skor Armada:</span>
            <span className="font-extrabold text-emerald-400 text-sm">{averageSafetyScore} / 100</span>
          </div>
        </div>
      </div>

      {checklistToast && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{checklistToast}</span>
        </div>
      )}

      {/* Main Grid: Driver Leaderboard & Detailed Telematics Behavioral Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): Drivers Leaderboard List */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <h3 className="font-bold text-sm text-white">Peringkat Kepatuhan Pengemudi</h3>
            </div>
            <span className="text-[10px] text-slate-400">Update Real-Time</span>
          </div>

          <div className="space-y-2.5 max-h-[560px] overflow-y-auto pr-1">
            {drivers.map(drv => {
              const isSelected = selectedDriver.driverId === drv.driverId;
              return (
                <div
                  key={drv.driverId}
                  onClick={() => setSelectedDriver(drv)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/50 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={drv.avatar}
                      alt={drv.driverName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-700"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-white">{drv.driverName}</span>
                        {drv.safetyScore >= 95 && (
                          <span title="Top Performer">
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {drv.assignedPlate} • {drv.monthlyTrips} Trip
                      </p>
                    </div>
                  </div>

                  <div className="text-right space-y-1">
                    <span
                      className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full inline-block ${
                        drv.safetyScore >= 90
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : drv.safetyScore >= 80
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {drv.safetyScore} Poin
                    </span>
                    <p className="text-[10px] text-slate-400">
                      HOS: <strong className={drv.hosStatus === 'VIOLATION' ? 'text-rose-400' : 'text-slate-300'}>{drv.drivingHoursToday}h / 8h</strong>
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (7 Cols): Selected Driver Deep Dive */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            {/* Header Profile */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3.5">
                <img
                  src={selectedDriver.avatar}
                  alt={selectedDriver.driverName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500/40"
                />
                <div>
                  <h3 className="font-extrabold text-base text-white">{selectedDriver.driverName}</h3>
                  <p className="text-xs text-slate-400">
                    Armada: <span className="font-mono text-emerald-400 font-semibold">{selectedDriver.assignedPlate}</span> • No. SIM: {selectedDriver.licenseNumber}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Masa Berlaku SIM: {selectedDriver.licenseValidUntil} • Tepat Waktu (OTD): {selectedDriver.onTimeRatePercent}%
                  </p>
                </div>
              </div>

              <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Skor Kepatuhan</span>
                <span className="text-2xl font-extrabold text-emerald-400">
                  {selectedDriver.safetyScore} <span className="text-xs text-slate-400 font-normal">/ 100</span>
                </span>
              </div>
            </div>

            {/* Hours of Service (HOS) Kemenhub Compliance Bar */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-slate-200">Jam Berkendara Hari Ini (HOS Kemenhub):</span>
                </div>
                <span
                  className={`font-extrabold px-2 py-0.5 rounded text-[10px] ${
                    selectedDriver.hosStatus === 'COMPLIANT'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : selectedDriver.hosStatus === 'NEARING_LIMIT'
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {selectedDriver.hosStatus === 'COMPLIANT'
                    ? 'SESUAI ATURAN'
                    : selectedDriver.hosStatus === 'NEARING_LIMIT'
                    ? 'MENDEKATI BATAS 8 JAM'
                    : 'PELANGGARAN HOS'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <span>{selectedDriver.drivingHoursToday} Jam Mengemudi</span>
                <span>Batas Maks: 8 Jam (Wajib Istirahat 30 Mnt)</span>
              </div>

              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-800">
                <div
                  className={`h-2.5 rounded-full ${
                    selectedDriver.drivingHoursToday >= 8
                      ? 'bg-rose-500'
                      : selectedDriver.drivingHoursToday >= 7
                      ? 'bg-amber-400'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, (selectedDriver.drivingHoursToday / 8) * 100)}%` }}
                />
              </div>
            </div>

            {/* Telematics Incident Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              {/* Harsh Braking */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block">Pengereman Mendadak</span>
                <span
                  className={`text-xl font-bold block ${
                    selectedDriver.harshBrakingCount > 2 ? 'text-amber-400' : 'text-slate-100'
                  }`}
                >
                  {selectedDriver.harshBrakingCount}x
                </span>
                <span className="text-[10px] text-slate-400 block">Batas: &lt;3x / shift</span>
              </div>

              {/* Rapid Acceleration */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block">Akselerasi Kasar</span>
                <span
                  className={`text-xl font-bold block ${
                    selectedDriver.rapidAccelerationCount > 2 ? 'text-amber-400' : 'text-slate-100'
                  }`}
                >
                  {selectedDriver.rapidAccelerationCount}x
                </span>
                <span className="text-[10px] text-slate-400 block">RPM lonjakan tajam</span>
              </div>

              {/* Speeding */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block">Batas Kecepatan</span>
                <span
                  className={`text-xl font-bold block ${
                    selectedDriver.speedingIncidents > 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {selectedDriver.speedingIncidents}x
                </span>
                <span className="text-[10px] text-slate-400 block">&gt;80 km/jam di Tol</span>
              </div>

              {/* Drowsiness DMS */}
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-400 block">Deteksi Mengantuk</span>
                <span
                  className={`text-xl font-bold block ${
                    selectedDriver.drowsinessAlerts > 0 ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {selectedDriver.drowsinessAlerts}x
                </span>
                <span className="text-[10px] text-slate-400 block">Kamera DMS Kabin</span>
              </div>
            </div>

            {/* Pre-Trip Inspection Status */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <ClipboardCheck className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-xs text-white">Inspeksi Harian Pra-Perjalanan (Pre-Trip)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Pengecekan fisik kendaraan wajib sebelum armada keluar depo
                </p>
              </div>

              {selectedDriver.preTripInspectionDone ? (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center gap-1.5 border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Terverifikasi
                </span>
              ) : (
                <button
                  onClick={() => setShowPreTripModal(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition"
                >
                  Lakukan Inspeksi Sekarang
                </button>
              )}
            </div>

            {/* AI Coaching Tips */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-950/20 to-slate-950 border border-emerald-500/20 space-y-1.5 text-xs">
              <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                <ThumbsUp className="w-3.5 h-3.5" /> Rekomendasi Pembinaan AI untuk {selectedDriver.driverName}:
              </span>
              <p className="text-slate-300 leading-relaxed">
                {selectedDriver.safetyScore >= 95
                  ? 'Pengemudi teladan dengan efisiensi jelajah tinggi. Konsumsi bahan bakar stabil 6.8 km/L tanpa insiden rem mendadak.'
                  : selectedDriver.drowsinessAlerts > 0
                  ? 'Kamera DMS mendeteksi kedipan mata lambat saat melintas Tol Cikampek malam hari. Wajibkan waktu istirahat 45 menit di Rest Area KM 57.'
                  : 'Pertahankan jarak aman minimum 4 detik di belakang kendaraan berat lain untuk mengurangi pengereman mendadak.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Trip Inspection Modal */}
      {showPreTripModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Inspeksi Pra-Perjalanan Digital</h3>
              </div>
              <button
                onClick={() => setShowPreTripModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Verifikasi kelayakan operasional armada <strong className="text-white">{selectedDriver.assignedPlate}</strong> sebelum driver diberangkatkan:
            </p>

            <div className="space-y-2.5 text-xs">
              {[
                { key: 'brakeFluid', label: 'Minyak Rem & Tekanan Angin Rem Utama' },
                { key: 'tiresTreadPressure', label: 'Tekanan & Ketebalan Tapak Ban (Termasuk Ban Serep)' },
                { key: 'headlightsTurnSignals', label: 'Lampu Utama, Lampu Rem, dan Sein Berfungsi Penuh' },
                { key: 'engineOilLevel', label: 'Level Pelumas Oli Mesin & Air Radiator Coolant' },
                { key: 'emergencyEquipment', label: 'APAR (Alat Pemadam Api), Dongkrak, dan Segitiga Pengaman' },
                { key: 'documentsSimKir', label: 'Kelengkapan Surat SIM B2 Umum, STNK Asli, dan Bukti Uji KIR' },
              ].map(item => (
                <label
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700 transition"
                >
                  <span className="text-slate-200 font-medium">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={(checklist as any)[item.key]}
                    onChange={e =>
                      setChecklist({ ...checklist, [item.key]: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500"
                  />
                </label>
              ))}
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowPreTripModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={handleCompleteInspection}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-950/40"
              >
                Selesaikan & Terbitkan Tanda Lolos
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
