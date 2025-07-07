"use client";

import React, { useState } from "react";

import { mockRegistrationPeriods } from "@/app/api/model/RegistrationPeriodModel";
import { Button } from "@/components/ui/button";
import RegisPeriodItem from "@/components/ui/custom/education/registration_period/RegisPeriodItem";
import { RegistrationPeriodTable } from "@/components/ui/custom/education/registration_period/RegistrationPeriodTable";
import { Clock, Grid, List, Plus } from "lucide-react";

export default function RegistrationPeriodsSection() {
  const [registrationViewMode, setRegistrationViewMode] = useState<"cards" | "table">("cards");

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <Clock className="w-6 h-6 text-primary" />
            Registration Periods
          </h2>
          <p className="text-gray-600 mt-1">Manage student registration periods for different semesters</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Mode Toggle for Registration */}
          <div className="flex items-center border border-gray-300 rounded-lg p-1">
            <Button
              variant={registrationViewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setRegistrationViewMode("cards")}
              className="h-8 px-3"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={registrationViewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setRegistrationViewMode("table")}
              className="h-8 px-3"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Registration Period
          </Button>
        </div>
      </div>

      {/* Content Display */}
      {registrationViewMode === "cards" ? (
        <div className="grid grid-cols-2 gap-6">
          {mockRegistrationPeriods.map((period) => (
            <RegisPeriodItem
              key={period.id}
              period={period}
              onEdit={(period) => console.log("Edit period:", period)}
              onDelete={(period) => console.log("Delete period:", period)}
            />
          ))}
        </div>
      ) : (
        <RegistrationPeriodTable periods={mockRegistrationPeriods} />
      )}
    </>
  );
}
