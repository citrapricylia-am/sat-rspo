// src/lib/api.ts
import { createClient, type User as SupabaseAuthUser } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } }
);

export type AppRole = "petani" | "manajer";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  role: AppRole;
  created_at?: string;
  updated_at?: string;
}

const nn = (v?: string | null) => {
  const s = typeof v === "string" ? v.trim() : v ?? null;
  return s === "" ? null : s;
};

const mapProfileRow = (row: any): UserProfile => ({
  id: row.id,
  fullName: row.full_name,
  email: row.email,
  phone: row.phone ?? null,
  address: row.address ?? null,
  role: row.role,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(`Gagal mengambil profil: ${error.message}`);
  return data ? mapProfileRow(data) : null;
}

async function upsertProfileExact(
  authUser: SupabaseAuthUser,
  payload: { fullName: string; role: AppRole; phone?: string | null; address?: string | null }
) {
  const { error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: authUser.id,
        full_name: payload.fullName,
        email: authUser.email,
        phone: nn(payload.phone),
        address: nn(payload.address),
        role: payload.role,
      },
      { onConflict: "id" }
    );
  if (error) throw new Error(`Gagal menyimpan profil: ${error.message}`);
}

export async function ensureProfileFor(authUser: SupabaseAuthUser): Promise<UserProfile> {
  let existing = await getUserProfile(authUser.id);
  if (existing) return existing;

  const minimalFullName =
    (authUser.user_metadata as any)?.full_name ||
    (authUser.email ? authUser.email.split("@")[0] : "Pengguna");

  const { error } = await supabase.from("profiles").insert({
    id: authUser.id,
    full_name: minimalFullName,
    email: authUser.email,
    role: "petani",
  });
  if (error) {
    const code = (error as any)?.code;
    const status = (error as any)?.status || (error as any)?.statusCode;
    if (!(code === "23505" || status === 409)) {
      throw new Error(`Gagal membuat profil: ${error.message}`);
    }
  }

  existing = await getUserProfile(authUser.id);
  if (!existing) throw new Error("Profil gagal dibuat.");
  return existing;
}

/* ========== AUTH ========== */
async function register(payload: {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: AppRole;
  password: string;
}): Promise<UserProfile> {
  const { data, error } = await supabase.auth.signUp({
    email: payload.email,
    password: payload.password,
    options: {
      data: {
        full_name: payload.fullName,
        role: payload.role,
        phone: nn(payload.phone),
        address: nn(payload.address),
      },
    },
  });

  if (error) {
    if (error.message?.toLowerCase().includes("user already registered") || error.status === 422) {
      throw new Error("Email sudah terdaftar. Silakan login.");
    }
    throw new Error(`Gagal mendaftar: ${error.message}`);
  }

  const authUser = data.user;
  if (!authUser) throw new Error("Registrasi gagal mendapatkan sesi.");

  await upsertProfileExact(authUser, {
    fullName: payload.fullName,
    role: payload.role,
    phone: payload.phone ?? null,
    address: payload.address ?? null,
  });

  const profile = await getUserProfile(authUser.id);
  if (!profile) throw new Error("Profil belum tersedia setelah registrasi.");
  return profile;
}

async function login(credentials: { email: string; password: string }): Promise<UserProfile> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    const msg = error.message?.toLowerCase?.() || "";
    if (msg.includes("invalid login credentials")) {
      throw new Error("Email atau password salah.");
    }
    throw new Error(`Gagal login: ${error.message}`);
  }
  if (!data.user) throw new Error("Login gagal: user auth tidak ditemukan.");

  return await ensureProfileFor(data.user);
}

async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(`Gagal logout: ${error.message}`);
}

/* ========== ASSESSMENT ========== */

export type AnswerInput = {
  questionId?: string;
  value?: any;
  score: number;
  subAnswers?: { questionId?: string; value?: any; score: number }[];
  [key: string]: any;
};

async function saveAssessmentResult(params: {
  userId: string;
  stage: 1 | 2 | 3;
  answers: AnswerInput[];
  totalScore: number;   // 0..100
  maxScore: number;     // 100
  percentage?: number;
}) {
  const payload = {
    user_id: params.userId,
    stage: `stage${params.stage}`,
    answers_json: params.answers ?? [],
    total_score: params.totalScore, // 0..100
    max_score: params.maxScore,     // 100
    completed_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("assessments")
    .upsert(payload, { onConflict: "user_id,stage" });

  if (error) throw new Error(`Gagal menyimpan hasil assessment: ${error.message}`);
}

async function getAssessmentStage(userId: string, stage: 1 | 2 | 3) {
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", userId)
    .eq("stage", `stage${stage}`)
    .maybeSingle();

  if (error) throw new Error(`Gagal mengambil hasil stage: ${error.message}`);
  return data;
}

async function listUserAssessments(userId: string) {
  const { data, error } = await supabase
    .from("assessments")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: false });

  if (error) throw new Error(`Gagal mengambil daftar assessment: ${error.message}`);
  return data;
}

export const api = {
  register,
  login,
  logout,
  getUserProfile,
  ensureProfileFor,
  saveAssessmentResult,
  getAssessmentStage,
  listUserAssessments,
};
