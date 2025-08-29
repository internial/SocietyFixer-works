/**
 * Represents the structure of a campaign object, including all its properties
 * as defined in the Supabase database schema.
 */
export interface Campaign {
  id: string;
  created_at: string;
  user_id: string;
  candidate_name: string;
  portrait_url: string;
  election_deadline: string;
  election_name: string;
  scope: 'Local' | 'State' | 'National';
  election_region: string;
  position_name: string;
  proposed_policies: string;
  political_party: string;
  gender: string;
  date_of_birth: string;
  religion: string;
  resume_url: string;
  contact_email: string;
  social_media_url: string;
  // This field might be present if a database join is performed,
  // for example to get the user's location.
  users?: {
    raw_user_meta_data?: {
      location?: string;
    }
  }
}

/**
 * Defines the structure for a toast message object.
 */
export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'danger' | 'info' | 'warning';
  duration?: number;
}

/**
 * Defines the shape of the toast context.
 */
export interface ToastContextType {
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: number) => void;
}
