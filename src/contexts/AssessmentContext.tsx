import React, { createContext, useContext, useState, ReactNode } from 'react';
import { stage1Questions, stage2Questions, stage3Questions } from '@/data/questions';

export interface Answer {
	questionId: string;
	value: string;
	score: number;
	subAnswers?: Answer[];
}

export interface AssessmentData {
	stage1: Answer[];
	stage2: Answer[];
	stage3: Answer[];
	currentStage: 1 | 2 | 3 | 'completed';
}

interface AssessmentContextType {
	assessmentData: AssessmentData;
	saveAnswer: (stage: 1 | 2 | 3, answer: Answer) => void;
	getStageScore: (stage: 1 | 2 | 3) => number;
	getStageMaxScore: (stage: 1 | 2 | 3) => number;
	getTotalScore: () => number;
	nextStage: () => void;
	resetAssessment: () => void;
	isEligibleForNextStage: (stage: 1 | 2) => boolean;
	getNextStage: (currentStage: 1 | 2 | 3 | 'completed') => 'milestone-a' | 'milestone-b' | 'final-result' | null;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const useAssessment = () => {
	const context = useContext(AssessmentContext);
	if (context === undefined) {
		throw new Error('useAssessment must be used within an AssessmentProvider');
	}
	return context;
};

interface AssessmentProviderProps {
	children: ReactNode;
}

export const AssessmentProvider: React.FC<AssessmentProviderProps> = ({ children }) => {
	const [assessmentData, setAssessmentData] = useState<AssessmentData>({
		stage1: [],
		stage2: [],
		stage3: [],
		currentStage: 1
	});

	const saveAnswer = (stage: 1 | 2 | 3, answer: Answer) => {
		setAssessmentData(prev => {
			const stageKey = `stage${stage}` as keyof Pick<AssessmentData, 'stage1' | 'stage2' | 'stage3'>;
			const existingAnswers = prev[stageKey];
			const updatedAnswers = existingAnswers.filter(a => a.questionId !== answer.questionId);
			updatedAnswers.push(answer);
			
			return {
				...prev,
				[stageKey]: updatedAnswers
			};
		});
	};

	const getStageScore = (stage: 1 | 2 | 3): number => {
		const stageKey = `stage${stage}` as keyof Pick<AssessmentData, 'stage1' | 'stage2' | 'stage3'>;
		const answers = assessmentData[stageKey];
		return answers.reduce((total, answer) => {
			let score = answer.score;
			if (answer.subAnswers) {
				score += answer.subAnswers.reduce((subTotal, subAnswer) => subTotal + subAnswer.score, 0);
			}
			return total + score;
		}, 0);
	};

	const getStageMaxScore = (stage: 1 | 2 | 3): number => {
		// Build a map of answers for quick lookup
		const stageKey = `stage${stage}` as keyof Pick<AssessmentData, 'stage1' | 'stage2' | 'stage3'>;
		const answers = assessmentData[stageKey];
		const answerMap = new Map<string, Answer>(answers.map(a => [a.questionId, a]));

		// Select question list by stage
		let questions = [] as typeof stage1Questions;
		if (stage === 1) questions = stage1Questions;
		if (stage === 2) questions = stage2Questions;
		if (stage === 3) questions = stage3Questions;

		let totalQuestionsCount = 0;
		for (const q of questions) {
			// count main question
			totalQuestionsCount += 1;

			// count relevant sub-questions based on user's answer value
			const ans = answerMap.get(q.id);
			if (!ans || !q.subQuestions || q.subQuestions.length === 0) continue;

			const relevantSubs = q.subQuestions.filter((sq) =>
				(sq.triggerValue && sq.triggerValue === ans.value) ||
				(!sq.triggerValue && q.triggerSubQuestions && ans.value === q.triggerSubQuestions)
			);
			totalQuestionsCount += relevantSubs.length;
		}

		return totalQuestionsCount * 2;
	};

	const getTotalScore = (): number => {
		return getStageScore(1) + getStageScore(2) + getStageScore(3);
	};

	const nextStage = () => {
		setAssessmentData(prev => {
			if (prev.currentStage === 1) return { ...prev, currentStage: 2 };
			if (prev.currentStage === 2) return { ...prev, currentStage: 3 };
			if (prev.currentStage === 3) return { ...prev, currentStage: 'completed' };
			return prev;
		});
	};

	const resetAssessment = () => {
		setAssessmentData({
			stage1: [],
			stage2: [],
			stage3: [],
			currentStage: 1
		});
	};

	const isEligibleForNextStage = (stage: 1 | 2): boolean => {
		const score = getStageScore(stage);
		// Basic eligibility: at least 50% score to continue
		const maxPossibleScore = stage === 1 ? 20 : 30; // Mock values (not used in UI now)
		return (score / maxPossibleScore) >= 0.5;
	};

	const getNextStage = (currentStage: 1 | 2 | 3 | 'completed') => {
		if (currentStage === 1) return 'milestone-a';
		if (currentStage === 2) return 'milestone-b';
		if (currentStage === 3) return 'final-result';
		return null;
	};

	const value = {
		assessmentData,
		saveAnswer,
		getStageScore,
		getStageMaxScore,
		getTotalScore,
		nextStage,
		resetAssessment,
		isEligibleForNextStage,
		getNextStage
	};

	return (
		<AssessmentContext.Provider value={value}>
			{children}
		</AssessmentContext.Provider>
	);
};