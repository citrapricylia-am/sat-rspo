import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Question, SubQuestion } from '@/data/questions';
import { Answer } from '@/contexts/AssessmentContext';
import { parseTextWithTooltips } from '@/utils/textHelpers';
import { Principle, Criteria } from '@/data/principlesCriteria';

interface AssessmentQuestionProps {
  question: Question;
  answer?: Answer;
  onAnswerChange: (answer: Answer) => void;
}

const AssessmentQuestion = ({ question, answer, onAnswerChange }: AssessmentQuestionProps) => {
  const [selectedValue, setSelectedValue] = useState(answer?.value || '');
  const [subAnswers, setSubAnswers] = useState<Answer[]>(answer?.subAnswers || []);

  const handleMainAnswerChange = (value: string) => {
    setSelectedValue(value);
    const selectedOption = question.options.find(opt => opt.value === value);
    
    if (selectedOption) {
      // Get sub questions that should be shown for this value
      const relevantSubQuestions = question.subQuestions?.filter(sq => 
        sq.triggerValue === value || (!sq.triggerValue && value === question.triggerSubQuestions)
      ) || [];
      
      // Filter existing sub answers to only keep those relevant for current selection
      const relevantSubAnswers = subAnswers.filter(sa => 
        relevantSubQuestions.some(sq => sq.id === sa.questionId)
      );
      
      setSubAnswers(relevantSubAnswers);
      
      const newAnswer: Answer = {
        questionId: question.id,
        value: value,
        score: selectedOption.score,
        subAnswers: relevantSubAnswers.length > 0 ? relevantSubAnswers : undefined
      };
      
      onAnswerChange(newAnswer);
    }
  };

  const handleSubAnswerChange = (subQuestion: SubQuestion, value: string) => {
    const selectedOption = subQuestion.options.find(opt => opt.value === value);
    if (!selectedOption) return;

    const newSubAnswer: Answer = {
      questionId: subQuestion.id,
      value: value,
      score: selectedOption.score
    };

    const updatedSubAnswers = subAnswers.filter(sa => sa.questionId !== subQuestion.id);
    updatedSubAnswers.push(newSubAnswer);
    setSubAnswers(updatedSubAnswers);

    // Update main answer with new sub answers
    const mainOption = question.options.find(opt => opt.value === selectedValue);
    if (mainOption) {
      const updatedAnswer: Answer = {
        questionId: question.id,
        value: selectedValue,
        score: mainOption.score,
        subAnswers: updatedSubAnswers
      };
      onAnswerChange(updatedAnswer);
    }
  };

  // Get sub questions that should be shown for current selection
  const visibleSubQuestions = question.subQuestions?.filter(sq => 
    sq.triggerValue === selectedValue || (!sq.triggerValue && selectedValue === question.triggerSubQuestions)
  ) || [];

  return (
    <Card className="bg-background border-border shadow-md rounded-xl overflow-hidden">
      <CardContent className="p-6 space-y-6">
        {/* Question Text */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-foreground leading-relaxed">
            {parseTextWithTooltips(question.text)}
          </h3>
        </div>

        {/* Main Options */}
        <RadioGroup value={selectedValue} onValueChange={handleMainAnswerChange} className="space-y-3">
          {question.options.map((option) => (
            <div 
              key={option.value} 
              className={`
                relative border rounded-lg p-4 cursor-pointer transition-all duration-200 hover:bg-muted/50
                ${selectedValue === option.value 
                  ? 'bg-primary/10 border-primary ring-2 ring-primary/20' 
                  : 'border-border bg-background hover:border-primary/40'
                }
              `}
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem 
                  value={option.value} 
                  id={`${question.id}-${option.value}`}
                  className="data-[state=checked]:border-primary data-[state=checked]:text-primary"
                />
                <Label 
                  htmlFor={`${question.id}-${option.value}`}
                  className="flex-1 cursor-pointer text-foreground font-medium"
                >
                  {option.label}
                </Label>
              </div>
            </div>
          ))}
        </RadioGroup>

        {/* Sub Questions */}
        {visibleSubQuestions.length > 0 && (
          <div className="mt-8 space-y-6 pl-4 border-l-2 border-primary/20">
            {visibleSubQuestions.map((subQuestion) => {
              const subAnswer = subAnswers.find(sa => sa.questionId === subQuestion.id);
              return (
                <div key={subQuestion.id} className="space-y-4">
                  <h4 className="text-base font-medium text-foreground">
                    {parseTextWithTooltips(subQuestion.text)}
                  </h4>
                  <RadioGroup 
                    value={subAnswer?.value || ''} 
                    onValueChange={(value) => handleSubAnswerChange(subQuestion, value)}
                    className="space-y-2"
                  >
                    {subQuestion.options.map((option) => (
                      <div 
                        key={option.value}
                        className={`
                          relative border rounded-lg p-3 cursor-pointer transition-all duration-200 hover:bg-muted/50
                          ${subAnswer?.value === option.value 
                            ? 'bg-primary/10 border-primary ring-2 ring-primary/20' 
                            : 'border-border bg-background hover:border-primary/40'
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem 
                            value={option.value} 
                            id={`${subQuestion.id}-${option.value}`}
                            className="data-[state=checked]:border-primary data-[state=checked]:text-primary"
                          />
                          <Label 
                            htmlFor={`${subQuestion.id}-${option.value}`}
                            className="flex-1 cursor-pointer text-foreground"
                          >
                            {option.label}
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentQuestion;