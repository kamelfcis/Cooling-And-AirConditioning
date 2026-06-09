import { createClient } from '@supabase/supabase-js';

// These should be set in environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  const errorMsg = 'Supabase environment variables are not set. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local file and restart the dev server.';
  console.error(errorMsg);
  console.error('Current values:', { 
    url: supabaseUrl || 'MISSING', 
    key: supabaseAnonKey ? 'SET' : 'MISSING' 
  });
  throw new Error(errorMsg);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export type UserRole = 'customer' | 'engineer' | 'admin';
export type ServiceStatus = 'pending' | 'on_the_way' | 'in_progress' | 'completed';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  code: string;
  name_en: string;
  name_ar: string;
  description_en?: string;
  description_ar?: string;
  base_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Engineer {
  id: string;
  user_id: string;
  city: string;
  specialization?: string;
  years_experience?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceRequest {
  id: string;
  customer_id: string;
  engineer_id?: string;
  service_id: string;
  ac_count: number;
  preferred_datetime: string;
  status: ServiceStatus;
  estimated_price: number;
  final_price?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  // Joined data
  service?: Service;
  customer?: User;
  engineer?: Engineer & { user?: User };
}

export interface Review {
  id: string;
  service_request_id: string;
  engineer_id: string;
  customer_id: string;
  rating: number;
  comment?: string;
  created_at: string;
  // Joined data
  engineer?: Engineer & { user?: User };
  customer?: User;
}

