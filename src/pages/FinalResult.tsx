import React from "react";
import { useNavigate } from "react-router-dom";
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
  TrendingUp,
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

export default function FinalResult() {
  const { assessmentData, getTotalScore, resetAssessment, getStageMaxScore } = useAssessment();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const stage1Score = assessmentData.stage1.reduce(
    (sum, answer) => sum + answer.score + (answer.subAnswers?.reduce((subSum, sub) => subSum + sub.score, 0) || 0),
    0
  );
  const stage2Score = assessmentData.stage2.reduce(
    (sum, answer) => sum + answer.score + (answer.subAnswers?.reduce((subSum, sub) => subSum + sub.score, 0) || 0),
    0
  );
  const stage3Score = assessmentData.stage3.reduce(
    (sum, answer) => sum + answer.score + (answer.subAnswers?.reduce((subSum, sub) => subSum + sub.score, 0) || 0),
    0
  );
  const totalScore = getTotalScore();

  // Use dynamic max scores instead of hard-coded values
  const maxScores = { 
    stage1: getStageMaxScore(1), 
    stage2: getStageMaxScore(2), 
    stage3: getStageMaxScore(3) 
  };
  const totalMaxScore = maxScores.stage1 + maxScores.stage2 + maxScores.stage3;
  const totalPercentage = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 100) : 0;
  const minimumPassScore = 60;
  const isPassed = totalPercentage >= minimumPassScore;
  const percentile = Math.min(
    95,
    Math.max(5, Math.round(totalPercentage + Math.random() * 10))
  );

  const scoreDistributionData = [
    { name: "Skor Anda", value: totalScore, fill: "#22c55e" },
    { name: "Sisa Skor", value: totalMaxScore - totalScore, fill: "#e5e7eb" },
  ];

  const categoryData = [
    {
      category: "Eligibility",
      score: stage1Score,
      maxScore: maxScores.stage1,
      percentage: Math.round((stage1Score / maxScores.stage1) * 100),
    },
    {
      category: "Milestone A",
      score: stage2Score,
      maxScore: maxScores.stage2,
      percentage: Math.round((stage2Score / maxScores.stage2) * 100),
    },
    {
      category: "Milestone B",
      score: stage3Score,
      maxScore: maxScores.stage3,
      percentage: Math.round((stage3Score / maxScores.stage3) * 100),
    },
  ];

  const getRecommendations = () => {
    if (totalPercentage >= 85) {
      return [
        "Pertahankan standar tinggi yang telah Anda capai",
        "Berbagi pengetahuan dengan petani lain",
        "Mulai proses sertifikasi RSPO resmi",
        "Jadi mentor untuk petani lain di komunitas",
      ];
    } else if (totalPercentage >= 70) {
      return [
        "Tingkatkan area yang masih lemah",
        "Ikuti pelatihan lanjutan RSPO",
        "Implementasikan praktik berkelanjutan yang belum diterapkan",
        "Persiapkan dokumentasi untuk sertifikasi",
      ];
    } else if (totalPercentage >= 55) {
      return [
        "Fokus pada pelatihan di area yang lemah",
        "Bergabung dengan kelompok tani berkelanjutan",
        "Konsultasi dengan ahli RSPO",
        "Buat rencana perbaikan bertahap",
      ];
    } else {
      return [
        "Ikuti pelatihan dasar RSPO secara menyeluruh",
        "Mulai implementasi praktik berkelanjutan dasar",
        "Cari mentor atau konsultan berpengalaman",
        "Ulangi assessment setelah implementasi perbaikan",
      ];
    }
  };

  const getAllQuestions = () => {
    return [...stage1Questions, ...stage2Questions, ...stage3Questions];
  };

  const getAllAnswers = () => {
    const allAnswers: { [key: string]: Answer } = {};
    [
      ...assessmentData.stage1,
      ...assessmentData.stage2,
      ...assessmentData.stage3,
    ].forEach((answer) => {
      allAnswers[answer.questionId] = answer;
    });
    return allAnswers;
  };

  const downloadPDF = async () => {
    try {
      const jsPDFModule = await import("jspdf");
      const doc = new jsPDFModule.default();

      // Header
      doc.setFontSize(20);
      doc.setFont(undefined, "bold");
      doc.text("SAT RSPO PADI", 20, 30);
      doc.text("Hasil Tes Akhir", 20, 45);

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
      doc.text(`Total Skor: ${totalScore} dari ${totalMaxScore}`, 20, 155);
      doc.text(`Persentase: ${totalPercentage}%`, 20, 165);

      // Pass/Fail status with styling
      const status = totalPercentage >= 70 ? "LULUS" : "TIDAK LULUS";
      doc.setFont(undefined, "bold");
      doc.text(`Status: ${status}`, 20, 175);

      // Stage breakdown
      doc.setFont(undefined, "normal");
      doc.text("Breakdown per Tahap:", 20, 190);
      doc.text(
        `• Eligibility Test: ${stage1Score}/${maxScores.stage1} (${Math.round(
          (stage1Score / maxScores.stage1) * 100
        )}%)`,
        25,
        200
      );
      doc.text(
        `• Milestone A: ${stage2Score}/${maxScores.stage2} (${Math.round(
          (stage2Score / maxScores.stage2) * 100
        )}%)`,
        25,
        210
      );
      doc.text(
        `• Milestone B: ${stage3Score}/${maxScores.stage3} (${Math.round(
          (stage3Score / maxScores.stage3) * 100
        )}%)`,
        25,
        220
      );

      // Conclusion
      doc.line(20, 235, 190, 235);
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("KESIMPULAN", 20, 250);

      doc.setFont(undefined, "normal");
      let conclusion = "";
      if (totalPercentage >= 90) {
        conclusion =
          "Excellent! Anda menunjukkan pemahaman yang sangat baik tentang standar RSPO.";
      } else if (totalPercentage >= 80) {
        conclusion =
          "Baik! Anda memiliki pemahaman yang solid tentang standar RSPO dengan beberapa area untuk perbaikan.";
      } else if (totalPercentage >= 70) {
        conclusion =
          "Cukup! Anda telah lulus dengan pemahaman dasar. Disarankan untuk memperdalam pengetahuan di beberapa area.";
      } else {
        conclusion =
          "Belum Lulus. Disarankan untuk mempelajari kembali materi dan mengulang tes setelah persiapan lebih matang.";
      }

      const conclusionLines = doc.splitTextToSize(conclusion, 170);
      doc.text(conclusionLines, 20, 265);

      // Footer
      const currentDate = new Date().toLocaleDateString("id-ID");
      doc.setFontSize(10);
      doc.text(`Dokumen dibuat pada: ${currentDate}`, 20, 290);

      doc.save("hasil-tes-sat-rspo.pdf");

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
              Hasil Tes SAT RSPO PADI
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
                  {totalScore}
                </div>
                <div className="text-muted-foreground">
                  dari {totalMaxScore}
                </div>
                <div className="mt-3">
                  <Badge
                    variant={
                      totalPercentage >= 85
                        ? "default"
                        : totalPercentage >= 70
                        ? "secondary"
                        : "outline"
                    }
                  >
                    {totalPercentage}%
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
                  <TrendingUp className="h-6 w-6 text-primary" />
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
                  Analisis Per Kategori
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="percentage" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
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
                  <CardTitle>Detail Skor per Tahap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categoryData.map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{category.category}</h4>
                          <p className="text-sm text-muted-foreground">
                            {category.score} dari {category.maxScore} poin
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {category.percentage}%
                          </div>
                          <Progress
                            value={category.percentage}
                            className="w-20"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Rekomendasi Pengembangan</CardTitle>
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

            <TabsContent value="navigation" className="space-y-4">
              <div className="grid gap-4">
                <Button
                  variant="outline"
                  onClick={() => navigate("/stage-result?stage=1")}
                  className="w-full justify-start"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Lihat Hasil Eligibility Test
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/stage-result?stage=2")}
                  className="w-full justify-start"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Lihat Hasil Milestone A
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/stage-result?stage=3")}
                  className="w-full justify-start"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  Lihat Hasil Milestone B
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    resetAssessment();
                    navigate("/");
                  }}
                  className="w-full justify-start"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Mulai Tes Baru
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
