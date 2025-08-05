import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Home,
  Download,
  Share2,
  Trophy,
  Target,
  TrendingUp,
  Award,
  RefreshCw,
  CheckCircle,
  XCircle,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  Shield,
  TrendingUp as TrendingUpIcon,
  BarChart3,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useAssessment } from "@/contexts/AssessmentContext";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";

const FinalResult = () => {
  const navigate = useNavigate();
  const resultsRef = useRef<HTMLDivElement>(null);
  const { getStageScore, getTotalScore, resetAssessment } = useAssessment();
  const { user } = useAuth();

  const stage1Score = getStageScore(1);
  const stage2Score = getStageScore(2);
  const stage3Score = getStageScore(3);
  const totalScore = getTotalScore();

  // Mock max scores and categories
  const maxScores = { stage1: 20, stage2: 30, stage3: 25 };
  const totalMaxScore = maxScores.stage1 + maxScores.stage2 + maxScores.stage3;
  const totalPercentage = (totalScore / totalMaxScore) * 100;
  const minimumPassScore = 55; // 55% minimum to pass
  const isPassed = totalPercentage >= minimumPassScore;

  // Calculate percentile (mock data - in real app this would come from database)
  const percentile = Math.min(
    95,
    Math.max(5, Math.round(totalPercentage + Math.random() * 10))
  );

  // Chart configurations
  const chartConfig = {
    score: {
      label: "Skor",
      color: "hsl(var(--primary))",
    },
    passed: {
      label: "Lulus",
      color: "hsl(var(--success))",
    },
    failed: {
      label: "Tidak Lulus",
      color: "hsl(var(--destructive))",
    },
    environment: {
      label: "Lingkungan",
      color: "hsl(142, 76%, 36%)",
    },
    social: {
      label: "Sosial",
      color: "hsl(217, 91%, 60%)",
    },
    economic: {
      label: "Ekonomi",
      color: "hsl(262, 83%, 58%)",
    },
  };

  // Score distribution data
  const scoreDistributionData = [
    {
      name: "Skor Anda",
      value: totalScore,
      color: "hsl(var(--primary))",
    },
    {
      name: "Sisa Skor",
      value: totalMaxScore - totalScore,
      color: "hsl(var(--muted))",
    },
  ];

  // Category analysis data (mock - should come from actual question categorization)
  const categoryData = [
    {
      category: "Lingkungan",
      score: Math.round(stage1Score * 0.7),
      maxScore: Math.round(maxScores.stage1 * 0.7),
      percentage: Math.round(
        ((stage1Score * 0.7) / (maxScores.stage1 * 0.7)) * 100
      ),
    },
    {
      category: "Sosial",
      score: Math.round(stage2Score * 0.8),
      maxScore: Math.round(maxScores.stage2 * 0.8),
      percentage: Math.round(
        ((stage2Score * 0.8) / (maxScores.stage2 * 0.8)) * 100
      ),
    },
    {
      category: "Ekonomi",
      score: Math.round(stage3Score * 0.9),
      maxScore: Math.round(maxScores.stage3 * 0.9),
      percentage: Math.round(
        ((stage3Score * 0.9) / (maxScores.stage3 * 0.9)) * 100
      ),
    },
  ];

  const getOverallPerformance = (percentage: number) => {
    if (percentage >= 85) {
      return {
        level: "Outstanding",
        color: "bg-green-100 text-green-800 border-green-300",
        description:
          "Luar biasa! Anda siap untuk sertifikasi RSPO dan telah menunjukkan komitmen yang kuat terhadap praktik berkelanjutan.",
        recommendations: [
          "Pertahankan standar tinggi yang telah Anda capai",
          "Berbagi pengetahuan dengan petani lain",
          "Mulai proses sertifikasi RSPO resmi",
          "Jadi mentor untuk petani lain di komunitas",
        ],
      };
    } else if (percentage >= 70) {
      return {
        level: "Very Good",
        color: "bg-blue-100 text-blue-800 border-blue-300",
        description:
          "Sangat baik! Anda memiliki pemahaman yang solid tentang praktik berkelanjutan dengan beberapa area untuk diperbaiki.",
        recommendations: [
          "Tingkatkan area yang masih lemah",
          "Ikuti pelatihan lanjutan RSPO",
          "Implementasikan praktik berkelanjutan yang belum diterapkan",
          "Persiapkan dokumentasi untuk sertifikasi",
        ],
      };
    } else if (percentage >= 55) {
      return {
        level: "Good",
        color: "bg-yellow-100 text-yellow-800 border-yellow-300",
        description:
          "Baik! Anda sudah di jalur yang benar namun masih perlu peningkatan untuk mencapai standar RSPO.",
        recommendations: [
          "Fokus pada pelatihan di area yang lemah",
          "Bergabung dengan kelompok tani berkelanjutan",
          "Konsultasi dengan ahli RSPO",
          "Buat rencana perbaikan bertahap",
        ],
      };
    } else {
      return {
        level: "Needs Development",
        color: "bg-red-100 text-red-800 border-red-300",
        description:
          "Perlu pengembangan. Masih banyak area yang perlu dipelajari dan diperbaiki sebelum siap untuk sertifikasi RSPO.",
        recommendations: [
          "Ikuti pelatihan dasar RSPO secara menyeluruh",
          "Mulai implementasi praktik berkelanjutan dasar",
          "Cari mentor atau konsultan berpengalaman",
          "Ulangi assessment setelah implementasi perbaikan",
        ],
      };
    }
  };

  const performance = getOverallPerformance(totalPercentage);

  const handleDownloadPDF = async () => {
    if (!resultsRef.current) return;

    try {
      // Create a new div for PDF content
      const pdfContent = document.createElement("div");
      pdfContent.style.width = "800px";
      pdfContent.style.padding = "20px";
      pdfContent.style.backgroundColor = "white";
      pdfContent.style.fontFamily = "Arial, sans-serif";

      // Add content to PDF
      pdfContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #16a34a; margin-bottom: 10px;">SAT RSPO PADI - Hasil Assessment</h1>
          <p style="color: #666; font-size: 14px;">Tanggal: ${new Date().toLocaleDateString(
            "id-ID"
          )}</p>
        </div>
        
        <div style="margin-bottom: 30px; padding: 20px; border: 2px solid #16a34a; border-radius: 8px;">
          <h2 style="color: #16a34a; margin-bottom: 15px;">Informasi Peserta</h2>
          <p><strong>Nama:</strong> ${user?.fullName || "N/A"}</p>
          <p><strong>Email:</strong> ${user?.email || "N/A"}</p>
          <p><strong>No. HP:</strong> ${user?.phone || "N/A"}</p>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #16a34a; margin-bottom: 15px;">Hasil Keseluruhan</h2>
          <div style="text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px;">
            <div style="font-size: 36px; font-weight: bold; color: #333; margin-bottom: 10px;">
              ${totalScore} / ${totalMaxScore}
            </div>
            <div style="font-size: 18px; color: #666; margin-bottom: 10px;">
              Persentase: ${Math.round(totalPercentage)}%
            </div>
            <div style="padding: 8px 16px; background: ${
              isPassed ? "#dcfce7" : "#fef2f2"
            }; 
                        color: ${
                          isPassed ? "#16a34a" : "#dc2626"
                        }; border-radius: 20px; display: inline-block;">
              ${isPassed ? "LULUS" : "TIDAK LULUS"}
            </div>
            <p style="margin-top: 15px; color: #666;">
              Standar minimum: ${minimumPassScore}% | Persentil: ${percentile}%
            </p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #16a34a; margin-bottom: 15px;">Detail Skor per Tahap</h2>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <p><strong>Eligibility Test:</strong> ${stage1Score}/${
        maxScores.stage1
      } (${Math.round((stage1Score / maxScores.stage1) * 100)}%)</p>
            <p><strong>Milestone A:</strong> ${stage2Score}/${
        maxScores.stage2
      } (${Math.round((stage2Score / maxScores.stage2) * 100)}%)</p>
            <p><strong>Milestone B:</strong> ${stage3Score}/${
        maxScores.stage3
      } (${Math.round((stage3Score / maxScores.stage3) * 100)}%)</p>
          </div>
        </div>

        <div style="margin-bottom: 30px;">
          <h2 style="color: #16a34a; margin-bottom: 15px;">Analisis per Kategori</h2>
          <p style="color: #666; margin-bottom: 15px;">
            Grafik menunjukkan performa Anda di berbagai kategori penilaian RSPO:
          </p>
          ${categoryData
            .map(
              (cat) => `
            <div style="margin-bottom: 10px; padding: 10px; background: #f8f9fa; border-radius: 4px;">
              <strong>${cat.category}:</strong> ${cat.score}/${cat.maxScore} (${
                cat.percentage
              }%)
              ${
                cat.percentage >= 80
                  ? " - Sangat Baik"
                  : cat.percentage >= 60
                  ? " - Baik"
                  : " - Perlu Peningkatan"
              }
            </div>
          `
            )
            .join("")}
        </div>

        <div>
          <h2 style="color: #16a34a; margin-bottom: 15px;">Rekomendasi</h2>
          <p style="margin-bottom: 15px; color: #666;">${
            performance.description
          }</p>
          <ul style="color: #666;">
            ${performance.recommendations
              .map((rec) => `<li style="margin-bottom: 8px;">${rec}</li>`)
              .join("")}
          </ul>
        </div>
      `;

      // Temporarily add to DOM for rendering
      pdfContent.style.position = "absolute";
      pdfContent.style.left = "-9999px";
      document.body.appendChild(pdfContent);

      // Convert to canvas
      const canvas = await html2canvas(pdfContent, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      // Remove from DOM
      document.body.removeChild(pdfContent);

      // Create PDF
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(
        `SAT-RSPO-PADI-Hasil-${
          user?.fullName || "Assessment"
        }-${new Date().toLocaleDateString("id-ID")}.pdf`
      );
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Gagal mengunduh PDF. Silakan coba lagi.");
    }
  };

  const handleRestart = () => {
    resetAssessment();
    navigate("/pretest");
  };

  const handleExit = () => {
    navigate("/");
  };

  const getStagePercentage = (score: number, maxScore: number) => {
    return (score / maxScore) * 100;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8" ref={resultsRef}>
        <div className="max-w-7xl mx-auto space-y-6">
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

          {/* Main Score Cards - Top Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Score Card */}
            <Card className="text-center border-2 border-primary/10">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg font-medium text-muted-foreground">
                  Skor Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {totalScore}
                </div>
                <div className="text-muted-foreground">
                  dari {totalMaxScore}
                </div>
                <div className="mt-3">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    Excellent
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
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <CardTitle className="text-lg font-medium text-muted-foreground">
                  Tingkat Kelulusan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold mb-2 ${
                    isPassed ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {isPassed ? "LULUS" : "TIDAK LULUS"}
                </div>
                <div className="text-muted-foreground">
                  Standar minimum: {minimumPassScore}
                </div>
              </CardContent>
            </Card>

            {/* Percentile Card */}
            <Card className="text-center border-2 border-primary/10">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <TrendingUpIcon className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-lg font-medium text-muted-foreground">
                  Persentil
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600 mb-2">
                  {percentile}%
                </div>
                <div className="text-muted-foreground">
                  Lebih baik dari peserta lain
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Score Distribution Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  Distribusi Skor
                </CardTitle>
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
                <div className="mt-4 flex justify-center">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Benar</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Category Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Analisis per Kategori
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categoryData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis domain={[0, 100]} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar
                        dataKey="percentage"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="breakdown" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="breakdown">Detail Skor</TabsTrigger>
              <TabsTrigger value="recommendations">Rekomendasi</TabsTrigger>
              <TabsTrigger value="navigation">Navigasi</TabsTrigger>
            </TabsList>

            <TabsContent value="breakdown" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Stage Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="w-6 h-6 text-primary" />
                      Detail Skor per Tahap
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Stage 1 */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Eligibility Test</span>
                        <span className="font-semibold">
                          {stage1Score} / {maxScores.stage1}
                        </span>
                      </div>
                      <Progress
                        value={getStagePercentage(
                          stage1Score,
                          maxScores.stage1
                        )}
                        className="h-3"
                      />
                      <p className="text-sm text-muted-foreground">
                        {Math.round(
                          getStagePercentage(stage1Score, maxScores.stage1)
                        )}
                        % - Kelayakan dasar untuk sertifikasi
                      </p>
                    </div>

                    {/* Stage 2 */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Milestone A</span>
                        <span className="font-semibold">
                          {stage2Score} / {maxScores.stage2}
                        </span>
                      </div>
                      <Progress
                        value={getStagePercentage(
                          stage2Score,
                          maxScores.stage2
                        )}
                        className="h-3"
                      />
                      <p className="text-sm text-muted-foreground">
                        {Math.round(
                          getStagePercentage(stage2Score, maxScores.stage2)
                        )}
                        % - Praktik pengelolaan berkelanjutan
                      </p>
                    </div>

                    {/* Stage 3 */}
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Milestone B</span>
                        <span className="font-semibold">
                          {stage3Score} / {maxScores.stage3}
                        </span>
                      </div>
                      <Progress
                        value={getStagePercentage(
                          stage3Score,
                          maxScores.stage3
                        )}
                        className="h-3"
                      />
                      <p className="text-sm text-muted-foreground">
                        {Math.round(
                          getStagePercentage(stage3Score, maxScores.stage3)
                        )}
                        % - Implementasi keberlanjutan lanjutan
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Category Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-6 h-6 text-primary" />
                      Analisis per Kategori
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categoryData.map((category, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {category.category}
                          </span>
                          <span className="font-semibold">
                            {category.score} / {category.maxScore}
                          </span>
                        </div>
                        <Progress value={category.percentage} className="h-2" />
                        <p className="text-sm text-muted-foreground">
                          {category.percentage}% -{" "}
                          {category.percentage >= 80
                            ? "Sangat Baik"
                            : category.percentage >= 60
                            ? "Baik"
                            : "Perlu Peningkatan"}
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="charts" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Score Distribution Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Distribusi Skor</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Visualisasi pencapaian skor Anda dari total maksimal
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
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Category Analysis Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Analisis per Kategori</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Perbandingan performa di berbagai aspek penilaian RSPO
                    </p>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={categoryData}>
                          <XAxis dataKey="category" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar
                            dataKey="percentage"
                            fill="hsl(var(--primary))"
                            radius={[4, 4, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Chart Explanations */}
              <Card>
                <CardHeader>
                  <CardTitle>Penjelasan Grafik</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Distribusi Skor:</h4>
                    <p className="text-sm text-muted-foreground">
                      Grafik donut menunjukkan proporsi skor yang Anda peroleh (
                      {totalScore}) dari total maksimal ({totalMaxScore}). Area
                      hijau menunjukkan pencapaian Anda, sedangkan area abu-abu
                      adalah skor yang belum tercapai.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">
                      Analisis per Kategori:
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Grafik batang menampilkan persentase pencapaian di setiap
                      kategori RSPO.
                      {categoryData.find((c) => c.percentage >= 80)
                        ? ` Kategori ${
                            categoryData.find((c) => c.percentage >= 80)
                              ?.category
                          } menunjukkan performa terbaik.`
                        : " Semua kategori memerlukan peningkatan untuk mencapai standar optimal."}
                      {categoryData.find((c) => c.percentage < 60)
                        ? ` Fokus perbaikan diperlukan pada kategori ${
                            categoryData.find((c) => c.percentage < 60)
                              ?.category
                          }.`
                        : ""}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recommendations" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-primary" />
                    Rekomendasi Pengembangan
                  </CardTitle>
                  <p className="text-muted-foreground">
                    {performance.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {performance.recommendations.map(
                      (recommendation, index) => (
                        <div
                          key={index}
                          className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-sm font-semibold text-primary-foreground">
                              {index + 1}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">{recommendation}</p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={handleDownloadPDF}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Unduh Hasil PDF
                </Button>

                <Button
                  onClick={handleRestart}
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  <RefreshCw className="mr-2 h-5 w-5" />
                  Ulangi Assessment
                </Button>

                <Button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: "Hasil SAT RSPO PADI",
                        text: `Saya telah menyelesaikan Self Assessment Tool RSPO dengan skor ${totalScore}/${totalMaxScore} (${Math.round(
                          totalPercentage
                        )}%)`,
                      });
                    }
                  }}
                  variant="outline"
                  size="lg"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Bagikan Hasil
                </Button>

                <Button
                  onClick={handleExit}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:opacity-90 transition-opacity text-white"
                  size="lg"
                >
                  <Home className="mr-2 h-5 w-5" />
                  Kembali ke Beranda
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default FinalResult;
