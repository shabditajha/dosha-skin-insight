import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ChevronRight, ChevronLeft } from "lucide-react";

interface DoshaQuestionnaireProps {
  onQuestionnaireComplete: (doshaScores: DoshaScores) => void;
}

export interface DoshaScores {
  vata: number;
  pitta: number;
  kapha: number;
}

interface Question {
  id: string;
  question: string;
  options: {
    text: string;
    vata: number;
    pitta: number;
    kapha: number;
  }[];
}

const questions: Question[] = [
  {
    id: 'skin-texture',
    question: 'How would you describe your natural skin texture?',
    options: [
      { text: 'Thin, dry, and rough', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Warm, oily, and sensitive', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Thick, oily, and smooth', vata: 0, pitta: 0, kapha: 3 },
      { text: 'Normal, not too dry or oily', vata: 1, pitta: 1, kapha: 1 },
    ],
  },
  {
    id: 'skin-issues',
    question: 'What skin concerns do you experience most often?',
    options: [
      { text: 'Dryness, fine lines, flakiness', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Acne, redness, inflammation', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Large pores, blackheads, congestion', vata: 0, pitta: 0, kapha: 3 },
      { text: 'Generally clear with minor issues', vata: 1, pitta: 1, kapha: 1 },
    ],
  },
  {
    id: 'sun-reaction',
    question: 'How does your skin react to sun exposure?',
    options: [
      { text: 'Burns easily, tans minimally', vata: 2, pitta: 1, kapha: 0 },
      { text: 'Burns easily, becomes red and inflamed', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Tans easily, rarely burns', vata: 0, pitta: 1, kapha: 2 },
      { text: 'Mixed reaction depending on season', vata: 1, pitta: 1, kapha: 1 },
    ],
  },
  {
    id: 'body-temperature',
    question: 'How do you typically feel temperature-wise?',
    options: [
      { text: 'Often cold, especially hands and feet', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Usually warm, dislike heat', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Cool to normal, comfortable in most temperatures', vata: 0, pitta: 0, kapha: 3 },
      { text: 'Variable, depends on environment', vata: 1, pitta: 1, kapha: 1 },
    ],
  },
  {
    id: 'energy-pattern',
    question: 'How would you describe your energy patterns?',
    options: [
      { text: 'Variable energy, quick bursts followed by fatigue', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Intense, focused energy that can burn out', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Steady, consistent energy throughout the day', vata: 0, pitta: 0, kapha: 3 },
      { text: 'Balanced energy with some fluctuations', vata: 1, pitta: 1, kapha: 1 },
    ],
  },
  {
    id: 'stress-response',
    question: 'How do you typically respond to stress?',
    options: [
      { text: 'Anxious, worried, scattered thinking', vata: 3, pitta: 0, kapha: 0 },
      { text: 'Irritable, angry, critical', vata: 0, pitta: 3, kapha: 0 },
      { text: 'Withdrawn, lethargic, unmotivated', vata: 0, pitta: 0, kapha: 3 },
      { text: 'Generally manage stress well', vata: 1, pitta: 1, kapha: 1 },
    ],
  },
];

export const DoshaQuestionnaire: React.FC<DoshaQuestionnaireProps> = ({ onQuestionnaireComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [selectedOption, setSelectedOption] = useState<string>('');

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = selectedOption !== '';

  const handleOptionSelect = (optionIndex: string) => {
    setSelectedOption(optionIndex);
  };

  const handleNext = () => {
    if (!canProceed) return;

    const questionId = questions[currentQuestion].id;
    const optionIndex = parseInt(selectedOption);
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));

    if (isLastQuestion) {
      // Calculate dosha scores
      const scores = { vata: 0, pitta: 0, kapha: 0 };
      
      Object.entries(answers).forEach(([questionId, optionIndex]) => {
        const question = questions.find(q => q.id === questionId);
        if (question) {
          const option = question.options[optionIndex];
          scores.vata += option.vata;
          scores.pitta += option.pitta;
          scores.kapha += option.kapha;
        }
      });

      // Add current question
      const currentOption = questions[currentQuestion].options[optionIndex];
      scores.vata += currentOption.vata;
      scores.pitta += currentOption.pitta;
      scores.kapha += currentOption.kapha;

      onQuestionnaireComplete(scores);
    } else {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption('');
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      const previousQuestionId = questions[currentQuestion - 1].id;
      const previousAnswer = answers[previousQuestionId];
      setSelectedOption(previousAnswer?.toString() || '');
    }
  };

  const currentQ = questions[currentQuestion];

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-medium">
      <CardHeader>
        <div className="flex justify-between items-center mb-2">
          <CardTitle className="text-xl">Ayurvedic Constitution Assessment</CardTitle>
          <span className="text-sm text-muted-foreground">
            {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
        <CardDescription>
          Answer these questions based on your natural tendencies throughout your life
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4 leading-relaxed">
            {currentQ.question}
          </h3>
          
          <RadioGroup value={selectedOption} onValueChange={handleOptionSelect}>
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} className="mt-1" />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="text-sm leading-relaxed cursor-pointer flex-1"
                >
                  {option.text}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button
            variant="gradient"
            onClick={handleNext}
            disabled={!canProceed}
          >
            {isLastQuestion ? 'Complete Assessment' : 'Next'}
            {!isLastQuestion && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};