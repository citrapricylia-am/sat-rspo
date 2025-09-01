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
			// Add sub-answers scores
			if (answer.subAnswers) {
				score += answer.subAnswers.reduce((subTotal, subAnswer) => subTotal + subAnswer.score, 0);
			}
			return total + score;
		}, 0);
	};

	const getStageMaxScore = (stage: 1 | 2 | 3): number => {
		// Select question list by stage
		let questions = [] as typeof stage1Questions;
		if (stage === 1) questions = stage1Questions;
		if (stage === 2) questions = stage2Questions;
		if (stage === 3) questions = stage3Questions;

		let maxScore = 0;
		for (const q of questions) {
			// Add maximum score for main question (which is 2)
			maxScore += 2;

			// Add maximum score for ALL possible sub-questions (not just triggered ones)
			if (q.subQuestions && q.subQuestions.length > 0) {
				// Each sub-question also has maximum score of 2
				maxScore += q.subQuestions.length * 2;
			}
		}

		return maxScore;
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
		const maxScore = getStageMaxScore(stage);
		
		// For stage 1 (eligibility test), require 70% minimum
		if (stage === 1) {
			const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
			return percentage >= 70;
		}
		
		// For other stages, use different criteria if needed
		const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
		return percentage >= 60; // Lower threshold for later stages
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