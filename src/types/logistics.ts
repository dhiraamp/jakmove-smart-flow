export type VehicleStatus = 'IN_TRANSIT' | 'LOADING' | 'IDLE' | 'MAINTENANCE' | 'OUT_OF_SERVICE';

export type AlertSeverity = 'CRITICAL' | 'WARNING' | 'NORMAL';

export type CargoCategory = 'GENERAL' | 'COLD_CHAIN' | 'HIGH_VALUE' | 'HAZARDOUS' | 'CONTAINER_BULK';

export interface VehicleTelematics {
  speedKmH: number;
  engineRpm: number;
  coolantTempC: number;
  oilPressurePsi: number;
  fuelLevelPercent: number;
  batteryHealthPercent: number;
  brakePadWearPercent: number;
  vibrationHz: number;
  tirePressurePsi: {
    frontLeft: number;
    frontRight: number;
    rearLeftOuter: number;
    rearLeftInner: number;
    rearRightOuter: number;
    rearRightInner: number;
  };
  cargoTemperatureC?: number; // for cold chain
  cargoHumidityPercent?: number;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  model: string;
  type: 'CDD_BOX' | 'CDE_ENGKEL' | 'FUSO_HEAVY' | 'WINGBOX' | 'EV_BLIND_VAN' | 'TRONTON_TRAILER';
  typeName: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverAvatar: string;
  status: VehicleStatus;
  statusText: string;
  currentLocationName: string;
  coordinates: { x: number; y: number }; // SVG map percentage coordinates 0-100
  targetDestination: string;
  eta: string;
  loadWeightKg: number;
  maxWeightKg: number;
  fuelEfficiencyKmPerLiter: number;
  odometerKm: number;
  kirExpiryDate: string;
  stnkExpiryDate: string;
  telematics: VehicleTelematics;
  activeShipmentId?: string;
}

export interface HubLocation {
  id: string;
  name: string;
  code: string;
  type: 'PORT' | 'AIRPORT' | 'DC_WAREHOUSE' | 'INDUSTRIAL_PARK' | 'RETAIL_HUB';
  coordinates: { x: number; y: number };
  activeInbound: number;
  activeOutbound: number;
  city: string;
}

export interface RouteOptimizationResult {
  standardRoute: {
    distanceKm: number;
    durationMins: number;
    fuelLiters: number;
    tollCostRp: number;
    co2Kg: number;
    routeVia: string;
    congestionLevel: string;
  };
  optimizedRoute: {
    distanceKm: number;
    durationMins: number;
    fuelLiters: number;
    tollCostRp: number;
    co2Kg: number;
    fuelSavedLiters: number;
    costSavedRp: number;
    co2SavedKg: number;
    routeVia: string;
    congestionLevel: string;
  };
  summary: string;
  trafficBottlenecks: Array<{
    location: string;
    status: string;
    reason: string;
  }>;
  aiRecommendations: string[];
  ecoScore: number;
}

export interface MaintenanceAlert {
  id: string;
  vehicleId: string;
  plateNumber: string;
  vehicleModel: string;
  component: string;
  severity: AlertSeverity;
  currentValue: string;
  threshold: string;
  predictedFailureKm: number;
  downtimeRisk: string;
  diagnosis: string;
  workOrderSuggested: string;
  estimatedCostRp: number;
  createdAt: string;
  isResolved: boolean;
}

export interface DriverComplianceReport {
  driverId: string;
  driverName: string;
  assignedPlate: string;
  avatar: string;
  safetyScore: number; // 0 - 100
  harshBrakingCount: number;
  rapidAccelerationCount: number;
  speedingIncidents: number;
  drowsinessAlerts: number;
  drivingHoursToday: number; // in hours (limit: 8h)
  restHoursToday: number;
  hosStatus: 'COMPLIANT' | 'NEARING_LIMIT' | 'VIOLATION';
  preTripInspectionDone: boolean;
  licenseNumber: string;
  licenseValidUntil: string;
  monthlyTrips: number;
  onTimeRatePercent: number;
}

export interface ShipmentTrackingEvent {
  timestamp: string;
  title: string;
  desc: string;
  location: string;
}

export interface CrossPlatformShipment {
  trackingId: string;
  platform: string;
  courier: string;
  sender: string;
  recipient: string;
  status: 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CUSTOMS_CLEARED' | 'EXCEPTION';
  statusLabel: string;
  assignedVehicle: string;
  driverName: string;
  driverPhone: string;
  cargoType: string;
  currentLocation: string;
  eta: string;
  temperature?: number | null;
  progressPercent: number;
  events: ShipmentTrackingEvent[];
}

export interface OperationalKPIs {
  onTimeDeliveryRate: number; // 96.8%
  activeFleetCount: number;
  totalFleetCount: number;
  totalFuelSavedLiters: number;
  totalCostSavedRp: number;
  totalCo2SavedKg: number;
  averageTurnaroundTimeMins: number;
  fleetUtilizationRate: number; // 88.4%
  dailyTonnageMovedTons: number;
}
