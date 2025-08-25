// Database Types for Supabase PostgreSQL
export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile
        Insert: Omit<UserProfile, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<UserProfile, 'id' | 'user_id' | 'created_at'>>
      }
      assessments: {
        Row: Assessment
        Insert: Omit<Assessment, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Assessment, 'id' | 'user_id' | 'created_at'>>
      }
      login_history: {
        Row: LoginHistory
        Insert: Omit<LoginHistory, 'id' | 'created_at'>
        Update: never // Read-only table
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'petani' | 'manajer'
      assessment_stage: 'pretest' | 'stage1' | 'stage2' | 'stage3' | 'final'
    }
  }
}

// User Profile Types
export interface UserProfile {
  id: string
  user_id: string // References auth.users.id
  full_name: string
  email: string
  phone: string
  address: string
  role: Database['public']['Enums']['user_role']
  avatar_url?: string
  created_at: string
  updated_at: string
}

// Assessment Types
export interface Assessment {
  id: string
  user_id: string
  stage: Database['public']['Enums']['assessment_stage']
  answers_json: AssessmentAnswers
  total_score: number
  max_score: number
  percentage: number
  completed_at?: string
  created_at: string
  updated_at: string
}

// Assessment Answer Structure
export interface AssessmentAnswers {
  [questionId: string]: {
    answer: string | number | boolean | string[]
    score?: number
    max_score?: number
  }
}

// Login History Types
export interface LoginHistory {
  id: string
  user_id: string
  login_timestamp: string
  ip_address?: string
  user_agent?: string
  success: boolean
  created_at: string
}

// Authentication Types
export interface AuthUser {
  id: string
  email: string
  email_confirmed_at?: string
  phone?: string
  created_at: string
  updated_at: string
  last_sign_in_at?: string
}

// API Request Types
export interface RegisterRequest {
  email: string
  password: string
  full_name: string
  phone: string
  address: string
  role: Database['public']['Enums']['user_role']
}

export interface LoginRequest {
  email: string
  password: string
}

export interface UpdateProfileRequest {
  full_name?: string
  phone?: string
  address?: string
  role?: Database['public']['Enums']['user_role']
  avatar_url?: string
}

export interface CreateAssessmentRequest {
  stage: Database['public']['Enums']['assessment_stage']
  answers_json: AssessmentAnswers
  total_score: number
  max_score: number
  percentage: number
}

export interface UpdateAssessmentRequest {
  answers_json?: AssessmentAnswers
  total_score?: number
  max_score?: number
  percentage?: number
  completed_at?: string
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface AuthResponse {
  success: boolean
  user?: {
    id: string
    email: string
    profile?: UserProfile
  }
  session?: {
    access_token: string
    refresh_token: string
    expires_at: number
  }
  error?: string
  message?: string
}

export interface ProfileResponse extends ApiResponse<UserProfile> {}

export interface AssessmentResponse extends ApiResponse<Assessment> {}

export interface AssessmentListResponse extends ApiResponse<Assessment[]> {}

export interface LoginHistoryResponse extends ApiResponse<LoginHistory[]> {}

// Pagination Types
export interface PaginationParams {
  page?: number
  limit?: number
  sort_by?: string
  sort_order?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number
    limit: number
    total: number
    total_pages: number
    has_next: boolean
    has_prev: boolean
  }
}

// Error Types
export interface ValidationError {
  field: string
  message: string
  code?: string
}

export interface ApiError {
  error: string
  message: string
  code?: string
  details?: ValidationError[]
  timestamp?: string
}

// Supabase Client Types
export interface SupabaseConfig {
  url: string
  anonKey: string
  serviceKey?: string
}

// Middleware Types
export interface AuthenticatedRequest extends Request {
  user?: AuthUser
  profile?: UserProfile
}

// Frontend Hook Types
export interface UseAuthReturn {
  user: AuthUser | null
  profile: UserProfile | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<AuthResponse>
  signUp: (data: RegisterRequest) => Promise<AuthResponse>
  signOut: () => Promise<void>
  updateProfile: (data: UpdateProfileRequest) => Promise<ProfileResponse>
  refreshSession: () => Promise<void>
}

export interface UseAssessmentReturn {
  assessments: Assessment[]
  currentAssessment: Assessment | null
  loading: boolean
  error: string | null
  createAssessment: (data: CreateAssessmentRequest) => Promise<AssessmentResponse>
  updateAssessment: (id: string, data: UpdateAssessmentRequest) => Promise<AssessmentResponse>
  getAssessment: (id: string) => Promise<AssessmentResponse>
  getAssessments: (params?: PaginationParams) => Promise<AssessmentListResponse>
  deleteAssessment: (id: string) => Promise<ApiResponse>
}

// Utility Types
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]