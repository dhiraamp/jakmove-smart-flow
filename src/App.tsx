import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/DashboardOverview';
import { FleetManagement } from './components/FleetManagement';
import { OperationalAnalytics } from './components/OperationalAnalytics';
import { AiRouteOptimizer } from './components/AiRouteOptimizer';
import { PredictiveMaintenance } from './components/PredictiveMaintenance';
import { DriverCompliance } from './components/DriverCompliance';
import { CrossPlatformTracking } from './components/CrossPlatformTracking';
import { AiOperationalCopilotModal } from './components/AiOperationalCopilotModal';
import {
  INITIAL_VEHICLES,
  INITIAL_HUBS,
  INITIAL_KPIS,
  INITIAL_MAINTENANCE_ALERTS,
} from './data/mockLogisticsData';
import { Vehicle, MaintenanceAlert } from './types/logistics';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [vehicles, setVehicles] = useState<Vehicle[]>(INITIAL_VEHICLES);
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>(INITIAL_MAINTENANCE_ALERTS);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [optimizerVehicle, setOptimizerVehicle] = useState<Vehicle | null>(null);
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const handleAddVehicle = (newVeh: Vehicle) => {
    setVehicles(prev => [newVeh, ...prev]);
  };

  const handleOpenRouteOptimizerWithVehicle = (v?: Vehicle) => {
    if (v) setOptimizerVehicle(v);
    setActiveTab('route-optimizer');
  };

  const handleResolveAlert = (alertId: string) => {
    setAlerts(prev =>
      prev.map(a => (a.id === alertId ? { ...a, isResolved: true } : a))
    );
  };

  const criticalAlertsCount = alerts.filter(a => a.severity === 'CRITICAL' && !a.isResolved).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Navigation Bar */}
      <Navbar
        onOpenAiAssistant={() => setIsAiAssistantOpen(true)}
        onOpenRouteOptimizer={() => handleOpenRouteOptimizerWithVehicle()}
        onSelectVehicle={v => {
          setSelectedVehicle(v);
          setActiveTab('dashboard');
        }}
        vehicles={vehicles}
        alerts={alerts}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        onNavigateTab={tab => setActiveTab(tab)}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto pb-16 md:pb-0">
        {/* Persistent Desktop Sidebar & Mobile Drawer */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={tab => setActiveTab(tab)}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          criticalAlertCount={criticalAlertsCount}
        />

        {/* Dynamic Viewport Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardOverview
              vehicles={vehicles}
              hubs={INITIAL_HUBS}
              kpis={INITIAL_KPIS}
              alerts={alerts}
              onSelectVehicle={v => setSelectedVehicle(v)}
              onOpenRouteOptimizer={v => handleOpenRouteOptimizerWithVehicle(v)}
              onNavigateTab={tab => setActiveTab(tab)}
            />
          )}

          {activeTab === 'fleet' && (
            <FleetManagement
              vehicles={vehicles}
              onAddVehicle={handleAddVehicle}
              onSelectVehicle={v => setSelectedVehicle(v)}
              onOpenOptimizer={v => handleOpenRouteOptimizerWithVehicle(v)}
            />
          )}

          {activeTab === 'analytics' && (
            <OperationalAnalytics kpis={INITIAL_KPIS} />
          )}

          {activeTab === 'route-optimizer' && (
            <AiRouteOptimizer initialVehicle={optimizerVehicle} />
          )}

          {activeTab === 'maintenance' && (
            <PredictiveMaintenance
              vehicles={vehicles}
              alerts={alerts}
              onResolveAlert={handleResolveAlert}
            />
          )}

          {activeTab === 'compliance' && (
            <DriverCompliance />
          )}

          {activeTab === 'cross-platform' && (
            <CrossPlatformTracking />
          )}
        </main>
      </div>

      {/* AI Operational Co-Pilot Chat Modal */}
      <AiOperationalCopilotModal
        isOpen={isAiAssistantOpen}
        onClose={() => setIsAiAssistantOpen(false)}
        onNavigateTab={tab => {
          setActiveTab(tab);
          setIsAiAssistantOpen(false);
        }}
      />
    </div>
  );
}
