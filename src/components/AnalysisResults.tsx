import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Leaf, Flame, Droplets, Star, BookOpen } from "lucide-react";
import { SkinAnalysis } from './SkinAnalysisUpload';
import { DoshaScores } from './DoshaQuestionnaire';

interface AnalysisResultsProps {
  skinAnalysis: SkinAnalysis;
  doshaScores: DoshaScores;
}

interface DoshaInfo {
  name: string;
  element: string;
  icon: React.ComponentType<any>;
  description: string;
  skinCharacteristics: string[];
  recommendations: string[];
  gradient: string;
}

const doshaInfo: Record<string, DoshaInfo> = {
  vata: {
    name: 'Vata',
    element: 'Air & Space',
    icon: Leaf,
    description: 'Governed by movement, creativity, and change. Vata skin tends to be dry, thin, and delicate.',
    skinCharacteristics: [
      'Dry and thin texture',
      'Fine pores',
      'Prone to premature aging',
      'Cold to touch',
      'May have rough patches'
    ],
    recommendations: [
      'Rich, nourishing moisturizers',
      'Oil-based cleansers',
      'Gentle, hydrating face masks',
      'Avoid harsh exfoliants',
      'Use warm oils like sesame or almond'
    ],
    gradient: 'bg-gradient-vata'
  },
  pitta: {
    name: 'Pitta',
    element: 'Fire & Water',
    icon: Flame,
    description: 'Governed by transformation and metabolism. Pitta skin is warm, sensitive, and prone to inflammation.',
    skinCharacteristics: [
      'Warm and soft texture',
      'Medium thickness',
      'Prone to redness and inflammation',
      'May have freckles or moles',
      'Sensitive to sun exposure'
    ],
    recommendations: [
      'Cooling, anti-inflammatory ingredients',
      'Gentle, non-comedogenic products',
      'Aloe vera and rose-based formulations',
      'Avoid heating spices in skincare',
      'Use coconut or sunflower oil'
    ],
    gradient: 'bg-gradient-pitta'
  },
  kapha: {
    name: 'Kapha',
    element: 'Earth & Water',
    icon: Droplets,
    description: 'Governed by structure and lubrication. Kapha skin is thick, oily, and resilient.',
    skinCharacteristics: [
      'Thick and oily texture',
      'Large pores',
      'Prone to congestion',
      'Slow to age',
      'Cool and moist to touch'
    ],
    recommendations: [
      'Light, oil-free moisturizers',
      'Clay masks and exfoliants',
      'Astringent herbs like neem',
      'Steam treatments',
      'Use jojoba or grapeseed oil sparingly'
    ],
    gradient: 'bg-gradient-kapha'
  }
};

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  skinAnalysis,
  doshaScores
}) => {
  // Calculate dominant dosha
  const totalScore = doshaScores.vata + doshaScores.pitta + doshaScores.kapha;
  const percentages = {
    vata: (doshaScores.vata / totalScore) * 100,
    pitta: (doshaScores.pitta / totalScore) * 100,
    kapha: (doshaScores.kapha / totalScore) * 100
  };

  const dominantDosha = Object.entries(percentages).reduce((a, b) => 
    percentages[a[0] as keyof typeof percentages] > percentages[b[0] as keyof typeof percentages] ? a : b
  )[0] as keyof typeof percentages;

  const dominantDoshaInfo = doshaInfo[dominantDosha];
  const Icon = dominantDoshaInfo.icon;

  // Map Fitzpatrick types to descriptions
  const fitzpatrickDescriptions = {
    1: 'Very fair, burns easily, never tans',
    2: 'Fair, burns easily, tans minimally',
    3: 'Medium, burns moderately, tans gradually',
    4: 'Olive, burns minimally, tans well',
    5: 'Brown, rarely burns, tans darkly',
    6: 'Black, never burns, tans very darkly'
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Main Results Header */}
      <Card className="shadow-strong">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-3xl bg-gradient-hero bg-clip-text text-transparent flex items-center justify-center gap-2">
            <Icon className="h-8 w-8 text-primary" />
            Your Dominant Dosha: {dominantDoshaInfo.name}
          </CardTitle>
          <CardDescription className="text-lg">
            {dominantDoshaInfo.element} • {dominantDoshaInfo.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={`p-6 rounded-lg ${dominantDoshaInfo.gradient} text-center`}>
            <div className="grid grid-cols-3 gap-4 text-sm">
              {Object.entries(percentages).map(([dosha, percentage]) => (
                <div key={dosha} className="text-center">
                  <div className="font-medium capitalize">{dosha}</div>
                  <div className="text-2xl font-bold">{percentage.toFixed(0)}%</div>
                  <Progress value={percentage} className="h-2 mt-1" />
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Skin Analysis Results */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" />
              AI Skin Analysis
            </CardTitle>
            <CardDescription>
              Analysis confidence: {(skinAnalysis.confidence * 100).toFixed(0)}%
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium">Texture:</span>
                <Badge variant="secondary" className="ml-2 capitalize">
                  {skinAnalysis.texture}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Oiliness:</span>
                <Badge variant="secondary" className="ml-2 capitalize">
                  {skinAnalysis.oiliness}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Pigmentation:</span>
                <Badge variant="secondary" className="ml-2 capitalize">
                  {skinAnalysis.pigmentation}
                </Badge>
              </div>
              <div>
                <span className="text-sm font-medium">Redness:</span>
                <Badge variant="secondary" className="ml-2 capitalize">
                  {skinAnalysis.redness}
                </Badge>
              </div>
            </div>
            <div className="pt-2 border-t">
              <span className="text-sm font-medium">Fitzpatrick Type {skinAnalysis.fitzpatrickType}:</span>
              <p className="text-sm text-muted-foreground mt-1">
                {fitzpatrickDescriptions[skinAnalysis.fitzpatrickType]}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Skin Characteristics */}
        <Card className="shadow-medium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {dominantDoshaInfo.name} Skin Characteristics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dominantDoshaInfo.skinCharacteristics.map((characteristic, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm">{characteristic}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Personalized Recommendations */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="text-xl">Personalized Skincare Recommendations</CardTitle>
          <CardDescription>
            Based on your {dominantDoshaInfo.name} constitution and AI skin analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3 text-accent">Ayurvedic Recommendations:</h4>
              <ul className="space-y-2">
                {dominantDoshaInfo.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
                    <span className="text-sm">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-primary">Modern Skincare Advice:</h4>
              <ul className="space-y-2">
                {skinAnalysis.oiliness === 'dry' && (
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm">Use hyaluronic acid serums for hydration</span>
                  </li>
                )}
                {skinAnalysis.redness !== 'none' && (
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm">Consider niacinamide to reduce redness</span>
                  </li>
                )}
                {skinAnalysis.pigmentation === 'uneven' && (
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm">Vitamin C serum for pigmentation</span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm">SPF 30+ daily protection essential</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                  <span className="text-sm">Gentle cleansing twice daily</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};