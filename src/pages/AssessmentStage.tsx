import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  BookOpen,
  Target,
} from "lucide-react";
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
  const { user } = useAuth();
  const { assessmentData, saveAnswer } = useAssessment();
  const { toast } = useToast();

  const stageNumber = parseInt(stage?.replace("stage", "") || "1") as 1 | 2 | 3;

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [stageAnswers, setStageAnswers] = useState<Answer[]>([]);

  // Get questions for current stage
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

    // Filter questions based on role
    questions = questions.filter(
      (q) => !q.roleSpecific || q.roleSpecific === user?.role
    );

    // Filter questions based on dependencies from previous stages and current stage
    questions = questions.filter((q) => {
      if (!q.dependsOn) return true;

      // Check if dependency is satisfied from previous stages first
      let dependencyAnswer = findAnswerInPreviousStages(q.dependsOn.questionId);

      // If not found in previous stages, check current stage
      if (!dependencyAnswer) {
        dependencyAnswer = findAnswerInCurrentStage(q.dependsOn.questionId);
      }

      return dependencyAnswer?.value === q.dependsOn.requiredValue;
    });

    return questions;
  };

  const findAnswerInPreviousStages = (
    questionId: string
  ): Answer | undefined => {
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

  const questions = getAllQuestions();
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  useEffect(() => {
    // Load existing answers for this stage
    const stageKey = `stage${stageNumber}` as keyof Pick<
      typeof assessmentData,
      "stage1" | "stage2" | "stage3"
    >;
    setStageAnswers(assessmentData[stageKey]);
  }, [stageNumber, assessmentData]);

  const handleAnswerChange = (answer: Answer) => {
    const updatedAnswers = stageAnswers.filter(
      (a) => a.questionId !== answer.questionId
    );
    updatedAnswers.push(answer);
    setStageAnswers(updatedAnswers);
    saveAnswer(stageNumber, answer);
  };

  const getCurrentAnswer = (): Answer | undefined => {
    return stageAnswers.find((a) => a.questionId === currentQuestion?.id);
  };

  const canProceed = (): boolean => {
    return !!getCurrentAnswer();
  };

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
      // Stage completed, go to results
      navigate(`/results/stage${stageNumber}`);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

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
                  {currentQuestionIndex + 1} dari {questions.length}
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

          {/* Principle & Criteria Context - Minimalist Design */}
          {(() => {
            const context = getQuestionPrincipleCriteria(currentQuestion.id);
            if (!context) return null;

            return (
              <Card className="border border-border/50 bg-background/95 backdrop-blur">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    {/* Principle Section */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <Badge variant="outline" className="text-xs">
                          {context.principle.id.toUpperCase().replace("_", " ")}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-bold text-foreground">
                        {context.principle.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {context.principle.description}
                      </p>
                    </div>

                    {/* Separator */}
                    <div className="h-px bg-border" />

                    {/* Criteria Section */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-secondary" />
                        <Badge variant="secondary" className="text-xs">
                          {context.criteria.id.toUpperCase().replace("_", " ")}
                        </Badge>
                      </div>
                      <h4 className="text-sm text-foreground">
                        {context.criteria.title}
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
