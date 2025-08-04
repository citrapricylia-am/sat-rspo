import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Home, Download, Share2, Trophy, Target, TrendingUp, Award, RefreshCw } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';
import { useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/Layout';

const FinalResult = () => {
  const navigate = useNavigate();
  const { getStageScore, getTotalScore, resetAssessment } = useAssessment();
  const { user } = useAuth();
  
  const stage1Score = getStageScore(1);
  const stage2Score = getStageScore(2);
  const stage3Score = getStageScore(3);
  const totalScore = getTotalScore();
  
  // Mock max scores
  const maxScores = { stage1: 20, stage2: 30, stage3: 25 };
  const totalMaxScore = maxScores.stage1 + maxScores.stage2 + maxScores.stage3;
  const totalPercentage = (totalScore / totalMaxScore) * 100;
  
  const getOverallPerformance = (percentage: number) => {
    if (percentage >= 85) {
      return {
        level: 'Outstanding',
        color: 'bg-success text-success-foreground',
        description: 'Luar biasa! Anda siap untuk sertifikasi RSPO dan telah menunjukkan komitmen yang kuat terhadap praktik berkelanjutan.',
        recommendations: [
          'Pertahankan standar tinggi yang telah Anda capai',
          'Berbagi pengetahuan dengan petani lain',
          'Mulai proses sertifikasi RSPO resmi',
          'Jadi mentor untuk petani lain di komunitas'
        ]
      };
    } else if (percentage >= 70) {
      return {
        level: 'Very Good',
        color: 'bg-primary text-primary-foreground',
        description: 'Sangat baik! Anda memiliki pemahaman yang solid tentang praktik berkelanjutan dengan beberapa area untuk diperbaiki.',
        recommendations: [
          'Tingkatkan area yang masih lemah',
          'Ikuti pelatihan lanjutan RSPO',
          'Implementasikan praktik berkelanjutan yang belum diterapkan',
          'Persiapkan dokumentasi untuk sertifikasi'
        ]
      };
    } else if (percentage >= 55) {
      return {
        level: 'Good',
        color: 'bg-accent text-accent-foreground',
        description: 'Baik! Anda sudah di jalur yang benar namun masih perlu peningkatan untuk mencapai standar RSPO.',
        recommendations: [
          'Fokus pada pelatihan di area yang lemah',
          'Bergabung dengan kelompok tani berkelanjutan',
          'Konsultasi dengan ahli RSPO',
          'Buat rencana perbaikan bertahap'
        ]
      };
    } else {
      return {
        level: 'Needs Development',
        color: 'bg-warning text-warning-foreground',
        description: 'Perlu pengembangan. Masih banyak area yang perlu dipelajari dan diperbaiki sebelum siap untuk sertifikasi RSPO.',
        recommendations: [
          'Ikuti pelatihan dasar RSPO secara menyeluruh',
          'Mulai implementasi praktik berkelanjutan dasar',
          'Cari mentor atau konsultan berpengalaman',
          'Ulangi assessment setelah implementasi perbaikan'
        ]
      };
    }
  };

  const performance = getOverallPerformance(totalPercentage);

  const handleRestart = () => {
    resetAssessment();
    navigate('/pretest');
  };

  const handleExit = () => {
    navigate('/');
  };

  const getStagePercentage = (score: number, maxScore: number) => {
    return (score / maxScore) * 100;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <Card className="border-border shadow-green text-center">
            <CardHeader>
              <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-primary-foreground" />
              </div>
              <CardTitle className="text-3xl mb-2">Hasil Akhir Assessment</CardTitle>
              <p className="text-muted-foreground">SAT RSPO PADI - {user?.fullName}</p>
            </CardHeader>
          </Card>

          {/* Overall Score */}
          <Card className="border-border shadow-green">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Trophy className="w-7 h-7 text-primary" />
                Skor Keseluruhan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold text-foreground mb-4">
                  {totalScore} / {totalMaxScore}
                </div>
                <Badge className={`${performance.color} text-lg px-4 py-2`}>
                  {performance.level}
                </Badge>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-lg">
                  <span>Persentase Keseluruhan</span>
                  <span className="font-semibold">{Math.round(totalPercentage)}%</span>
                </div>
                <Progress value={totalPercentage} className="h-4" />
              </div>

              <p className="text-center text-muted-foreground">
                {performance.description}
              </p>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Stage Breakdown */}
            <Card className="border-border shadow-subtle">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-primary" />
                  Detail Skor per Tahap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Stage 1 */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Tahap 1: Eligibility Test</span>
                    <span className="font-semibold">{stage1Score} / {maxScores.stage1}</span>
                  </div>
                  <Progress value={getStagePercentage(stage1Score, maxScores.stage1)} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {Math.round(getStagePercentage(stage1Score, maxScores.stage1))}% - Kelayakan dasar
                  </p>
                </div>

                {/* Stage 2 */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Tahap 2: Milestone A</span>
                    <span className="font-semibold">{stage2Score} / {maxScores.stage2}</span>
                  </div>
                  <Progress value={getStagePercentage(stage2Score, maxScores.stage2)} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {Math.round(getStagePercentage(stage2Score, maxScores.stage2))}% - Praktik pengelolaan
                  </p>
                </div>

                {/* Stage 3 */}
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Tahap 3: Milestone B</span>
                    <span className="font-semibold">{stage3Score} / {maxScores.stage3}</span>
                  </div>
                  <Progress value={getStagePercentage(stage3Score, maxScores.stage3)} className="h-2" />
                  <p className="text-sm text-muted-foreground">
                    {Math.round(getStagePercentage(stage3Score, maxScores.stage3))}% - Keberlanjutan lanjutan
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card className="border-border shadow-subtle">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  Rekomendasi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {performance.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-primary">{index + 1}</span>
                      </div>
                      <span className="text-sm">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Actions */}
          <Card className="border-border shadow-subtle">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
                  onClick={() => window.print()}
                  variant="outline"
                  size="lg"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Unduh Hasil
                </Button>

                <Button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Hasil SAT RSPO PADI',
                        text: `Saya telah menyelesaikan Self Assessment Tool RSPO dengan skor ${totalScore}/${totalMaxScore} (${Math.round(totalPercentage)}%)`,
                      });
                    }
                  }}
                  variant="outline"
                  size="lg"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Bagikan
                </Button>

                <Button
                  onClick={handleExit}
                  className="bg-gradient-primary hover:opacity-90 transition-opacity"
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