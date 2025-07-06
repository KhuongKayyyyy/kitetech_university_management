"use client";

import React, { useState } from "react";

import { mockRegistrationPeriods } from "@/app/api/model/RegistrationPeriodModel";
import { Button } from "@/components/ui/button";
import { RegistrationPeriodTable } from "@/components/ui/custom/education/registration_period/RegistrationPeriodTable";
import { RegisPeriodStatus } from "@/constants/enum/RegisPeriodStatus";
import { AlertCircle, CheckCircle, Clock, Grid, List, Plus, XCircle } from "lucide-react";

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockRegistrationPeriods.map((period) => (
            <div
              key={period.id}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Semester {period.semesterId}</h3>
                  <p className="text-sm text-gray-600">{period.description}</p>
                </div>
                <div
                  className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${
                    period.status === "Open"
                      ? "bg-green-50 text-green-700 border-green-200"
                      : period.status === "Closed"
                        ? "bg-red-50 text-red-700 border-red-200"
                        : period.status === "Cancelled"
                          ? "bg-yellow-50 text-yellow-700 border-yellow-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {period.status === RegisPeriodStatus.Open && <CheckCircle className="h-3 w-3" />}
                  {period.status === RegisPeriodStatus.Closed && <XCircle className="h-3 w-3" />}
                  {period.status === RegisPeriodStatus.Cancelled && <AlertCircle className="h-3 w-3" />}
                  {period.status !== "Open" && period.status !== "Closed" && period.status !== "Cancelled" && (
                    <Clock className="h-3 w-3" />
                  )}
                  {period.status}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Start Date:</span>
                  <span className="font-medium">{new Date(period.startDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">End Date:</span>
                  <span className="font-medium">{new Date(period.endDate).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">
                    {Math.ceil(
                      (new Date(period.endDate).getTime() - new Date(period.startDate).getTime()) /
                        (1000 * 60 * 60 * 24),
                    )}{" "}
                    days
                  </span>
                </div>
              </div>

              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <RegistrationPeriodTable periods={mockRegistrationPeriods} />
      )}
    </>
  );
}
