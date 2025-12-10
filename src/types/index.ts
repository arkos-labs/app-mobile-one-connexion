export type DriverStatus = 'available' | 'busy' | 'offline' | 'suspended';

export type OrderStatus = 
  | 'pending_acceptance' 
  | 'accepted' 
  | 'dispatched' 
  | 'in_progress'
  | 'delivered' 
  | 'cancelled';

export type DeliveryType = 'Standard' | 'Express' | 'Flash Express';

export type DocumentType = 'license' | 'registration' | 'insurance' | 'identity';
export type DocumentStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export type VehicleType = 'scooter' | 'moto' | 'voiture' | 'velo';
export type VehicleStatus = 'active' | 'inactive' | 'maintenance';

export interface Driver {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  vehicle_type?: string;
  vehicle_plate?: string;
  status: DriverStatus;
  current_lat?: number;
  current_lng?: number;
  last_position_update?: string;
  avatar_url?: string;
  push_token?: string;
}

export interface Order {
  id: string;
  reference: string;
  client_id?: string;
  driver_id?: string;
  pickup_address: string;
  delivery_address: string;
  pickup_lat?: number;
  pickup_lng?: number;
  delivery_lat?: number;
  delivery_lng?: number;
  delivery_type: DeliveryType;
  price: number;
  status: OrderStatus;
  created_at: string;
  accepted_at?: string;
  dispatched_at?: string;
  delivered_at?: string;
  proof_photo_url?: string;
  signature_url?: string;
  notes?: string;
  package_description?: string;
  client_phone?: string;
  client_name?: string;
}

export interface Vehicle {
  id: string;
  driver_id: string;
  brand: string;
  model: string;
  plate_number: string;
  type: VehicleType;
  color?: string;
  status: VehicleStatus;
  is_primary: boolean;
  created_at: string;
}

export interface DriverDocument {
  id: string;
  driver_id: string;
  document_type: DocumentType;
  file_url: string;
  expiry_date?: string;
  status: DocumentStatus;
  uploaded_at: string;
  reviewed_at?: string;
  rejection_reason?: string;
}

export interface DailyStats {
  completedOrders: number;
  totalEarnings: number;
  totalDistance: number;
}

export interface OrderEvent {
  id: string;
  order_id: string;
  event_type: string;
  event_data?: Record<string, unknown>;
  created_at: string;
}
