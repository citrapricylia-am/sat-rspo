// src/lib/api.ts
import { supabase } from "@/lib/supabaseClient";
import type { User as SupabaseAuthUser } from "@supabase/supabase-js";

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

/* Helpers */
const nn = (v?: string | null) => {
  const s = typeof v === "string" ? v.trim() : v ?? null;
  return s === "" ? null : s;
};
const mapProfileRow = (row: any): UserProfile => ({
  id: row.id,
  fullName: row.full_name ?? "",
  email: row.email ?? "",
  phone: row.phone ?? null,
  address: row.address ?? null,
  role: row.role as AppRole,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

/* ==== Profiles ==== */
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw new Error(`Gagal mengambil profil: ${error.message}`);
  return data ? mapProfileRow(data) : null;
}

/**
 * Sinkron + perapihan profil:
 * - Jika belum ada → insert lengkap
 * - Jika ada tapi ada field kosong → di-update dari sumber (form/metadata)
 */
async function getOrCreateAndFixProfile(
  authUser: SupabaseAuthUser,
  opt?: { fullName?: string; role?: AppRole; phone?: string | null; address?: string | null }
): Promise<UserProfile> {
  const meta = (authUser.user_metadata || {}) as any;

  // Sumber nilai (prioritas: form → metadata → fallback)
  const fullName = nn(opt?.fullName) ?? nn(meta.full_name) ?? (authUser.email?.split("@")[0] ?? "Pengguna");
  const phone    = nn(opt?.phone)    ?? nn(meta.phone)    ?? null;
  const address  = nn(opt?.address)  ?? nn(meta.address)  ?? null;
  const role     = (opt?.role ?? (meta.role as AppRole) ?? "petani") as AppRole;

  const existing = await getUserProfile(authUser.id);

  if (!existing) {
    // Buat baru
    const { error } = await supabase.from("profiles").insert({
      id: authUser.id,
      full_name: fullName,
      email: authUser.email,
      phone,
      address,
      role,
    });
    if (error) {
      const code = (error as any)?.code;
      const status = (error as any)?.status || (error as any)?.statusCode;
      if (!(code === "23505" || status === 409)) {
        throw new Error(`Gagal membuat profil: ${error.message}`);
      }
    }
    const created = await getUserProfile(authUser.id);
    if (!created) throw new Error("Profil gagal dibuat.");
    return created;
  }

  // Sudah ada → isi kekosongan jika ada data sumber
  const patch: Record<string, any> = {};
  if (!existing.fullName && fullName) patch.full_name = fullName;
  if (!existing.phone && phone) patch.phone = phone;
  if (!existing.address && address) patch.address = address;
  if (!existing.role && role) patch.role = role;

  if (Object.keys(patch).length > 0) {
    patch.id = authUser.id;
    const { error } = await supabase.from("profiles").upsert(patch, { onConflict: "id" });
    if (error) throw new Error(`Gagal memperbarui profil: ${error.message}`);
  }

  const fixed = await getUserProfile(authUser.id);
  if (!fixed) throw new Error("Profil tidak ditemukan.");
  return fixed;
}

/* ==== AUTH ==== */
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

  // Email sudah pernah terdaftar → login dengan password yang sama
  if (error && (error.status === 422 || /already registered/i.test(error.message))) {
    const { data: signinData, error: signinErr } = await supabase.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });
    if (signinErr || !signinData?.user) {
      throw new Error("Email sudah terdaftar. Silakan login atau reset password.");
    }
    // Rapikan profil
    return await getOrCreateAndFixProfile(signinData.user, payload);
  }

  if (error) throw new Error(`Gagal mendaftar: ${error.message}`);
  if (!data.user) throw new Error("Registrasi gagal mendapatkan sesi.");

  // Insert/rapikan profil penuh
  return await getOrCreateAndFixProfile(data.user, payload);
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

  // Rapikan profil (untuk akun lama yg datanya kosong)
  return await getOrCreateAndFixProfile(data.user);
}

async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(`Gagal logout: ${error.message}`);
}

/* ==== ASSESSMENT ==== */
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
  totalScore: number; // 0..100
  maxScore: number;   // 100
}) {
  const payload = {
    user_id: params.userId,
    stage: `stage${params.stage}`,
    answers_json: params.answers ?? [],
    total_score: params.totalScore,
    max_score: params.maxScore,
    completed_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("assessments").upsert(payload, { onConflict: "user_id,stage" });
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
  // auth
  register,
  login,
  logout,
  getUserProfile,
  // assessments
  saveAssessmentResult,
  getAssessmentStage,
  listUserAssessments,
};
