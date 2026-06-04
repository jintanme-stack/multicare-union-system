// TypeScript Interface Definitions: MultiCare Support Malaysia Union (MCSA)

export type UserRole = 'super_admin' | 'union_admin' | 'member' | 'customer' | 'family_member';
export type MemberCategory = 'companion' | 'confinement' | 'elderly' | 'rehab';
export type CaseStatus = 'pending_assignment' | 'active' | 'suspended' | 'completed' | 'cancelled';
export type ProfileStatus = 'pending_verification' | 'active' | 'expired' | 'suspended';

export interface Profile {
  id: string; // Auth UUID
  email: string;
  full_name: string;
  phone: string;
  role: UserRole;
  status: ProfileStatus;
  created_at: string;
  updated_at: string;
}

export interface UnionMember {
  id: string;
  profile_id: string;
  member_number: string; // Format: MCSA-YYYY-XXXX
  category: MemberCategory;
  experience_years: number;
  join_date: string;
  expiry_date: string;
  license_fee_paid: number;
  points: number;
  rating: number;
  digital_card_url?: string;
  bio?: string;
}

export interface Client {
  id: string;
  profile_id?: string;
  full_name: string;
  date_of_birth: string;
  gender: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  created_by?: string;
  created_at: string;
}

export interface FamilyAssociation {
  id: string;
  client_id: string;
  family_profile_id: string;
  relationship: string;
  created_at: string;
}

export interface MedicalInfo {
  id: string;
  client_id: string;
  blood_type?: string;
  allergies?: string;
  medical_conditions?: string;
  emergency_instructions?: string;
  updated_at: string;
}

export interface Case {
  id: string;
  client_id: string;
  assigned_member_id?: string;
  status: CaseStatus;
  start_date: string;
  end_date?: string;
  description?: string;
  created_at: string;
}

export interface Appointment {
  id: string;
  case_id: string;
  appointment_time: string;
  hospital_name: string;
  department: string;
  symptoms?: string;
  companion_report?: string;
  family_comm_log?: string;
  created_at: string;
}

export interface ConfinementLog {
  id: string;
  case_id: string;
  mother_recovery_notes?: string;
  baby_weight?: number;
  feeding_time?: string;
  formula_ml?: number;
  breastfeeding_mins?: number;
  diaper_change?: string;
  sleep_hours?: number;
  created_at: string;
}

export interface ElderlyVital {
  id: string;
  case_id: string;
  systolic_bp?: number;
  diastolic_bp?: number;
  blood_sugar?: number;
  pulse_bpm?: number;
  medication_taken: boolean;
  medication_notes?: string;
  family_update_log?: string;
  general_notes?: string;
  created_at: string;
}

export interface CareNote {
  id: string;
  case_id: string;
  logged_by: string;
  content: string;
  visit_summary?: string;
  document_url?: string;
  created_at: string;
}

export interface BillingTransaction {
  id: string;
  member_id?: string;
  amount: number;
  payment_type: string; // 'membership_fee', 'commission'
  paid_at: string;
  status: string; // 'success', 'failed'
}
