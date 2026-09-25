import React, { useState, useEffect } from 'react';
import {
  Share2,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  Code,
  Terminal,
  Zap,
  Copy,
  ExternalLink,
  ArrowRight,
  ShieldCheck,
  Send,
  Radio,
  FileCode,
  Layers,
  Thermometer,
} from 'lucide-react';
import { CrossPlatformShipment } from '../types/logistics';

export const CrossPlatformTracking: React.FC = () => {
  const [trackingInput, setTrackingInput] = useState('JKM-2026-9812');
  const [activeShipment, setActiveShipment] = useState<CrossPlatformShipment | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Developer API Console State
  const [apiEndpoint, setApiEndpoint] = useState('/api/v1/shipments/track/JKM-2026-9812');
  const [apiMethod, setApiMethod] = useState<'GET' | 'POST'>('GET');
  const [apiResponse, setApiResponse] = useState<any | null>(null);
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [apiLoading, setApiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'TRACKER' | 'API_SANDBOX'>('TRACKER');
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [webhookEventType, setWebhookEventType] = useState('DELIVERY_OUT_FOR_DELIVERY');
  const [webhookToast, setWebhookToast] = useState<string | null>(null);

  const sampleCodes = [
    { label: 'JakMove Cold Chain', code: 'JKM-2026-9812' },
    { label: 'Shopee Express Cargo', code: 'SPX-ID-7819230' },
    { label: 'GoTo Logistics (Tokopedia)', code: 'GTL-TKP-449102' },
    { label: 'J&T Cargo Linehaul', code: 'JNT-CRG-903811' },
    { label: 'Bea Cukai Tanjung Priok', code: 'PRIOK-CT-551029' },
  ];

  const handleSearchTracking = async (codeToSearch?: string) => {
    const targetCode = (codeToSearch || trackingInput).trim();
    if (!targetCode) return;
    setLoading(true);
    setSearchError(null);

    try {
      const response = await fetch(`/api/v1/shipments/track/${encodeURIComponent(targetCode)}`);
      const json = await response.json();
      if (json.success && json.data) {
        setActiveShipment(json.data);
      } else {
        setSearchError('Resi tidak ditemukan pada gateway lintas platform.');
      }
    } catch (err: any) {
      setSearchError('Koneksi ke gateway pelacakan terputus.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearchTracking('JKM-2026-9812');
  }, []);

  const handleExecuteApiSandbox = async () => {
    setApiLoading(true);
    const start = performance.now();
    try {
      if (apiMethod === 'GET') {
        const res = await fetch(apiEndpoint);
        const data = await res.json();
        setApiResponse(data);
      } else {
        const res = await fetch('/api/v1/shipments/webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            event: webhookEventType,
            trackingId: trackingInput,
            carrier: '3PL Integrated Carrier',
            timestamp: new Date().toISOString(),
            payload: {
              latitude: -6.1824,
              longitude: 106.8284,
              status: 'PROCESSED_BY_AI',
            },
          }),
        });
        const data = await res.json();
        setApiResponse(data);
        setWebhookToast(`Webhook ${webhookEventType} berhasil dikirim dan direspons 200 OK.`);
        setTimeout(() => setWebhookToast(null), 4000);
      }
    } catch (err: any) {
      setApiResponse({ error: err.message });
    } finally {
      const duration = Math.round(performance.now() - start);
      setApiLatency(duration);
      setApiLoading(false);
    }
  };

  const copyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-400" />
            Integrasi API & Pelacakan Kiriman Lintas Platform
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gateway pelacakan terpadu untuk Shopee Express, GoTo Logistics, J&T Cargo, DHL, dan CEISA Bea Cukai Tanjung Priok via REST API & Webhook.
          </p>
        </div>

        <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('TRACKER')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'TRACKER' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pelacakan Resi Universal
          </button>
          <button
            onClick={() => setActiveTab('API_SANDBOX')}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              activeTab === 'API_SANDBOX' ? 'bg-slate-800 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Developer API Console
          </button>
        </div>
      </div>

      {activeTab === 'TRACKER' ? (
        /* Tab 1: Universal Tracking Explorer */
        <div className="space-y-5">
          {/* Universal Search Bar */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={trackingInput}
                  onChange={e => setTrackingInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearchTracking()}
                  placeholder="Masukkan nomor resi AWB atau nomor kontainer..."
                  className="w-full pl-9 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <button
                onClick={() => handleSearchTracking()}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition disabled:opacity-50"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? 'Mencari...' : 'Lacak Pengiriman'}</span>
              </button>
            </div>

            {/* Quick Demo Resi Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pt-1">
              <span className="text-[11px] text-slate-400 shrink-0">Contoh Resi Cepat:</span>
              {sampleCodes.map(sample => (
                <button
                  key={sample.code}
                  onClick={() => {
                    setTrackingInput(sample.code);
                    handleSearchTracking(sample.code);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-300 hover:text-emerald-400 hover:border-slate-700 transition shrink-0 font-mono"
                >
                  {sample.code} ({sample.label.split(' ')[0]})
                </button>
              ))}
            </div>
          </div>

          {searchError && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
              {searchError}
            </div>
          )}

          {/* Active Shipment Result View */}
          {activeShipment && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in duration-300">
              {/* Left Column (5 Cols): Shipment Info & Vehicle Details */}
              <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-start justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 uppercase">
                      {activeShipment.platform}
                    </span>
                    <h3 className="font-extrabold text-base text-white mt-1 font-mono">
                      {activeShipment.trackingId}
                    </h3>
                    <p className="text-xs text-slate-400">{activeShipment.courier}</p>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                    {activeShipment.statusLabel}
                  </span>
                </div>

                {/* Sender & Recipient */}
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Pengirim:</span>
                    <p className="font-semibold text-slate-200">{activeShipment.sender}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                    <span className="text-slate-400 text-[10px] block">Penerima & Alamat Tujuan:</span>
                    <p className="font-semibold text-slate-200">{activeShipment.recipient}</p>
                  </div>
                </div>

                {/* Vehicle & Telematics Info */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Armada Ditugaskan:</span>
                    <span className="font-bold text-white font-mono">{activeShipment.assignedVehicle}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Pengemudi:</span>
                    <span className="font-semibold text-slate-200">{activeShipment.driverName}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Posisi Terkini:</span>
                    <span className="text-emerald-400 font-medium">{activeShipment.currentLocation}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Estimasi Tiba:</span>
                    <span className="font-bold text-white">{activeShipment.eta}</span>
                  </div>
                  {activeShipment.temperature !== null && activeShipment.temperature !== undefined && (
                    <div className="pt-1 border-t border-slate-800 flex justify-between text-cyan-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3.5 h-3.5" /> Sensor Suhu Kargo:
                      </span>
                      <span>{activeShipment.temperature}°C (Optimal)</span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Progres Pengiriman</span>
                    <span className="font-bold text-white">{activeShipment.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-emerald-400 h-2 rounded-full"
                      style={{ width: `${activeShipment.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column (7 Cols): Step-by-Step Delivery Milestones Timeline */}
              <div className="lg:col-span-7 p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-sm text-white">Riwayat Perjalanan & Titik Kontrol (Audit Trail)</h3>
                  </div>
                  <span className="text-[10px] text-slate-400">Sinkronisasi EDI Satelit</span>
                </div>

                {/* Vertical Timeline */}
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {activeShipment.events.map((evt, idx) => (
                    <div key={idx} className="relative group">
                      {/* Timeline Dot */}
                      <span
                        className={`absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-slate-900 flex items-center justify-center ${
                          idx === activeShipment.events.length - 1
                            ? 'bg-emerald-400 ring-4 ring-emerald-500/20 animate-pulse'
                            : 'bg-slate-700'
                        }`}
                      />
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-200">{evt.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{evt.timestamp}</span>
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed">{evt.desc}</p>
                        <span className="text-[10px] text-emerald-400 font-medium block pt-0.5">
                          📍 {evt.location}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Tab 2: Developer API Console & Webhook Simulator */
        <div className="space-y-6 animate-in fade-in duration-300">
          {webhookToast && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{webhookToast}</span>
            </div>
          )}

          {/* Interactive Request Sandbox */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">Live API Endpoint Sandbox Runner</h3>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                API Base: https://jakmove-smart-flow.base44.app
              </span>
            </div>

            {/* Request Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 text-xs">
              <select
                value={apiMethod}
                onChange={e => setApiMethod(e.target.value as any)}
                className="bg-slate-950 border border-slate-700 text-xs font-bold text-cyan-400 rounded-xl px-3 py-2.5 focus:border-cyan-500"
              >
                <option value="GET">GET</option>
                <option value="POST">POST (Webhook)</option>
              </select>

              <input
                type="text"
                value={apiEndpoint}
                onChange={e => setApiEndpoint(e.target.value)}
                className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 font-mono text-xs focus:border-cyan-500"
              />

              <button
                onClick={handleExecuteApiSandbox}
                disabled={apiLoading}
                className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{apiLoading ? 'Memanggil...' : 'Kirim Request'}</span>
              </button>
            </div>

            {apiMethod === 'POST' && (
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <span className="font-semibold text-slate-300 block">Tipe Webhook Event:</span>
                <div className="flex flex-wrap gap-2">
                  {['DELIVERY_OUT_FOR_DELIVERY', 'TEMPERATURE_ALERT', 'CUSTOMS_CLEARED_GATE_OUT'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setWebhookEventType(t)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition ${
                        webhookEventType === t
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                          : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Live Response Output Inspector */}
            {apiResponse && (
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded font-mono">
                      200 OK
                    </span>
                    <span className="text-slate-400 font-mono">Latency: {apiLatency} ms</span>
                  </div>
                  <button
                    onClick={() => copyCode(JSON.stringify(apiResponse, null, 2))}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedSnippet ? 'Tersalin!' : 'Salin JSON'}</span>
                  </button>
                </div>

                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-80 leading-relaxed">
                  {JSON.stringify(apiResponse, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Code Integration Snippets (cURL, Node.js, Python) */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <Code className="w-4 h-4 text-emerald-400" />
              Contoh Implementasi Kode Integrasi Mitra (3PL Integration Snippets)
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">cURL (Command Line API Call)</span>
                  <button
                    onClick={() =>
                      copyCode(`curl -X GET "https://jakmove-smart-flow.base44.app/api/v1/shipments/track/JKM-2026-9812" \\
  -H "Authorization: Bearer jkm_live_sec_89124012" \\
  -H "Accept: application/json"`)
                    }
                    className="text-[10px] text-emerald-400 hover:underline"
                  >
                    Salin Snippet
                  </button>
                </div>
                <pre className="text-[11px] text-slate-400 font-mono overflow-x-auto">
{`curl -X GET "https://jakmove-smart-flow.base44.app/api/v1/shipments/track/JKM-2026-9812" \\
  -H "Authorization: Bearer jkm_live_sec_89124012" \\
  -H "Accept: application/json"`}
                </pre>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-300">Node.js (JavaScript / Fetch)</span>
                  <button
                    onClick={() =>
                      copyCode(`const res = await fetch('https://jakmove-smart-flow.base44.app/api/v1/shipments/track/JKM-2026-9812', {
  headers: {
    'Authorization': 'Bearer jkm_live_sec_89124012',
    'Content-Type': 'application/json'
  }
});
const trackingData = await res.json();
console.log(trackingData.data.currentLocation);`)}
                    className="text-[10px] text-emerald-400 hover:underline"
                  >
                    Salin Snippet
                  </button>
                </div>
                <pre className="text-[11px] text-slate-400 font-mono overflow-x-auto">
{`const res = await fetch('https://jakmove-smart-flow.base44.app/api/v1/shipments/track/JKM-2026-9812', {
  headers: {
    'Authorization': 'Bearer jkm_live_sec_89124012',
    'Content-Type': 'application/json'
  }
});
const trackingData = await res.json();
console.log(trackingData.data.currentLocation);`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
