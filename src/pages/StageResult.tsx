import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef } from "react";
import { useAssessment, Answer } from "@/contexts/AssessmentContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  Trophy,
  Download,
  CheckCircle,
  XCircle,
  ArrowRight,
  FileText,
  BarChart3,
  PieChartIcon,
  User,
  RotateCcw,
} from "lucide-react";
import {
  principlesCriteria,
  getQuestionPrincipleCriteria,
} from "@/data/principlesCriteria";
import {
  stage1Questions,
  stage2Questions,
  stage3Questions,
} from "@/data/questions";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { api } from "@/lib/api";

export default function StageResult() {
  const { stage: stageParam } = useParams<{ stage: string }>();
  const stage = parseInt(stageParam?.replace("stage", "") || "1");
  const { assessmentData, getStageScore, getStageMaxScore, isEligibleForNextStage } =
    useAssessment();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const hasSavedRef = useRef(false);

  // === Perhitungan skor dinormalisasi ke 0..100 (UI & DB sama) ===
  const rawScore = getStageScore(stage as 1 | 2 | 3);
  const rawMax   = getStageMaxScore(stage as 1 | 2 | 3);
  const score = rawMax > 0 ? Math.round((rawScore / rawMax) * 100) : 0; // 0..100
  const maxScore = 100;                   // tampil & simpan selalu 100
  const percentage = score;               // identik

  // Persentil: jika skor 100 → 100, selain itu variasi kecil
  const percentile = score === 100
    ? 100
    : Math.min(95, Math.max(5, Math.round(score + Math.random() * 10)));

  // Different minimum pass scores based on stage
  const minimumPassScore = stage === 1 ? 70 : 60; // Stage 1 (eligibility) requires 70%
  const isPassed = percentage >= minimumPassScore;
  const isEligible = stage === 1 ? isEligibleForNextStage(1) : true; // Check eligibility for stage 1

  // Simpan hasil ke DB (upsert user_id+stage) — nilai 0..100
  useEffect(() => {
    if (!user || hasSavedRef.current) return;
    const answers =
      stage === 1
        ? assessmentData.stage1
        : stage === 2
        ? assessmentData.stage2
        : assessmentData.stage3;
    if (answers.length === 0) return; // nothing to save

    (async () => {
      try {
        await api.saveAssessmentResult({
          userId: user.id,
          stage: stage as 1 | 2 | 3,
          answers,
          totalScore: score,  // 0..100
          maxScore,           // 100
          percentage,         // 0..100
        });
        console.log("💾 save payload", { uid: user.id, stage, answersCount: answers.length, score });
        hasSavedRef.current = true;
        toast({
          title: "Hasil Tersimpan",
          description: `Hasil ${getStageTitle()} berhasil disimpan ke database.`,
        });
      } catch (e) {
        console.error(`❌ Gagal menyimpan hasil Stage ${stage}:`, e);
        toast({
          title: "Error",
          description: `Gagal menyimpan hasil ${getStageTitle()}. Silakan coba lagi.`,
          variant: "destructive"
        });
      }
    })();
  }, [user, stage, assessmentData, score, maxScore, percentage, toast]);

  const getStageTitle = () => {
    switch (stage) {
      case 1:
        return "Eligibility Test";
      case 2:
        return "Milestone A";
      case 3:
        return "Milestone B";
      default:
        return "Assessment";
    }
  };

  const handleContinue = () => {
    if (stage === 1 && !isEligible) {
      toast({
        title: "Tidak Memenuhi Syarat",
        description: "Skor minimal 70% diperlukan untuk melanjutkan ke tahap berikutnya.",
        variant: "destructive"
      });
      return;
    }
    if (stage === 1) navigate("/milestone-a");
    else if (stage === 2) navigate("/milestone-b");
    else navigate("/final-result");
  };

  const handleRetry = () => {
    if (stage === 1) navigate("/eligibility");
  };

  const handleConfirmExit = () => {
    navigate("/home");
  };

  const getRecommendations = () => {
    if (percentage >= 85) {
      return [
        "Luar biasa! Siap melanjutkan ke tahap berikutnya",
        "Pertahankan kualitas pemahaman ini",
        "Siap untuk implementasi praktik berkelanjutan",
      ];
    } else if (percentage >= 70) {
      return [
        "Bagus! Tingkatkan sedikit lagi untuk hasil optimal",
        "Review materi yang belum sempurna",
        "Siap melanjutkan dengan catatan perbaikan",
      ];
    } else if (percentage >= 55) {
      return [
        "Cukup baik, namun perlu peningkatan",
        "Fokus pada area yang lemah",
        "Pertimbangkan pelatihan tambahan",
      ];
    } else {
      return [
        "Perlu peningkatan signifikan",
        "Ulang materi dan ikuti pelatihan",
        "Konsultasi dengan mentor sebelum lanjut",
      ];
    }
  };

  const getStageQuestions = () => {
    switch (stage) {
      case 1:
        return stage1Questions;
      case 2:
        return stage2Questions;
      case 3:
        return stage3Questions;
      default:
        return [];
    }
  };

  const getStageAnswers = () => {
    const stageAnswers: { [key: string]: Answer } = {};
    const answers =
      stage === 1
        ? assessmentData.stage1
        : stage === 2
        ? assessmentData.stage2
        : assessmentData.stage3;
    answers.forEach((answer) => {
      stageAnswers[answer.questionId] = answer;
    });
    return stageAnswers;
  };

  // Auto-redirect for Stage 3 (Milestone B) after 3 seconds
  useEffect(() => {
    if (stage === 3) {
      const timer = setTimeout(() => {
        navigate("/results/final");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [stage, navigate]);

  const scoreDistributionData = [
    { name: "Skor Anda", value: score, fill: "#22c55e" },
    { name: "Sisa Skor", value: maxScore - score, fill: "#e5e7eb" },
  ];

  // === Spider chart per prinsip: hitung dari JAWABAN yang benar-benar muncul ===
  const getPrincipleScores = () => {
    const stageAnswersMap = getStageAnswers();
    const answers: Answer[] =
      stage === 1 ? assessmentData.stage1 :
      stage === 2 ? assessmentData.stage2 :
      assessmentData.stage3;

    type Bucket = { score: number; max: number };
    const buckets: Record<string, Bucket> = {
      "Prinsip 1": { score: 0, max: 0 },
      "Prinsip 2": { score: 0, max: 0 },
      "Prinsip 3": { score: 0, max: 0 },
      "Prinsip 4": { score: 0, max: 0 },
    };

    answers.forEach((ans) => {
      const info = ans.questionId
        ? getQuestionPrincipleCriteria(ans.questionId, { stage: stage as 1 | 2 | 3 })
        : null;
      if (!info) return;

      const principleTitle = info.principle?.title as keyof typeof buckets;
      if (!buckets[principleTitle]) return;

      // Skor aktual: main + sub yang tampil
      const main = Number(ans.score) || 0;
      const sub  = (ans.subAnswers || []).reduce((s, x) => s + (Number(x.score) || 0), 0);
      buckets[principleTitle].score += main + sub;

      // Maksimum: 2 (pertanyaan utama) + 2 per sub-pertanyaan yang tampil
      const subCount = Array.isArray(ans.subAnswers) ? ans.subAnswers.length : 0;
      buckets[principleTitle].max += 2 + (subCount * 2);
    });

    return Object.entries(buckets).map(([principle, v]) => ({
      principle,
      score: v.max > 0 ? Math.round((v.score / v.max) * 100) : 0,
      maxScore: 100,
    }));
  };

  const principleScoresData = getPrincipleScores();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
              <Trophy className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Hasil {getStageTitle()}
            </h1>
            <p className="text-muted-foreground">
              Assessment selesai pada {new Date().toLocaleDateString("id-ID")}
            </p>
          </div>

          {/* Score Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center">
              <CardHeader className="pb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-2">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg text-muted-foreground">
                  Skor Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-2">
                  {score}
                </div>
                <div className="text-muted-foreground">dari {maxScore}</div>
                <div className="mt-3">
                  <Badge
                    variant={
                      percentage >= 85
                        ? "default"
                        : percentage >= 70
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {percentage}%
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-2">
                  {isPassed ? (
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <CardTitle className="text-lg text-muted-foreground">
                  Status Kelulusan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold mb-2 ${
                    isPassed ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isPassed ? "LULUS" : "TIDAK LULUS"}
                </div>
                <div className="text-muted-foreground">
                  Min: {minimumPassScore}%
                </div>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader className="pb-3">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mx-auto mb-2">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg text-muted-foreground">
                  Persentil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-2">
                  {percentile}%
                </div>
                <div className="text-muted-foreground">dari peserta lain</div>
              </CardContent>
            </Card>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-8">
            {stage === 1 && !isEligible ? (
              <>
                <Button
                  onClick={handleRetry}
                  size="lg"
                  aria-label="Coba tes ulang"
                  className="bg-orange-500 hover:bg-orange-600 transition-colors rounded-xl"
                >
                  Coba Tes Ulang
                  <RotateCcw className="ml-2 h-4 w-4" />
                </Button>
                <div className="text-center text-sm text-muted-foreground">
                  Skor minimal 70% diperlukan untuk melanjutkan
                </div>
              </>
            ) : (
              <Button
                onClick={handleContinue}
                size="lg"
                aria-label="Lanjut ke soal berikutnya"
                className="bg-gradient-primary hover:opacity-90 transition-opacity rounded-xl"
                disabled={stage === 1 && !isEligible}
              >
                {stage === 3 ? "Lihat Hasil Final" : "Lanjut ke Soal Berikutnya"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="lg" className="rounded-xl">
                  Keluar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent role="dialog">
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin tidak ingin melanjutkan mengerjakan soal?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmExit}>
                    Ya, Keluar
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Charts Section */}
          <div
            id="charts-section"
            className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Skor per Prinsip RSPO
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={principleScoresData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="principle" className="text-xs" />
                    <PolarRadiusAxis
                      angle={90}
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="Skor (%)"
                      dataKey="score"
                      stroke="#22c55e"
                      fill="#22c55e"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                    <Tooltip 
                      formatter={(value) => [`${value}%`, 'Skor']}
                      labelFormatter={(label) => `${label}`}
                    />
                    <Legend />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Progress {getStageTitle()}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Pencapaian</span>
                    <span className="font-semibold">{percentage}%</span>
                  </div>
                    <Progress value={percentage} className="h-3" />
                </div>
                <div className="text-sm text-muted-foreground">
                  Anda berhasil mencapai {score} dari {maxScore} poin yang
                  tersedia
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detail and Recommendations */}
          <Tabs defaultValue="detail" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="detail">Detail</TabsTrigger>
              <TabsTrigger value="recommendations">Rekomendasi</TabsTrigger>
            </TabsList>

            <TabsContent value="detail" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Detail Hasil {getStageTitle()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {score}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Skor Diperoleh
                        </p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {maxScore}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Skor Maksimal
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">Persentase Pencapaian</span>
                        <span className="font-semibold">{percentage}%</span>
                      </div>
                      <Progress value={percentage} className="h-3" />
                    </div>

                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-semibold mb-2">Status:</h4>
                      <p
                        className={`text-sm font-medium ${
                          isPassed ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isPassed
                          ? "LULUS - Siap melanjutkan ke tahap berikutnya"
                          : "TIDAK LULUS - Perlu peningkatan sebelum lanjut"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rekomendasi untuk {getStageTitle()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getRecommendations().map((recommendation, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-medium">
                          {index + 1}
                        </div>
                        <p className="text-sm">{recommendation}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
