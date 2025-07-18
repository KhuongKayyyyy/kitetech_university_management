"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { CurriculumBoardType } from "./CreateCurriculumDialog";

interface StepNavigationV2Props {
  steps: CurriculumBoardType[];
  currentStep: number;
  setCurrentStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
}

export default function StepNavigationV2({
  steps,
  currentStep,
  setCurrentStep,
  nextStep,
  prevStep,
}: StepNavigationV2Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Curriculum Setup Progress</h2>
        <span className="text-sm text-muted-foreground">
          Step {currentStep} of {steps.length}
        </span>
      </div>

      <div className="flex items-center space-x-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = currentStep === stepNumber;
          const isCompleted = currentStep > stepNumber;

          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(stepNumber)}
                className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-medium transition-colors ${
                  isActive
                    ? "border-primary bg-primary text-primary-foreground"
                    : isCompleted
                      ? "border-green-500 bg-green-500 text-white"
                      : "border-gray-300 bg-white text-gray-500"
                }`}
              >
                {stepNumber}
              </button>
              <div className="ml-3 flex flex-col">
                <span className={`text-sm font-medium ${isActive ? "text-primary" : "text-gray-700"}`}>
                  {step.name}
                </span>
                <span className="text-xs text-gray-500">{step.description}</span>
              </div>
              {index < steps.length - 1 && <div className="mx-4 h-px w-8 bg-gray-300" />}
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button onClick={nextStep} disabled={currentStep === steps.length}>
          Next
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
