import React from "react";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface Step {
  id: number;
  name: string;
  type: string;
}

interface StepNavigationProps {
  steps: Step[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function StepNavigation({
  steps,
  currentStep,
  setCurrentStep,
  nextStep,
  prevStep,
}: StepNavigationProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">
          Step {currentStep}: {steps[currentStep - 1].name}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
            Previous
          </Button>
          <Button variant="outline" onClick={nextStep} disabled={currentStep === steps.length}>
            Next
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`flex items-center px-4 py-2 rounded cursor-pointer transition-colors ${
              currentStep === step.id ? "bg-primary text-white" : "bg-muted hover:bg-muted/80"
            }`}
            onClick={() => setCurrentStep(step.id)}
          >
            {currentStep > step.id && <CheckCircle2 size={16} className="mr-2" />}
            <span>{step.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
