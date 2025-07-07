"use client";

import React, { useEffect, useState } from "react";

import { AvailableSubject, MOCK_AVAILABLE_SUBJECTS } from "@/app/api/model/AvailableSubject";
import { mockRegistrationPeriods, RegistrationPeriod } from "@/app/api/model/RegistrationPeriodModel";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import AddAdvailableSubject from "@/components/ui/custom/education/registration_period/AddAdvailableSubject";
import { AvailableSubjectTable } from "@/components/ui/custom/education/registration_period/AvailableSubjectTable";
import EditDatePeriod from "@/components/ui/custom/education/registration_period/EditDatePeriod";
import EditRegisPeriodDialog from "@/components/ui/custom/education/registration_period/EditRegisPeriodDialog";
import { RegisPeriodStatus } from "@/constants/enum/RegisPeriodStatus";
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Download,
  Edit2,
  Filter,
  Plus,
  Settings,
  Users,
  XCircle,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function page() {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const periodName = searchParams.get("name");

  const [registrationPeriod, setRegistrationPeriod] = useState<RegistrationPeriod | null>(null);
  const [loading, setLoading] = useState(true);

  const [openEditDatePeriod, setOpenEditDatePeriod] = useState(false);
  const [openEditRegisPeriodDialog, setOpenEditRegisPeriodDialog] = useState(false);
  const [openAddAdvailableSubject, setOpenAddAdvailableSubject] = useState(false);

  useEffect(() => {
    // Simulate API call to fetch registration period details
    const fetchRegistrationPeriod = () => {
      const period = mockRegistrationPeriods.find((p) => p.id === parseInt(id as string));
      setRegistrationPeriod(period || null);
      setLoading(false);
    };

    fetchRegistrationPeriod();
  }, [id]);

  const getStatusColor = (status: RegisPeriodStatus) => {
    switch (status) {
      case RegisPeriodStatus.Open:
        return "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200";
      case RegisPeriodStatus.Closed:
        return "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border-slate-200";
      case RegisPeriodStatus.Cancelled:
        return "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200";
      default:
        return "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: RegisPeriodStatus) => {
    switch (status) {
      case RegisPeriodStatus.Open:
        return <CheckCircle className="h-5 w-5" />;
      case RegisPeriodStatus.Closed:
        return <XCircle className="h-5 w-5" />;
      case RegisPeriodStatus.Cancelled:
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    });
  };

  const formatDateShort = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getDaysDifference = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const handleExtendPeriod = () => {
    setOpenEditDatePeriod(true);
  };

  const handleAddSubject = (subject: AvailableSubject) => {
    console.log(subject);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-6 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-lg w-64 mb-6"></div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="h-6 bg-gray-200 rounded-lg w-48 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!registrationPeriod) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-6 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6 hover:bg-white hover:shadow-md transition-all duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Registration Period Not Found</h1>
            <p className="text-gray-600">The registration period with ID {id} could not be found.</p>
          </div>
        </div>
      </div>
    );
  }

  function handleDateSelected(date: Date): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header with Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="hover:bg-white hover:shadow-md transition-all duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Registration Periods
            </Button>
            <div className="h-6 w-px bg-gray-300" />
            <h1 className="text-2xl font-bold text-gray-900">
              {registrationPeriod.description || `Registration Period ${registrationPeriod.id}`}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(registrationPeriod.status)}`}
            >
              {getStatusIcon(registrationPeriod.status)}
              <span>{registrationPeriod.status}</span>
            </div>
          </div>
        </div>

        {/* Period Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Date Range */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/60 col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span className="font-semibold text-gray-700">Registration Period</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="text-lg font-bold text-gray-900">{formatDateShort(registrationPeriod.startDate)}</p>
                <p className="text-xs text-gray-500">{formatDate(registrationPeriod.startDate)}</p>
              </div>
              <div className="hidden sm:block w-8 h-px bg-gray-300" />
              <div>
                <p className="text-sm text-gray-600">End Date</p>
                <p className="text-lg font-bold text-gray-900">{formatDateShort(registrationPeriod.endDate)}</p>
                <p className="text-xs text-gray-500">{formatDate(registrationPeriod.endDate)}</p>
              </div>
              <div className="sm:text-right">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-lg font-bold text-purple-600">
                  {getDaysDifference(registrationPeriod.startDate, registrationPeriod.endDate)} days
                </p>
              </div>
            </div>
          </div>

          {/* Statistics */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/60">
            <div className="flex items-center gap-3 mb-3">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-gray-700">Students</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">1,247</p>
            <p className="text-xs text-green-600">+12% from last period</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/60">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="h-5 w-5 text-green-500" />
              <span className="font-medium text-gray-700">Subjects</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">84</p>
            <p className="text-xs text-blue-600">6 departments</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Available Subjects Table - Takes up most space */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/60">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Available Subjects</h2>
                  <p className="text-sm text-gray-600">Manage subjects available for registration in this period</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button size="sm" onClick={() => setOpenAddAdvailableSubject(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Subject
                  </Button>
                </div>
              </div>
              <AvailableSubjectTable
                availableSubjects={MOCK_AVAILABLE_SUBJECTS}
                onEditSubject={function (subject: AvailableSubject): void {
                  throw new Error("Function not implemented.");
                }}
                onViewRegistrations={function (subject: AvailableSubject): void {
                  throw new Error("Function not implemented.");
                }}
                onDeleteSubject={function (subject: AvailableSubject): void {
                  throw new Error("Function not implemented.");
                }}
                onAddSubject={function (subject: AvailableSubject): void {
                  throw new Error("Function not implemented.");
                }}
              />
            </div>
          </div>

          {/* Sidebar - Actions & Details */}
          <div className="lg:col-span-1 space-y-6">
            {/* Period Status & Actions */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/60">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Period Status</h3>

              {registrationPeriod.status === RegisPeriodStatus.Open && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <span className="font-medium text-gray-700">Days Remaining</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.max(
                      0,
                      Math.ceil(
                        (new Date(registrationPeriod.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                      ),
                    )}
                  </p>
                  <p className="text-xs text-gray-600">Until period closes</p>
                </div>
              )}

              <div className="space-y-3">
                {registrationPeriod.status === RegisPeriodStatus.Open && (
                  <Button onClick={handleExtendPeriod} className="w-full justify-start" size="sm">
                    <Calendar className="w-4 h-4 mr-2" />
                    Extend Period
                  </Button>
                )}
                <Button
                  className="w-full justify-start"
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenEditRegisPeriodDialog(true)}
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Details
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200/60">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline" size="sm">
                  <Users className="w-4 h-4 mr-2" />
                  View Students
                </Button>
                <Button className="w-full justify-start" variant="outline" size="sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Manage Subjects
                </Button>
                <Button className="w-full justify-start" variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>

            <EditDatePeriod
              requiredFutureDate={true}
              currentDate={new Date(registrationPeriod.endDate)}
              onDateSelected={handleDateSelected}
              open={openEditDatePeriod}
              setOpen={setOpenEditDatePeriod}
            />
            <EditRegisPeriodDialog
              registrationPeriod={registrationPeriod}
              open={openEditRegisPeriodDialog}
              setOpen={setOpenEditRegisPeriodDialog}
              onSubmit={(updatedPeriod) => {
                setRegistrationPeriod((prev) => {
                  if (!prev) return null;
                  return { ...prev, ...updatedPeriod };
                });
              }}
            />

            <AddAdvailableSubject
              open={openAddAdvailableSubject}
              setOpen={setOpenAddAdvailableSubject}
              registrationPeriodId={registrationPeriod.id}
              onSubmit={handleAddSubject}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
