import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Camera, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SkinAnalysisUploadProps {
  onImageAnalyzed: (analysis: SkinAnalysis) => void;
}

export interface SkinAnalysis {
  texture: 'smooth' | 'rough' | 'normal';
  oiliness: 'dry' | 'normal' | 'oily' | 'combination';
  pigmentation: 'even' | 'uneven' | 'hyperpigmented';
  redness: 'none' | 'mild' | 'moderate' | 'severe';
  fitzpatrickType: 1 | 2 | 3 | 4 | 5 | 6;
  confidence: number;
}

export const SkinAnalysisUpload: React.FC<SkinAnalysisUploadProps> = ({ onImageAnalyzed }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, etc.)",
        variant: "destructive",
      });
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    setUploadedImage(imageUrl);
    setIsAnalyzing(true);

    try {
      // Simulate AI analysis - in real implementation, this would use actual AI models
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock analysis results
      const mockAnalysis: SkinAnalysis = {
        texture: Math.random() > 0.5 ? 'smooth' : 'normal',
        oiliness: ['dry', 'normal', 'oily', 'combination'][Math.floor(Math.random() * 4)] as any,
        pigmentation: Math.random() > 0.7 ? 'uneven' : 'even',
        redness: ['none', 'mild', 'moderate'][Math.floor(Math.random() * 3)] as any,
        fitzpatrickType: (Math.floor(Math.random() * 6) + 1) as any,
        confidence: 0.75 + Math.random() * 0.2
      };

      onImageAnalyzed(mockAnalysis);
      
      toast({
        title: "Analysis complete",
        description: "Your skin has been analyzed successfully!",
      });
    } catch (error) {
      toast({
        title: "Analysis failed",
        description: "Please try uploading your image again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-medium">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl bg-gradient-hero bg-clip-text text-transparent">
          Skin Analysis
        </CardTitle>
        <CardDescription className="text-base">
          Upload a clear, front-facing photo of your face in natural lighting for AI-powered skin analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {uploadedImage ? (
          <div className="relative">
            <img 
              src={uploadedImage} 
              alt="Uploaded face" 
              className="w-full h-64 object-cover rounded-lg shadow-soft"
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-2"></div>
                  <p>Analyzing your skin...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center bg-gradient-warm">
            <Camera className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">Upload Your Photo</p>
            <p className="text-muted-foreground mb-4">
              For best results, use natural lighting and face the camera directly
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="gradient"
            size="lg"
            className="flex-1"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploadedImage ? 'Upload New Photo' : 'Choose Photo'}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        <div className="bg-muted/50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium mb-1">Photo Guidelines:</p>
              <ul className="space-y-1 text-xs">
                <li>• Clean face without makeup</li>
                <li>• Natural daylight (avoid harsh shadows)</li>
                <li>• Face camera directly</li>
                <li>• High resolution image</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};