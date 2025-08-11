import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

export default function StageResult() {
  const [searchParams] = useSearchParams();
  const stage = parseInt(searchParams.get("stage") || "1");
  const { assessmentData, getStageScore, isEligibleForNextStage } =
    useAssessment();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const score = getStageScore(stage as 1 | 2 | 3);
  const maxScores = { 1: 50, 2: 30, 3: 25 };
  const maxScore = maxScores[stage as keyof typeof maxScores];
  const percentage = Math.round((score / maxScore) * 100);
  const minimumPassScore = 60;
  const isPassed = percentage >= minimumPassScore;
  const percentile = Math.min(
    95,
    Math.max(5, Math.round(percentage + Math.random() * 10))
  );

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

  const getNextStageTitle = () => {
    switch (stage) {
      case 1:
        return "Milestone A";
      case 2:
        return "Milestone B";
      case 3:
        return "Final Result";
      default:
        return "Next Stage";
    }
  };

  const handleNextStage = () => {
    if (stage < 3) {
      navigate(`/assessment/stage${stage + 1}`);
    } else {
      navigate("/final-result");
    }
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

  const downloadPDF = async () => {
    try {
      const jsPDFModule = await import("jspdf");
      const doc = new jsPDFModule.default();

      // Header
      doc.setFontSize(20);
      doc.setFont(undefined, "bold");
      doc.text("SAT RSPO PADI", 20, 30);
      doc.text(`Hasil ${getStageTitle()}`, 20, 45);

      // Line separator
      doc.setLineWidth(0.5);
      doc.line(20, 55, 190, 55);

      // User Info
      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text("INFORMASI PESERTA", 20, 70);
      doc.text(`Nama: ${user?.email?.split("@")[0] || "N/A"}`, 20, 85);
      doc.text(`Email: ${user?.email || "N/A"}`, 20, 95);
      doc.text(`Nomor HP: N/A`, 20, 105);
      doc.text(`Role: Peserta`, 20, 115);

      // Line separator
      doc.line(20, 125, 190, 125);

      // Results Summary
      doc.setFontSize(14);
      doc.setFont(undefined, "bold");
      doc.text("RINGKASAN HASIL", 20, 140);

      doc.setFontSize(12);
      doc.setFont(undefined, "normal");
      doc.text(`Skor: ${score} dari ${maxScore}`, 20, 155);
      doc.text(`Persentase: ${percentage}%`, 20, 165);

      // Pass/Fail status with styling
      const status = percentage >= 70 ? "LULUS" : "TIDAK LULUS";
      doc.setFont(undefined, "bold");
      doc.text(`Status: ${status}`, 20, 175);

      // Conclusion
      doc.line(20, 190, 190, 190);
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("KESIMPULAN", 20, 205);

      doc.setFont(undefined, "normal");
      let conclusion = "";
      if (percentage >= 90) {
        conclusion = `Excellent! Anda menunjukkan pemahaman yang sangat baik pada tahap ${getStageTitle()}.`;
      } else if (percentage >= 80) {
        conclusion = `Baik! Anda memiliki pemahaman yang solid pada tahap ${getStageTitle()} dengan beberapa area untuk perbaikan.`;
      } else if (percentage >= 70) {
        conclusion = `Cukup! Anda telah lulus tahap ${getStageTitle()} dengan pemahaman dasar.`;
      } else {
        conclusion = `Belum Lulus tahap ${getStageTitle()}. Disarankan untuk mempelajari kembali materi terkait.`;
      }

      const conclusionLines = doc.splitTextToSize(conclusion, 170);
      doc.text(conclusionLines, 20, 220);

      // Footer
      const currentDate = new Date().toLocaleDateString("id-ID");
      doc.setFontSize(10);
      doc.text(`Dokumen dibuat pada: ${currentDate}`, 20, 250);

      doc.save(
        `hasil-${getStageTitle().toLowerCase().replace(/\s+/g, "-")}.pdf`
      );

      toast({
        title: "PDF Berhasil Diunduh",
        description: "File PDF hasil tes telah tersimpan di perangkat Anda",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Gagal Mengunduh PDF",
        description: "Terjadi kesalahan saat membuat file PDF",
        variant: "destructive",
      });
    }
  };

  // Auto-redirect for Stage 3 (Milestone B) after 3 seconds
  useEffect(() => {
    if (stage === 3) {
      const timer = setTimeout(() => {
        navigate("/final-result");
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

          {/* Download Button */}
          <div className="flex justify-center mb-6">
            <Button onClick={downloadPDF} size="lg" className="gap-2">
              <Download className="h-5 w-5" />
              Unduh Hasil PDF
            </Button>
          </div>

          <Tabs defaultValue="detail" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="detail">Detail</TabsTrigger>
              <TabsTrigger value="recommendations">Rekomendasi</TabsTrigger>
              <TabsTrigger value="navigation">Navigasi</TabsTrigger>
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
                        <span className="font-medium">
                          Persentase Pencapaian
                        </span>
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

            <TabsContent value="navigation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Langkah Selanjutnya</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* After Eligibility Test (Stage 1) */}
                    {stage === 1 && (
                      <div className="p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 border rounded-xl">
                        <h4 className="font-semibold text-foreground mb-3">
                          {isPassed
                            ? "Selamat! Eligibility Test Selesai"
                            : "Eligibility Test Belum Lulus"}
                        </h4>
                        <p className="text-muted-foreground mb-6">
                          {isPassed
                            ? "Anda telah berhasil menyelesaikan Eligibility Test. Pilih langkah selanjutnya:"
                            : "Anda perlu meningkatkan skor untuk melanjutkan. Silakan coba lagi atau keluar untuk mempelajari materi lebih lanjut."}
                        </p>
                        <div className="flex gap-3">
                          {isPassed && (
                            <Button
                              onClick={() => navigate("/assessment/stage2")}
                              className="bg-gradient-primary hover:opacity-90 transition-opacity"
                            >
                              Lanjut ke Milestone A
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => navigate("/")}
                          >
                            Keluar
                          </Button>
                          {!isPassed && (
                            <Button
                              onClick={() => navigate("/assessment/stage1")}
                              variant="secondary"
                            >
                              Coba Lagi
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* After Milestone A (Stage 2) */}
                    {stage === 2 && (
                      <div className="p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 border rounded-xl">
                        <h4 className="font-semibold text-foreground mb-3">
                          {isPassed
                            ? "Selamat! Milestone A Selesai"
                            : "Milestone A Belum Lulus"}
                        </h4>
                        <p className="text-muted-foreground mb-6">
                          {isPassed
                            ? "Anda telah berhasil menyelesaikan Milestone A. Pilih langkah selanjutnya:"
                            : "Anda perlu meningkatkan skor untuk melanjutkan. Silakan coba lagi atau keluar untuk mempelajari materi lebih lanjut."}
                        </p>
                        <div className="flex gap-3">
                          {isPassed && (
                            <Button
                              onClick={() => navigate("/assessment/stage3")}
                              className="bg-gradient-primary hover:opacity-90 transition-opacity"
                            >
                              Lanjut ke Milestone B
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            onClick={() => navigate("/")}
                          >
                            Keluar
                          </Button>
                          {!isPassed && (
                            <Button
                              onClick={() => navigate("/assessment/stage2")}
                              variant="secondary"
                            >
                              Coba Lagi
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    {/* After Milestone B (Stage 3) - Auto redirect to final result */}
                    {stage === 3 && (
                      <div className="p-6 bg-gradient-to-br from-primary/5 via-secondary/5 to-primary/10 border rounded-xl">
                        <h4 className="font-semibold text-foreground mb-3">
                          Assessment Selesai
                        </h4>
                        <p className="text-muted-foreground mb-6">
                          Anda telah menyelesaikan semua tahap assessment.
                          Otomatis diarahkan ke halaman hasil final...
                        </p>
                        <div className="flex gap-3">
                          <Button
                            onClick={() => navigate("/final-result")}
                            className="bg-gradient-primary hover:opacity-90 transition-opacity"
                          >
                            Lihat Hasil Final
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                          <Button variant="outline" onClick={downloadPDF}>
                            <Download className="mr-2 h-4 w-4" />
                            Unduh PDF
                          </Button>
                        </div>
                      </div>
                    )}
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
