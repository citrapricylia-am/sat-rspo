// src/lib/scoreUtils.ts
import { Answer } from "@/contexts/AssessmentContext";

/** Hitung skor mentah */
export function calcRawScore(answers: Answer[]): number {
  return answers.reduce((sum, a) => {
    const main = Number(a.score) || 0;
    const sub  = (a.subAnswers || []).reduce((s, x) => s + (Number(x.score) || 0), 0);
    return sum + main + sub;
  }, 0);
}

/** Hitung skor maksimal mentah */
export function calcRawMax(answers: Answer[]): number {
  return answers.reduce((max, ans) => {
    const subCount = Array.isArray(ans.subAnswers) ? ans.subAnswers.length : 0;
    return max + 2 + (subCount * 2); // diasumsikan skor max = 2 per pertanyaan
  }, 0);
}

/** Normalisasi skor ke 0..100 */
export function normalizeScore(rawScore: number, rawMax: number): number {
  if (rawMax <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((rawScore / rawMax) * 100)));
}
