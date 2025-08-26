import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

  const score = getStageScore(stage as 1 | 2 | 3);
  const maxScore = getStageMaxScore(stage as 1 | 2 | 3);
  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  const minimumPassScore = 60;
  const isPassed = percentage >= minimumPassScore;
  const percentile = Math.min(
    95,
    Math.max(5, Math.round(percentage + Math.random() * 10))
  );

  useEffect(() => {
    if (!user || hasSavedRef.current) return;
    const answers = stage === 1 ? assessmentData.stage1 : stage === 2 ? assessmentData.stage2 : assessmentData.stage3;
    if (answers.length === 0) return; // nothing to save

    (async () => {
      try {
        // Ganti baris ini dari `api.saveAssessment` ke `api.saveAssessmentResult`
        await api.saveAssessmentResult({
          userId: user.id,
          stage: stage as 1 | 2 | 3,
          answers,
          totalScore: score,
          maxScore,
          percentage,
        });
        hasSavedRef.current = true;
      } catch (e) {
        console.error("Gagal menyimpan hasil assessment:", e);
        toast({
          title: "Error",
          description: "Gagal menyimpan hasil asesmen. Silakan coba lagi.",
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
    if (stage === 1) {
      navigate("/milestone-a");
    } else if (stage === 2) {
      navigate("/milestone-b");
    } else {
      navigate("/final-result");
    }
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
            <Button
              onClick={handleContinue}
              size="lg"
              aria-label="Lanjut ke soal berikutnya"
              className="bg-gradient-primary hover:opacity-90 transition-opacity rounded-xl"
            >
              Lanjut ke Soal Berikutnya
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

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
                  <PieChartIcon className="h-5 w-5" />
                  Distribusi Skor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={scoreDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {scoreDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
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
