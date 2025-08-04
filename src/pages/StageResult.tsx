import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowRight, Home, Trophy, TrendingUp, AlertCircle } from 'lucide-react';
import { useAssessment } from '@/contexts/AssessmentContext';
import Layout from '@/components/Layout';

const StageResult = () => {
  const { stage } = useParams<{ stage: string }>();
  const navigate = useNavigate();
  const { getStageScore, getTotalScore, nextStage, isEligibleForNextStage } = useAssessment();
  
  const stageNumber = parseInt(stage?.replace('stage', '') || '1') as 1 | 2 | 3;
  
  const currentStageScore = getStageScore(stageNumber);
  const totalScore = getTotalScore();
  
  // Mock max scores for percentage calculation
  const getMaxScore = (stage: 1 | 2 | 3): number => {
    switch (stage) {
      case 1: return 20;
      case 2: return 30;
      case 3: return 25;
      default: return 20;
    }
  };

  const currentStagePercentage = (currentStageScore / getMaxScore(stageNumber)) * 100;
  const totalMaxScore = getMaxScore(1) + getMaxScore(2) + getMaxScore(3);
  const totalPercentage = (totalScore / totalMaxScore) * 100;

  const getStageName = () => {
    switch (stageNumber) {
      case 1: return 'Eligibility Test';
      case 2: return 'Milestone A';
      case 3: return 'Milestone B';
      default: return 'Assessment';
    }
  };

  const getPerformanceLevel = (percentage: number): { level: string; color: string; description: string } => {
    if (percentage >= 80) {
      return { 
        level: 'Excellent', 
        color: 'bg-success text-success-foreground',
        description: 'Sangat baik! Anda telah menunjukkan pemahaman yang luar biasa.'
      };
    } else if (percentage >= 60) {
      return { 
        level: 'Good', 
        color: 'bg-primary text-primary-foreground',
        description: 'Baik! Anda memiliki pemahaman yang solid dengan ruang untuk berkembang.'
      };
    } else if (percentage >= 40) {
      return { 
        level: 'Fair', 
        color: 'bg-warning text-warning-foreground',
        description: 'Cukup. Masih ada area yang perlu diperbaiki dan diperkuat.'
      };
    } else {
      return { 
        level: 'Needs Improvement', 
        color: 'bg-destructive text-destructive-foreground',
        description: 'Perlu peningkatan. Pertimbangkan untuk mempelajari lebih lanjut sebelum melanjutkan.'
      };
    }
  };

  const performance = getPerformanceLevel(currentStagePercentage);
  const eligible = stageNumber < 3 ? isEligibleForNextStage(stageNumber as 1 | 2) : true;

  const handleNextStage = () => {
    nextStage();
    if (stageNumber < 3) {
      navigate(`/assessment/stage${stageNumber + 1}`);
    } else {
      navigate('/results/final');
    }
  };

  const handleExit = () => {
    navigate('/');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <Card className="border-border shadow-green">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-primary-foreground" />
              </div>
              <CardTitle className="text-2xl">
                Hasil Tahap {stageNumber}: {getStageName()}
              </CardTitle>
            </CardHeader>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Current Stage Results */}
            <Card className="border-border shadow-subtle">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Hasil Tahap {stageNumber}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {currentStageScore} / {getMaxScore(stageNumber)}
                  </div>
                  <Badge className={performance.color}>
                    {performance.level}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Persentase</span>
                    <span>{Math.round(currentStagePercentage)}%</span>
                  </div>
                  <Progress value={currentStagePercentage} className="h-3" />
                </div>

                <p className="text-sm text-muted-foreground text-center">
                  {performance.description}
                </p>
              </CardContent>
            </Card>

            {/* Overall Progress */}
            <Card className="border-border shadow-subtle">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Progress Keseluruhan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Tahap 1</span>
                    <span className="text-sm font-medium">{getStageScore(1)}</span>
                  </div>
                  {stageNumber >= 2 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Tahap 2</span>
                      <span className="text-sm font-medium">{getStageScore(2)}</span>
                    </div>
                  )}
                  {stageNumber >= 3 && (
                    <div className="flex justify-between">
                      <span className="text-sm">Tahap 3</span>
                      <span className="text-sm font-medium">{getStageScore(3)}</span>
                    </div>
                  )}
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between font-semibold">
                    <span>Total Skor</span>
                    <span>{totalScore} / {totalMaxScore}</span>
                  </div>
                  <div className="mt-2">
                    <Progress value={totalPercentage} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Eligibility Check */}
          {stageNumber < 3 && !eligible && (
            <Card className="border-warning bg-warning/10">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-warning-foreground">Perhatian</h3>
                    <p className="text-sm text-warning-foreground/80 mt-1">
                      Skor Anda saat ini belum memenuhi syarat minimum untuk melanjutkan ke tahap berikutnya. 
                      Namun, Anda masih dapat melanjutkan untuk pembelajaran.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <Card className="border-border shadow-subtle">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {stageNumber < 3 ? (
                  <Button
                    onClick={handleNextStage}
                    className="bg-gradient-primary hover:opacity-90 transition-opacity"
                    size="lg"
                  >
                    Lanjut ke Tahap {stageNumber + 1}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={handleNextStage}
                    className="bg-gradient-primary hover:opacity-90 transition-opacity"
                    size="lg"
                  >
                    Lihat Hasil Akhir
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="lg">
                      <Home className="mr-2 h-4 w-4" />
                      Keluar
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Konfirmasi Keluar</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin keluar? Progress Anda akan tersimpan dan dapat dilanjutkan nanti.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={handleExit}>Ya, Keluar</AlertDialogAction>
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