"use client";

import React, { useEffect, useState } from "react";

import { mockRegistrationPeriods, RegistrationPeriod } from "@/app/api/model/RegistrationPeriodModel";
import { registrationPeriodService } from "@/app/api/services/registrationPeriodService";
import { Button } from "@/components/ui/button";
import RegisPeriodItem from "@/components/ui/custom/education/registration_period/RegisPeriodItem";
import { RegistrationPeriodTable } from "@/components/ui/custom/education/registration_period/RegistrationPeriodTable";
import { Clock, Grid, List, Plus } from "lucide-react";
import { toast } from "sonner";

import AddRegistrationPeriodDialog from "../../registration_period/AddRegistrationPeriodDialog";

export default function RegistrationPeriodsSection() {
  const [registrationViewMode, setRegistrationViewMode] = useState<"cards" | "table">("cards");
  const [open, setOpen] = useState(false);
  const [registrationPeriods, setRegistrationPeriods] = useState<RegistrationPeriod[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRegistrationPeriods = async () => {
      try {
        setIsLoading(true);
        const periodsData = await registrationPeriodService.getRegistrationPeriods();
        setRegistrationPeriods(periodsData);
      } catch (error) {
        console.error("Error fetching registration periods:", error);
        toast.error("Failed to load registration periods");
        // Fallback to mock data
        setRegistrationPeriods(mockRegistrationPeriods);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegistrationPeriods();
  }, []);

  const handleAddRegistrationPeriod = (period: RegistrationPeriod) => {
    // Add the new period to the list
    setRegistrationPeriods((prev) => [period, ...prev]);
    console.log("Add period:", period);
  };

  const handleDeleteRegistrationPeriod = (period: RegistrationPeriod) => {
    // Remove the period from the list
    setRegistrationPeriods((prev) => prev.filter((p) => p.id !== period.id));
    console.log("Delete period:", period);
  };

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
          <Button onClick={() => setOpen(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Registration Period
          </Button>
        </div>
      </div>

      {/* Content Display */}
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading registration periods...</div>
        </div>
      ) : registrationViewMode === "cards" ? (
        <div className="grid grid-cols-2 gap-6">
          {registrationPeriods.map((period) => (
            <RegisPeriodItem
              key={period.id}
              period={period}
              onEdit={(period) => console.log("Edit period:", period)}
              onDelete={handleDeleteRegistrationPeriod}
            />
          ))}
        </div>
      ) : (
        <RegistrationPeriodTable periods={registrationPeriods} onDeletePeriod={handleDeleteRegistrationPeriod} />
      )}

      <AddRegistrationPeriodDialog
        open={open}
        setOpen={setOpen}
        onAddRegistrationPeriod={handleAddRegistrationPeriod}
      />
    </>
  );
}
