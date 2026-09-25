import React, { useState } from 'react';
import {
  Truck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Gauge,
  Thermometer,
  Zap,
  Fuel,
  Calendar,
  UserCheck,
  FileText,
  Wrench,
  Radio,
  SlidersHorizontal,
} from 'lucide-react';
import { Vehicle, VehicleStatus } from '../types/logistics';

interface FleetManagementProps {
  vehicles: Vehicle[];
  onAddVehicle: (newVeh: Vehicle) => void;
  onSelectVehicle: (v: Vehicle) => void;
  onOpenOptimizer: (v: Vehicle) => void;
}

export const FleetManagement: React.FC<FleetManagementProps> = ({
  vehicles,
  onAddVehicle,
  onSelectVehicle,
  onOpenOptimizer,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'CARDS' | 'TABLE'>('CARDS');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedInspectionVehicle, setSelectedInspectionVehicle] = useState<Vehicle | null>(null);

  // New Vehicle Form State
  const [formData, setFormData] = useState({
    plateNumber: '',
    model: '',
    type: 'CDD_BOX' as Vehicle['type'],
    driverName: '',
    driverPhone: '',
    maxWeightKg: 5000,
    fuelEfficiencyKmPerLiter: 6.5,
    kirExpiryDate: '2027-02-15',
    stnkExpiryDate: '2027-08-10',
  });

  const handleCreateVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.plateNumber || !formData.model || !formData.driverName) return;

    const newVehicle: Vehicle = {
      id: `veh-${Date.now()}`,
      plateNumber: formData.plateNumber.toUpperCase(),
      model: formData.model,
      type: formData.type,
      typeName:
        formData.type === 'CDD_BOX'
          ? 'CDD Box (6 Roda)'
          : formData.type === 'EV_BLIND_VAN'
          ? 'Blind Van Listrik (EV)'
          : formData.type === 'WINGBOX'
          ? 'Wingbox Heavy Duty (10 Roda)'
          : formData.type === 'TRONTON_TRAILER'
          ? 'Tronton Kontainer 40ft'
          : formData.type === 'CDE_ENGKEL'
          ? 'CDE Engkel (4 Roda)'
          : 'Fuso Heavy Duty',
      driverId: `drv-${Date.now()}`,
      driverName: formData.driverName,
      driverPhone: formData.driverPhone || '+62 812-3456-7890',
      driverAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      status: 'IDLE',
      statusText: 'Standby di Depo Utama',
      currentLocationName: 'Distribution Center Cakung',
      coordinates: { x: 68, y: 35 },
      targetDestination: 'Menunggu Surat Jalan Dispatcher',
      eta: '--:--',
      loadWeightKg: 0,
      maxWeightKg: Number(formData.maxWeightKg),
      fuelEfficiencyKmPerLiter: Number(formData.fuelEfficiencyKmPerLiter),
      odometerKm: 42000,
      kirExpiryDate: formData.kirExpiryDate,
      stnkExpiryDate: formData.stnkExpiryDate,
      telematics: {
        speedKmH: 0,
        engineRpm: 0,
        coolantTempC: 84,
        oilPressurePsi: 38,
        fuelLevelPercent: 95,
        batteryHealthPercent: 98,
        brakePadWearPercent: 25,
        vibrationHz: 10,
        tirePressurePsi: { frontLeft: 110, frontRight: 110, rearLeftOuter: 115, rearLeftInner: 115, rearRightOuter: 115, rearRightInner: 115 },
      },
    };

    onAddVehicle(newVehicle);
    setShowAddModal(false);
    setFormData({
      plateNumber: '',
      model: '',
      type: 'CDD_BOX',
      driverName: '',
      driverPhone: '',
      maxWeightKg: 5000,
      fuelEfficiencyKmPerLiter: 6.5,
      kirExpiryDate: '2027-02-15',
      stnkExpiryDate: '2027-08-10',
    });
  };

  const filteredVehicles = vehicles.filter(v => {
    const matchesSearch =
      v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.driverName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || v.status === statusFilter;
    const matchesType = typeFilter === 'ALL' || v.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header and Add Vehicle CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-400" />
            Manajemen Armada & Telemetri Terintegrasi
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola inventaris armada, telemetri sensor OBD-II, masa berlaku KIR & STNK, serta penugasan pengemudi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Armada Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and View Toggles Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Cari nomor plat, nama sopir, tipe kendaraan..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Semua Status</option>
              <option value="IN_TRANSIT">In-Transit</option>
              <option value="LOADING">Bongkar/Muat</option>
              <option value="IDLE">Idle</option>
              <option value="MAINTENANCE">Perawatan/Servis</option>
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">Semua Tipe Kendaraan</option>
              <option value="CDD_BOX">CDD Box (6 Ban)</option>
              <option value="CDE_ENGKEL">CDE Engkel (4 Ban)</option>
              <option value="FUSO_HEAVY">Fuso Heavy Duty</option>
              <option value="WINGBOX">Wingbox 10 Roda</option>
              <option value="EV_BLIND_VAN">EV Listrik</option>
              <option value="TRONTON_TRAILER">Tronton Kontainer</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-700">
              <button
                onClick={() => setViewMode('CARDS')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                  viewMode === 'CARDS' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Kartu
              </button>
              <button
                onClick={() => setViewMode('TABLE')}
                className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                  viewMode === 'TABLE' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Tabel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content: Cards View */}
      {viewMode === 'CARDS' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVehicles.map(veh => {
            const isCritical =
              veh.telematics.coolantTempC > 96 || veh.telematics.oilPressurePsi < 25;
            const isEv = veh.type === 'EV_BLIND_VAN';
            const loadPercent = Math.round((veh.loadWeightKg / veh.maxWeightKg) * 100);

            return (
              <div
                key={veh.id}
                className={`rounded-2xl border bg-slate-900/90 p-5 shadow-xl space-y-4 hover:border-slate-700 transition relative overflow-hidden flex flex-col justify-between ${
                  isCritical ? 'border-rose-500/50 bg-rose-950/10' : 'border-slate-800'
                }`}
              >
                <div>
                  {/* Top Row: Plate & Status */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-base text-white">{veh.plateNumber}</span>
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
                      <p className="text-xs text-slate-300 font-medium mt-0.5">{veh.model}</p>
                      <p className="text-[11px] text-slate-400">{veh.typeName}</p>
                    </div>

                    <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-right">
                      <span className="text-xs font-bold text-emerald-400">
                        {veh.fuelEfficiencyKmPerLiter} <span className="text-[10px] text-slate-400">km/L</span>
                      </span>
                      <p className="text-[10px] text-slate-400 font-mono">{(veh.odometerKm).toLocaleString()} km</p>
                    </div>
                  </div>

                  {/* Driver and Location info */}
                  <div className="mt-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={veh.driverAvatar}
                          alt={veh.driverName}
                          className="w-6 h-6 rounded-full object-cover border border-slate-700"
                        />
                        <span className="font-semibold text-slate-200">{veh.driverName}</span>
                      </div>
                      <span className="text-[11px] text-slate-400">{veh.driverPhone}</span>
                    </div>

                    <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-slate-400 text-[11px]">
                      <span>Rute Tujuan:</span>
                      <span className="text-slate-200 font-medium truncate max-w-[170px]">{veh.targetDestination}</span>
                    </div>

                    {/* Payload Bar */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[10px] text-slate-400">
                        <span>Muatan: {(veh.loadWeightKg / 1000).toFixed(1)} Ton / {(veh.maxWeightKg / 1000).toFixed(1)} Ton</span>
                        <span className="font-bold text-slate-200">{loadPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-1.5 rounded-full ${
                            loadPercent > 90 ? 'bg-amber-400' : 'bg-emerald-400'
                          }`}
                          style={{ width: `${loadPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Live Telematics Metrics Pill */}
                  <div className="grid grid-cols-3 gap-2 mt-3 text-center text-xs">
                    <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 block">Kecepatan</span>
                      <span className="font-bold text-white mt-0.5 block">{veh.telematics.speedKmH} km/h</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 block">Suhu Mesin</span>
                      <span
                        className={`font-bold mt-0.5 block ${
                          veh.telematics.coolantTempC > 95 ? 'text-rose-400' : 'text-slate-200'
                        }`}
                      >
                        {veh.telematics.coolantTempC}°C
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                      <span className="text-[10px] text-slate-400 block">
                        {isEv ? 'Baterai' : 'Bahan Bakar'}
                      </span>
                      <span className="font-bold text-emerald-400 mt-0.5 block">
                        {veh.telematics.fuelLevelPercent}%
                      </span>
                    </div>
                  </div>

                  {/* KIR & STNK Validity Badge */}
                  <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 px-1">
                    <span>Uji KIR: <strong className="text-slate-300">{veh.kirExpiryDate}</strong></span>
                    <span>STNK: <strong className="text-slate-300">{veh.stnkExpiryDate}</strong></span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2 mt-4">
                  <button
                    onClick={() => setSelectedInspectionVehicle(veh)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold text-center transition"
                  >
                    Inspeksi Sensor
                  </button>
                  <button
                    onClick={() => onOpenOptimizer(veh)}
                    className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold text-center transition"
                  >
                    Optimalkan Rute
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Content: Table View */
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-x-auto shadow-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/70 text-slate-400">
                <th className="py-3 px-4 font-semibold">Plat Nomor / Model</th>
                <th className="py-3 px-4 font-semibold">Tipe Armada</th>
                <th className="py-3 px-4 font-semibold">Pengemudi</th>
                <th className="py-3 px-4 font-semibold">Status Operasional</th>
                <th className="py-3 px-4 font-semibold">Telemetri CAN-Bus</th>
                <th className="py-3 px-4 font-semibold">Muatan</th>
                <th className="py-3 px-4 font-semibold">KIR & STNK</th>
                <th className="py-3 px-4 font-semibold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-200">
              {filteredVehicles.map(veh => (
                <tr key={veh.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block">{veh.plateNumber}</span>
                    <span className="text-[11px] text-slate-400">{veh.model}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{veh.typeName}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <img
                        src={veh.driverAvatar}
                        alt={veh.driverName}
                        className="w-6 h-6 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <span className="font-semibold block">{veh.driverName}</span>
                        <span className="text-[10px] text-slate-400">{veh.driverPhone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
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
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-mono text-cyan-300 font-semibold">{veh.telematics.speedKmH} km/h</span> •{' '}
                    <span className={veh.telematics.coolantTempC > 95 ? 'text-rose-400 font-bold' : 'text-slate-400'}>
                      {veh.telematics.coolantTempC}°C
                    </span> •{' '}
                    <span className="text-emerald-400">{veh.telematics.fuelLevelPercent}%</span>
                  </td>
                  <td className="py-3 px-4">
                    <span>{(veh.loadWeightKg / 1000).toFixed(1)} / {(veh.maxWeightKg / 1000).toFixed(1)} Ton</span>
                  </td>
                  <td className="py-3 px-4 text-[11px] text-slate-400">
                    <div>KIR: {veh.kirExpiryDate}</div>
                    <div>STNK: {veh.stnkExpiryDate}</div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => setSelectedInspectionVehicle(veh)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-[11px] transition"
                    >
                      Inspeksi
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Vehicle Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Truck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-base text-white">Tambah Armada Baru ke Sistem</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateVehicle} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor Polisi (Plat No)</label>
                  <input
                    type="text"
                    required
                    value={formData.plateNumber}
                    onChange={e => setFormData({ ...formData, plateNumber: e.target.value })}
                    placeholder="Contoh: B 9481 ZYX"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 uppercase focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Model / Merk Kendaraan</label>
                  <input
                    type="text"
                    required
                    value={formData.model}
                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                    placeholder="Contoh: Hino Dutro 130 HD"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipe Kendaraan</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:border-emerald-500"
                  >
                    <option value="CDD_BOX">CDD Box (6 Ban)</option>
                    <option value="CDE_ENGKEL">CDE Engkel (4 Ban)</option>
                    <option value="FUSO_HEAVY">Fuso Heavy Duty</option>
                    <option value="WINGBOX">Wingbox Heavy Duty</option>
                    <option value="EV_BLIND_VAN">EV Listrik Blind Van</option>
                    <option value="TRONTON_TRAILER">Tronton Kontainer 40ft</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kapasitas Maksimal (Kg)</label>
                  <input
                    type="number"
                    value={formData.maxWeightKg}
                    onChange={e => setFormData({ ...formData, maxWeightKg: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Pengemudi Utama</label>
                  <input
                    type="text"
                    required
                    value={formData.driverName}
                    onChange={e => setFormData({ ...formData, driverName: e.target.value })}
                    placeholder="Nama Lengkap Sopir"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">No. Kontak Pengemudi</label>
                  <input
                    type="text"
                    value={formData.driverPhone}
                    onChange={e => setFormData({ ...formData, driverPhone: e.target.value })}
                    placeholder="+62 812-xxxx-xxxx"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Masa Berlaku Uji KIR</label>
                  <input
                    type="date"
                    value={formData.kirExpiryDate}
                    onChange={e => setFormData({ ...formData, kirExpiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Masa Berlaku Pajak STNK</label>
                  <input
                    type="date"
                    value={formData.stnkExpiryDate}
                    onChange={e => setFormData({ ...formData, stnkExpiryDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold transition shadow-lg shadow-emerald-950/40"
                >
                  Simpan Armada Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Detailed Telematics Sensor Inspection Flyout */}
      {selectedInspectionVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Gauge className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-base text-white">
                    Inspeksi Telematika OBD-II & CAN-Bus: {selectedInspectionVehicle.plateNumber}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {selectedInspectionVehicle.model} • Driver: {selectedInspectionVehicle.driverName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedInspectionVehicle(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Diagnostic Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">Putaran Mesin</span>
                <span className="text-lg font-bold text-white block mt-1">
                  {selectedInspectionVehicle.telematics.engineRpm} <span className="text-xs font-normal">RPM</span>
                </span>
                <span className="text-[10px] text-emerald-400">Zona Hemat 1.600-1.800</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">Suhu Coolant</span>
                <span
                  className={`text-lg font-bold block mt-1 ${
                    selectedInspectionVehicle.telematics.coolantTempC > 95
                      ? 'text-rose-400'
                      : 'text-white'
                  }`}
                >
                  {selectedInspectionVehicle.telematics.coolantTempC} °C
                </span>
                <span className="text-[10px] text-slate-400">Batas Normal 82-95°C</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">Tekanan Oli</span>
                <span
                  className={`text-lg font-bold block mt-1 ${
                    selectedInspectionVehicle.telematics.oilPressurePsi < 25
                      ? 'text-rose-400'
                      : 'text-white'
                  }`}
                >
                  {selectedInspectionVehicle.telematics.oilPressurePsi} PSI
                </span>
                <span className="text-[10px] text-slate-400">Batas Normal 28-45 PSI</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400">Keausan Kampas Rem</span>
                <span
                  className={`text-lg font-bold block mt-1 ${
                    selectedInspectionVehicle.telematics.brakePadWearPercent > 75
                      ? 'text-rose-400'
                      : 'text-white'
                  }`}
                >
                  {selectedInspectionVehicle.telematics.brakePadWearPercent}%
                </span>
                <span className="text-[10px] text-slate-400">Maksimal Aman 75%</span>
              </div>
            </div>

            {/* TPMS Tire Pressure Visualizer */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-200">Sensor Tekanan Ban TPMS (PSI)</h4>
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Depan Kiri</span>
                  <span className="font-bold text-emerald-400">
                    {selectedInspectionVehicle.telematics.tirePressurePsi.frontLeft} PSI
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Depan Kanan</span>
                  <span className="font-bold text-emerald-400">
                    {selectedInspectionVehicle.telematics.tirePressurePsi.frontRight} PSI
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Belakang Kiri Ganda</span>
                  <span className="font-bold text-emerald-400">
                    {selectedInspectionVehicle.telematics.tirePressurePsi.rearLeftOuter} / {selectedInspectionVehicle.telematics.tirePressurePsi.rearLeftInner} PSI
                  </span>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Belakang Kanan Ganda</span>
                  <span className="font-bold text-emerald-400">
                    {selectedInspectionVehicle.telematics.tirePressurePsi.rearRightOuter} / {selectedInspectionVehicle.telematics.tirePressurePsi.rearRightInner} PSI
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedInspectionVehicle(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Tutup Jendela Inspeksi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
