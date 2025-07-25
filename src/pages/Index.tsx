import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { SkinAnalysisUpload, SkinAnalysis } from '@/components/SkinAnalysisUpload';
import { DoshaQuestionnaire, DoshaScores } from '@/components/DoshaQuestionnaire';
import { AnalysisResults } from '@/components/AnalysisResults';
import { RefreshCw, Sparkles } from "lucide-react";
import heroImage from "@/assets/ayurveda-hero.jpg";

type AppStep = 'welcome' | 'photo' | 'questionnaire' | 'results';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('welcome');
  const [skinAnalysis, setSkinAnalysis] = useState<SkinAnalysis | null>(null);
  const [doshaScores, setDoshaScores] = useState<DoshaScores | null>(null);

  const handleImageAnalyzed = (analysis: SkinAnalysis) => {
    setSkinAnalysis(analysis);
    setCurrentStep('questionnaire');
  };

  const handleQuestionnaireComplete = (scores: DoshaScores) => {
    setDoshaScores(scores);
    setCurrentStep('results');
  };

  const handleStartOver = () => {
    setSkinAnalysis(null);
    setDoshaScores(null);
    setCurrentStep('welcome');
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'welcome':
        return (
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="relative overflow-hidden rounded-2xl shadow-strong">
              <img 
                src={heroImage} 
                alt="Ayurvedic doshas illustration" 
                className="w-full h-64 sm:h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h1 className="text-3xl sm:text-5xl font-bold mb-3">
                  Ayurvedic Skin Insight
                </h1>
                <p className="text-lg sm:text-xl opacity-90">
                  Discover your dosha and get personalized skincare recommendations
                </p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-gradient-vata p-6 rounded-lg shadow-soft">
                <h3 className="text-xl font-semibold mb-2">AI Skin Analysis</h3>
                <p className="text-muted-foreground">
                  Upload your photo for advanced skin characteristic analysis using computer vision
                </p>
              </div>
              <div className="bg-gradient-pitta p-6 rounded-lg shadow-soft">
                <h3 className="text-xl font-semibold mb-2">Dosha Assessment</h3>
                <p className="text-muted-foreground">
                  Complete our comprehensive questionnaire based on classical Ayurvedic principles
                </p>
              </div>
              <div className="bg-gradient-kapha p-6 rounded-lg shadow-soft">
                <h3 className="text-xl font-semibold mb-2">Personalized Care</h3>
                <p className="text-muted-foreground">
                  Receive customized skincare recommendations blending ancient wisdom with modern science
                </p>
              </div>
            </div>

            <Button 
              variant="gradient" 
              size="lg" 
              onClick={() => setCurrentStep('photo')}
              className="text-lg px-8 py-6"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Begin Your Skin Journey
            </Button>
          </div>
        );

      case 'photo':
        return <SkinAnalysisUpload onImageAnalyzed={handleImageAnalyzed} />;

      case 'questionnaire':
        return <DoshaQuestionnaire onQuestionnaireComplete={handleQuestionnaireComplete} />;

      case 'results':
        return (
          <div className="space-y-6">
            {skinAnalysis && doshaScores && (
              <AnalysisResults 
                skinAnalysis={skinAnalysis} 
                doshaScores={doshaScores} 
              />
            )}
            <div className="text-center">
              <Button 
                variant="warm" 
                onClick={handleStartOver}
                className="mt-6"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Start New Analysis
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default Index;
