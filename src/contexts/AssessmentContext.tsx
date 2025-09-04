import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";

export type SubAnswer = { questionId?: string; value?: any; score: number };
export type Answer = {
  questionId?: string;
  value?: any;
  score: number;
  subAnswers?: SubAnswer[];
};
export type StageIndex = 1 | 2 | 3;

export type AssessmentData = {
  stage1: Answer[];
  stage2: Answer[];
  stage3: Answer[];
};

type AssessmentContextType = {
  assessmentData: AssessmentData;
  setStageAnswers: (stage: StageIndex, answers: Answer[]) => void;
  appendStageAnswer: (stage: StageIndex, answer: Answer) => void;
  resetStage: (stage: StageIndex) => void;
  resetAll: () => void;
  getStageScore: (stage: StageIndex) => number;
  getStageMaxScore: (stage: StageIndex) => number;
  getStagePercentage: (stage: StageIndex) => number;
  isEligibleForNextStage: (stage: StageIndex) => boolean;
  getTotalScore: () => number;
};

const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined
);

export const useAssessment = () => {
  const ctx = useContext(AssessmentContext);
  if (!ctx) throw new Error("useAssessment must be used within a provider");
  return ctx;
};

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [assessmentData, setAssessmentData] = useState<AssessmentData>({
    stage1: [],
    stage2: [],
    stage3: [],
  });

  // load persisted
  useEffect(() => {
    try {
      const raw = localStorage.getItem("assessmentData");
      if (raw) {
        const parsed = JSON.parse(raw);
        setAssessmentData({
          stage1: parsed.stage1 || [],
          stage2: parsed.stage2 || [],
          stage3: parsed.stage3 || [],
        });
      }
    } catch {}
  }, []);

  // persist
  useEffect(() => {
    try {
      localStorage.setItem("assessmentData", JSON.stringify(assessmentData));
    } catch {}
  }, [assessmentData]);

  const setStageAnswers = (stage: StageIndex, answers: Answer[]) => {
    setAssessmentData((prev) => ({
      ...prev,
      [`stage${stage}`]: answers,
    }) as AssessmentData);
  };

  const appendStageAnswer = (stage: StageIndex, answer: Answer) => {
    setAssessmentData((prev) => {
      const key = `stage${stage}` as const;
      return {
        ...prev,
        [key]: [...prev[key], answer],
      } as AssessmentData;
    });
  };

  const resetStage = (stage: StageIndex) => {
    setAssessmentData((prev) => ({
      ...prev,
      [`stage${stage}`]: [],
    }) as AssessmentData);
  };

  const resetAll = () =>
    setAssessmentData({ stage1: [], stage2: [], stage3: [] });

  const getStageAnswers = (stage: StageIndex): Answer[] => {
    const key = `stage${stage}` as const;
    return assessmentData[key] || [];
  };

  const getStageScore = (stage: StageIndex): number => {
  const answers = getStageAnswers(stage);
  return answers.reduce((sum, a) => {
    const main = Number(a.score) || 0;
    const sub  = (a.subAnswers || []).reduce((s, x) => s + (Number(x.score) || 0), 0);
    return sum + main + sub;
  }, 0);
};

// MAX = 2 (main) + 2 * jumlah subAnswer yang MUNCUL (bukan skor > 0)
const getStageMaxScore = (stage: StageIndex): number => {
  const answers = getStageAnswers(stage);
  return answers.reduce((max, ans) => {
    const subCount = Array.isArray(ans.subAnswers) ? ans.subAnswers.length : 0;
    return max + 2 + (subCount * 2);
  }, 0);
};

  const getStagePercentage = (stage: StageIndex): number => {
    const score = getStageScore(stage);
    const max = getStageMaxScore(stage);
    if (max <= 0) return 0;
    return Math.round((score / max) * 100);
  };

  const isEligibleForNextStage = (stage: StageIndex): boolean => {
    const percentage = getStagePercentage(stage);
    const minimumPassScore = stage === 1 ? 70 : 60;
    return percentage >= minimumPassScore;
  };

  const getTotalScore = (): number => {
    return getStageScore(1) + getStageScore(2) + getStageScore(3);
  };

  const value = useMemo<AssessmentContextType>(
    () => ({
      assessmentData,
      setStageAnswers,
      appendStageAnswer,
      resetStage,
      resetAll,
      getStageScore,
      getStageMaxScore,
      getStagePercentage,
      isEligibleForNextStage,
      getTotalScore,
    }),
    [assessmentData]
  );

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};
