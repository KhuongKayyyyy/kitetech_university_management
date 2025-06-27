"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calculator, Plus } from "lucide-react";

interface AddFormulaDialogProps {
  trigger?: React.ReactNode;
  onAddFormula?: (formula: {
    name: string;
    description: string;
    formula: string;
    participation: number;
    midtermTest: number;
    midtermReport: number;
    final: number;
  }) => void;
}

export default function AddFormulaDialog({ trigger, onAddFormula }: AddFormulaDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    formula: "",
    participation: 0,
    midtermTest: 0,
    midtermReport: 0,
    final: 0,
  });

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleWeightChange = (field: string, value: number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: Math.max(0, Math.min(100, value)),
    }));
  };

  const getTotalWeight = () => {
    return formData.participation + formData.midtermTest + formData.midtermReport + formData.final;
  };

  const isFormValid = () => {
    return formData.name.trim() !== "" && formData.description.trim() !== "" && getTotalWeight() === 100;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid() && onAddFormula) {
      onAddFormula(formData);
      setFormData({
        name: "",
        description: "",
        formula: "",
        participation: 0,
        midtermTest: 0,
        midtermReport: 0,
        final: 0,
      });
      setOpen(false);
    }
  };

  const totalWeight = getTotalWeight();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-primary hover:bg-primary/90 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Formula
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" />
            Add New Grading Formula
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Formula Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="Enter formula name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter formula description"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="formula">Formula Expression</Label>
            <Input
              id="formula"
              value={formData.formula}
              onChange={(e) => handleInputChange("formula", e.target.value)}
              placeholder="e.g., (P * 0.1) + (MT * 0.3) + (MR * 0.2) + (F * 0.4)"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Assessment Weights (%)</Label>
              <div className={`text-sm font-medium ${totalWeight === 100 ? "text-green-600" : "text-red-600"}`}>
                Total: {totalWeight}%
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="participation" className="text-sm">
                  Participation
                </Label>
                <Input
                  id="participation"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.participation}
                  onChange={(e) => handleWeightChange("participation", Number(e.target.value))}
                  className="text-center"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="midtermTest" className="text-sm">
                  Midterm Test
                </Label>
                <Input
                  id="midtermTest"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.midtermTest}
                  onChange={(e) => handleWeightChange("midtermTest", Number(e.target.value))}
                  className="text-center"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="midtermReport" className="text-sm">
                  Midterm Report
                </Label>
                <Input
                  id="midtermReport"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.midtermReport}
                  onChange={(e) => handleWeightChange("midtermReport", Number(e.target.value))}
                  className="text-center"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="final" className="text-sm">
                  Final
                </Label>
                <Input
                  id="final"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.final}
                  onChange={(e) => handleWeightChange("final", Number(e.target.value))}
                  className="text-center"
                />
              </div>
            </div>

            {totalWeight !== 100 && (
              <div className="text-sm text-red-600 bg-red-50 p-2 rounded">⚠️ Total weight must equal 100%</div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isFormValid()} className="bg-primary hover:bg-primary/90">
              Add Formula
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
