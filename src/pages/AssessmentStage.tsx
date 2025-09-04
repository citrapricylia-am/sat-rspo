import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Target, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useAssessment, Answer } from "@/contexts/AssessmentContext";
import {
  stage1Questions,
  stage2Questions,
  stage3Questions,
  Question,
} from "@/data/questions";
import { getQuestionPrincipleCriteria } from "@/data/principlesCriteria";
import AssessmentQuestion from "@/components/AssessmentQuestion";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";

const AssessmentStage = () => {
  const { stage } = useParams<{ stage: string }>();
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
const role = profile?.role; // "petani" | "manajer"
  const { assessmentData, setStageAnswers } = useAssessment(); // ← gunakan setStageAnswers, bukan saveAnswer
  const { toast } = useToast();

  const stageNumber = parseInt(stage?.replace("stage", "") || "1") as 1 | 2 | 3;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [stageAnswers, setStageAnswersLocal] = useState<Answer[]>([]);

  // Ambil daftar pertanyaan untuk stage ini (dengan filter role + dependsOn)
  const getAllQuestions = (): Question[] => {
    let questions: Question[] = [];

    switch (stageNumber) {
      case 1:
        questions = stage1Questions;
        break;
      case 2:
        questions = stage2Questions;
        break;
      case 3:
        questions = stage3Questions;
        break;
    }

    // Filter berdasarkan role
    questions = questions.filter(
 (q) => !q.roleSpecific || q.roleSpecific === profile?.role
 );

    // Filter berdasarkan dependsOn (lihat dari stage sebelumnya & jawaban yang sedang diisi)
    questions = questions.filter((q) => {
      if (!q.dependsOn) return true;

      // Cek di stage sebelumnya (dari context)
      let dependencyAnswer = findAnswerInPreviousStages(q.dependsOn.questionId);

      // Jika belum ketemu, cek di jawaban stage saat ini (local state)
      if (!dependencyAnswer) {
        dependencyAnswer = findAnswerInCurrentStage(q.dependsOn.questionId);
      }

      return dependencyAnswer?.value === q.dependsOn.requiredValue;
    });

    return questions;
  };

  const findAnswerInPreviousStages = (questionId: string): Answer | undefined => {
    const allAnswers = [
      ...assessmentData.stage1,
      ...assessmentData.stage2,
      ...assessmentData.stage3,
    ];
    return allAnswers.find((answer) => answer.questionId === questionId);
  };

  const findAnswerInCurrentStage = (questionId: string): Answer | undefined => {
    return stageAnswers.find((answer) => answer.questionId === questionId);
  };
  
// ambil soal sesuai stage
const baseQuestions = useMemo(() => {
  if (stageNumber === 1) return stage1Questions;
  if (stageNumber === 2) return stage2Questions;
  return stage3Questions;
}, [stageNumber]);

// filter berdasarkan role
const questions = useMemo(() => {
  return (baseQuestions || []).filter((q: any) => {
    if (!q) return false;
    if (q.roleSpecific) return q.roleSpecific === role;     // khusus 1 role
    if (Array.isArray(q.roles)) return q.roles.includes(role); // multi-role
    if (q.role) return q.role === role;                     // properti tunggal
    return true; // soal umum → tampil untuk semua
  });
}, [baseQuestions, role]);


// clamp index kalau jumlah pertanyaan berubah
useEffect(() => {
  if (currentQuestionIndex > questions.length - 1) {
    setCurrentQuestionIndex(Math.max(0, questions.length - 1));
  }
}, [questions.length, currentQuestionIndex]);

// current question & progress
const currentQuestion = questions[currentQuestionIndex];
const progress =
  questions.length > 0
    ? ((currentQuestionIndex + 1) / questions.length) * 100
    : 0;

// load jawaban yang sudah tersimpan untuk stage ini
useEffect(() => {
  const stageKey = `stage${stageNumber}` as keyof Pick<
    typeof assessmentData,
    "stage1" | "stage2" | "stage3"
  >;
  setStageAnswersLocal(assessmentData[stageKey] || []);
}, [stageNumber, assessmentData]);

// guard render (hindari render sebelum role siap)
if (authLoading) return null;
if (!profile) return null;

  // Saat user mengubah jawaban pada pertanyaan saat ini
  const handleAnswerChange = (answer: Answer) => {
    const updated = stageAnswers.filter((a) => a.questionId !== answer.questionId);
    updated.push({
      ...answer,
      // pastikan skor bertipe number (menghindari "2" string)
      score: Number(answer.score) || 0,
      subAnswers: Array.isArray(answer.subAnswers)
        ? answer.subAnswers.map((sa) => ({ ...sa, score: Number(sa.score) || 0 }))
        : [],
    });

    // Simpan ke local state (untuk rendering & dependsOn) …
    setStageAnswersLocal(updated);
    // …dan simpan ke context (kunci agar StageResult tidak 0/0)
    setStageAnswers(stageNumber, updated);
  };

  const getCurrentAnswer = (): Answer | undefined => {
    return currentQuestion ? stageAnswers.find((a) => a.questionId === currentQuestion.id) : undefined;
  };

  const canProceed = (): boolean => !!getCurrentAnswer();

  const handleNext = () => {
    if (!canProceed()) {
      toast({
        title: "Jawaban Diperlukan",
        description: "Silakan jawab pertanyaan sebelum melanjutkan",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Pastikan context sudah terisi penuh sebelum pindah
      setStageAnswers(stageNumber, stageAnswers);
      navigate(`/results/stage${stageNumber}`);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  // Jika tidak ada pertanyaan (setelah filter), tampilkan info & tombol kembali
  if (!currentQuestion) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="text-center py-8">
              <p>Tidak ada pertanyaan tersedia untuk tahap ini.</p>
              <Button onClick={() => navigate("/pretest")} className="mt-4">
                Kembali ke Pretest
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Header */}
          <Card className="border-border shadow-subtle">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="text-2xl">
                  Tahap {stageNumber}: {getStageName()}
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {questions.length > 0 ? currentQuestionIndex + 1 : 0} dari {questions.length}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </CardHeader>
          </Card>

          {/* Principle & Criteria Context */}
          {(() => {
            const context = getQuestionPrincipleCriteria(currentQuestion.id, {
role: profile?.role as "petani" | "manajer" | undefined,
stage: stageNumber,
});
            if (!context) return null;

            return (
              <Card className="border border-border/50 bg-background/95 backdrop-blur">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <h3 className="text-lg font-bold text-foreground">
                        {context.principle.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {context.principle.description}
                      </p>
                    </div>
                    <div className="h-px bg-border" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-secondary" />
                      </div>
                      <h4 className="text-sm text-foreground">
                        {context.criteria.displayTitle || context.criteria.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {context.criteria.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })()}

          {/* Question */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 rounded-lg -z-10" />
            <AssessmentQuestion
              question={currentQuestion}
              answer={getCurrentAnswer()}
              onAnswerChange={handleAnswerChange}
            />
          </div>

          {/* Navigation */}
          <Card className="border-border shadow-subtle">
            <CardContent className="pt-6">
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Sebelumnya
                </Button>

                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-gradient-primary hover:opacity-90 transition-opacity"
                >
                  {currentQuestionIndex === questions.length - 1 ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Selesai
                    </>
                  ) : (
                    <>
                      Selanjutnya
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AssessmentStage;
