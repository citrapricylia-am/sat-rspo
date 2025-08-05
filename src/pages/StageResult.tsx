import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  ArrowRight,
  Home,
  Trophy,
  TrendingUp,
  AlertCircle,
  Award,
  Calendar,
  User,
  Target,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { useAssessment } from "@/contexts/AssessmentContext";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";

const StageResult = () => {
  const { stage } = useParams<{ stage: string }>();
  const navigate = useNavigate();
  const { getStageScore, getTotalScore, nextStage, isEligibleForNextStage } =
    useAssessment();
  const { user } = useAuth();

  const stageNumber = parseInt(stage?.replace("stage", "") || "1") as 1 | 2 | 3;

  const currentStageScore = getStageScore(stageNumber);
  const totalScore = getTotalScore();

  // Mock max scores for percentage calculation
  const getMaxScore = (stage: 1 | 2 | 3): number => {
    switch (stage) {
      case 1:
        return 20;
      case 2:
        return 30;
      case 3:
        return 25;
      default:
        return 20;
    }
  };

  const currentStagePercentage =
    (currentStageScore / getMaxScore(stageNumber)) * 100;
  const totalMaxScore = getMaxScore(1) + getMaxScore(2) + getMaxScore(3);
  const totalPercentage = (totalScore / totalMaxScore) * 100;
  const minimumPassPercentage = 60;
  const isPassed = currentStagePercentage >= minimumPassPercentage;

  // Chart configuration
  const chartConfig = {
    score: {
      label: "Skor",
      color: "hsl(var(--primary))",
    },
    passed: {
      label: "Tercapai",
      color: "hsl(var(--primary))",
    },
    remaining: {
      label: "Sisa",
      color: "hsl(var(--muted))",
    },
  };

  // Score distribution data for chart
  const scoreDistributionData = [
    {
      name: "Skor Anda",
      value: currentStageScore,
      color: "hsl(var(--primary))",
    },
    {
      name: "Sisa Skor",
      value: getMaxScore(stageNumber) - currentStageScore,
      color: "hsl(var(--muted))",
    },
  ];

  const getStageName = () => {
    switch (stageNumber) {
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

  const getPerformanceLevel = (
    percentage: number
  ): { level: string; color: string; description: string } => {
    if (percentage >= 80) {
      return {
        level: "Excellent",
        color: "bg-success text-success-foreground",
        description:
          "Sangat baik! Anda telah menunjukkan pemahaman yang luar biasa.",
      };
    } else if (percentage >= 60) {
      return {
        level: "Good",
        color: "bg-primary text-primary-foreground",
        description:
          "Baik! Anda memiliki pemahaman yang solid dengan ruang untuk berkembang.",
      };
    } else if (percentage >= 40) {
      return {
        level: "Fair",
        color: "bg-warning text-warning-foreground",
        description:
          "Cukup. Masih ada area yang perlu diperbaiki dan diperkuat.",
      };
    } else {
      return {
        level: "Needs Improvement",
        color: "bg-destructive text-destructive-foreground",
        description:
          "Perlu peningkatan. Pertimbangkan untuk mempelajari lebih lanjut sebelum melanjutkan.",
      };
    }
  };

  const performance = getPerformanceLevel(currentStagePercentage);
  const eligible =
    stageNumber < 3 ? isEligibleForNextStage(stageNumber as 1 | 2) : true;

  const handleNextStage = () => {
    nextStage();
    if (stageNumber < 3) {
      navigate(`/assessment/stage${stageNumber + 1}`);
    } else {
      navigate("/results/final");
    }
  };

  const handleExit = () => {
    navigate("/");
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Hasil Tes SAT RSPO PADI
            </h1>
            <p className="text-muted-foreground">
              Selesai pada:{" "}
              {new Date().toLocaleDateString("id-ID", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Main Score Cards - Top Row matching reference design */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Score Card */}
            <Card className="text-center border-2 border-primary/10">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-medium text-muted-foreground">
                  Skor Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {currentStageScore}
                </div>
                <div className="text-muted-foreground">
                  dari {getMaxScore(stageNumber)}
                </div>
                <div className="mt-3">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    {performance.level}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Pass Status Card */}
            <Card className="text-center border-2 border-primary/10">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  {isPassed ? (
                    <CheckCircle className="w-6 h-6 text-blue-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-orange-600" />
                  )}
                </div>
                <CardTitle className="text-lg font-medium text-muted-foreground">
                  Tingkat Kelulusan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold mb-2 ${
                    isPassed ? "text-blue-600" : "text-orange-600"
                  }`}
                >
                  {isPassed ? "LULUS" : "PERLU PENINGKATAN"}
                </div>
                <div className="text-muted-foreground">
                  Standar minimum: {minimumPassPercentage}
                </div>
              </CardContent>
            </Card>

            {/* Percentile Card */}
            <Card className="text-center border-2 border-primary/10">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg font-medium text-muted-foreground">
                  Persentil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {Math.round(currentStagePercentage)}%
                </div>
                <div className="text-muted-foreground">
                  Pencapaian tahap ini
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Ringkasan</TabsTrigger>
              <TabsTrigger value="visual">Analisis Visual</TabsTrigger>
              <TabsTrigger value="navigation">Navigasi</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Stage Details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      Detail Tahap {stageNumber}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {currentStageScore}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Skor Diperoleh
                        </p>
                      </div>
                      <div className="text-center p-4 bg-muted/50 rounded-lg">
                        <div className="text-2xl font-bold text-primary">
                          {getMaxScore(stageNumber)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Skor Maksimal
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="font-medium">
                          Persentase Pencapaian
                        </span>
                        <span className="font-semibold">
                          {Math.round(currentStagePercentage)}%
                        </span>
                      </div>
                      <Progress
                        value={currentStagePercentage}
                        className="h-3"
                      />
                    </div>

                    <div className="p-4 bg-primary/5 rounded-lg">
                      <h4 className="font-semibold mb-2">Deskripsi Tahap:</h4>
                      <p className="text-sm text-muted-foreground">
                        {stageNumber === 1 &&
                          "Tahap ini menilai kelayakan dasar Anda untuk mengikuti program sertifikasi RSPO."}
                        {stageNumber === 2 &&
                          "Tahap ini mengevaluasi pemahaman Anda tentang praktik pengelolaan berkelanjutan."}
                        {stageNumber === 3 &&
                          "Tahap ini mengukur kemampuan implementasi keberlanjutan lanjutan dalam praktik perkebunan."}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Overall Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-primary" />
                      Progress Keseluruhan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Eligibility Test</span>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">
                            {getStageScore(1)}/{getMaxScore(1)}
                          </span>
                          {stageNumber >= 1 && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </div>
                      </div>

                      {stageNumber >= 2 && (
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Milestone A</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {getStageScore(2)}/{getMaxScore(2)}
                            </span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                        </div>
                      )}

                      {stageNumber >= 3 && (
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Milestone B</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">
                              {getStageScore(3)}/{getMaxScore(3)}
                            </span>
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total Skor</span>
                        <span>
                          {totalScore} / {totalMaxScore}
                        </span>
                      </div>
                      <div className="mt-2">
                        <Progress value={totalPercentage} className="h-3" />
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 text-center">
                        Progress Keseluruhan: {Math.round(totalPercentage)}%
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="visual" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Score Distribution Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribusi Skor Tahap {stageNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Visualisasi pencapaian skor dari total maksimal
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
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
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <ChartTooltip content={<ChartTooltipContent />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                    <div className="mt-4 text-center">
                      <p className="text-sm text-muted-foreground">
                        Anda berhasil mencapai{" "}
                        <span className="font-semibold text-primary">
                          {Math.round(currentStagePercentage)}%
                        </span>{" "}
                        dari total skor maksimal tahap ini.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle>Insight Performa</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="p-4 bg-primary/5 rounded-lg">
                        <h4 className="font-semibold text-primary mb-2">
                          Kekuatan:
                        </h4>
                        <p className="text-sm">
                          {currentStagePercentage >= 80
                            ? "Pemahaman konsep sangat baik dan siap untuk tahap selanjutnya."
                            : currentStagePercentage >= 60
                            ? "Memiliki dasar pemahaman yang solid dengan beberapa area untuk diperkuat."
                            : "Menunjukkan potensi namun perlu lebih banyak pembelajaran."}
                        </p>
                      </div>

                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <h4 className="font-semibold text-yellow-800 mb-2">
                          Area Pengembangan:
                        </h4>
                        <p className="text-sm text-yellow-700">
                          {currentStagePercentage < 60
                            ? "Fokus pada pemahaman konsep dasar dan praktik berkelanjutan."
                            : currentStagePercentage < 80
                            ? "Tingkatkan pengetahuan detail tentang implementasi RSPO."
                            : "Pertahankan kualitas dan siap menjadi mentor untuk petani lain."}
                        </p>
                      </div>

                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-semibold text-green-800 mb-2">
                          Rekomendasi:
                        </h4>
                        <ul className="text-sm text-green-700 space-y-1">
                          <li>
                            •{" "}
                            {currentStagePercentage >= 80
                              ? "Lanjutkan ke tahap berikutnya"
                              : "Review materi yang belum dikuasai"}
                          </li>
                          <li>
                            •{" "}
                            {currentStagePercentage >= 60
                              ? "Praktikkan konsep di lapangan"
                              : "Ikuti pelatihan tambahan"}
                          </li>
                          <li>
                            •{" "}
                            {currentStagePercentage >= 80
                              ? "Berbagi pengetahuan dengan rekan"
                              : "Konsultasi dengan mentor"}
                          </li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="navigation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Navigasi Hasil Assessment</CardTitle>
                  <p className="text-muted-foreground">
                    Akses hasil tahap lainnya dan kelola progress Anda
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Stage Navigation */}
                    {[1, 2, 3].map((stage) => (
                      <Card
                        key={stage}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          stage === stageNumber
                            ? "border-primary bg-primary/5"
                            : stage <= stageNumber
                            ? "border-green-300 bg-green-50"
                            : "border-muted bg-muted/20"
                        }`}
                      >
                        <CardContent className="p-4 text-center">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                              stage === stageNumber
                                ? "bg-primary text-primary-foreground"
                                : stage < stageNumber
                                ? "bg-green-500 text-white"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {stage < stageNumber ? (
                              <CheckCircle className="w-6 h-6" />
                            ) : stage === stageNumber ? (
                              <Trophy className="w-6 h-6" />
                            ) : (
                              <Target className="w-6 h-6" />
                            )}
                          </div>
                          <h3 className="font-semibold">Tahap {stage}</h3>
                          <p className="text-sm text-muted-foreground">
                            {stage === 1
                              ? "Eligibility"
                              : stage === 2
                              ? "Milestone A"
                              : "Milestone B"}
                          </p>
                          {stage <= stageNumber && (
                            <p className="text-sm font-medium mt-2">
                              {getStageScore(stage as 1 | 2 | 3)}/
                              {getMaxScore(stage as 1 | 2 | 3)}
                            </p>
                          )}
                          {stage <= stageNumber && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="mt-2 w-full"
                              onClick={() => navigate(`/results/${stage}`)}
                            >
                              Lihat Hasil
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {stageNumber === 3 && (
                    <Card className="border-primary bg-primary/5">
                      <CardContent className="p-4 text-center">
                        <Trophy className="w-12 h-12 text-primary mx-auto mb-3" />
                        <h3 className="font-semibold text-lg">
                          Hasil Akhir Tersedia
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Lihat analisis komprehensif dari semua tahap
                          assessment
                        </p>
                        <Button
                          onClick={() => navigate("/results/final")}
                          className="bg-primary hover:bg-primary/90"
                        >
                          Lihat Hasil Akhir
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Eligibility Check */}
          {stageNumber < 3 && !eligible && (
            <Card className="border-orange-300 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-orange-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-orange-800">
                      Catatan Penting
                    </h3>
                    <p className="text-sm text-orange-700 mt-1">
                      Skor Anda saat ini belum mencapai target optimal untuk
                      tahap ini. Namun, Anda masih dapat melanjutkan ke tahap
                      berikutnya untuk pembelajaran berkelanjutan. Disarankan
                      untuk mereview materi dan mencoba meningkatkan pemahaman.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {stageNumber < 3 ? (
                  <Button
                    onClick={handleNextStage}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:opacity-90 transition-opacity text-white"
                    size="lg"
                  >
                    <ArrowRight className="mr-2 h-5 w-5" />
                    Lanjut ke Tahap {stageNumber + 1}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextStage}
                    className="bg-gradient-to-r from-green-600 to-blue-600 hover:opacity-90 transition-opacity text-white"
                    size="lg"
                  >
                    <Trophy className="mr-2 h-5 w-5" />
                    Lihat Hasil Akhir
                  </Button>
                )}

                <Button
                  onClick={() => navigate("/results/final")}
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary/10"
                  disabled={stageNumber < 3}
                >
                  <Trophy className="mr-2 h-5 w-5" />
                  Hasil Akhir
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="lg">
                      <Home className="mr-2 h-5 w-5" />
                      Kembali ke Beranda
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin kembali ke beranda? Progress
                        Anda akan tersimpan dan dapat dilanjutkan nanti.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={handleExit}>
                        Ya, Kembali ke Beranda
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default StageResult;
