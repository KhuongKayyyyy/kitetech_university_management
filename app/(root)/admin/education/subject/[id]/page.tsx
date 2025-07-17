"use client";

import React, { useEffect, useRef, useState } from "react";

import { AvailableSubject, MOCK_AVAILABLE_SUBJECTS } from "@/app/api/model/AvailableSubject";
import { ClassModel, mockClasses } from "@/app/api/model/ClassModel";
import { mockRegistrationPeriods, RegistrationPeriod } from "@/app/api/model/RegistrationPeriodModel";
import { Button } from "@/components/ui/button";
import AddAdvailableSubject from "@/components/ui/custom/education/registration_period/AddAdvailableSubject";
import AddAvailableClass from "@/components/ui/custom/education/registration_period/AddAvailableClass";
import AvailableClassForRegis from "@/components/ui/custom/education/registration_period/AvailableClassForRegis";
import { AvailableSubjectTable } from "@/components/ui/custom/education/registration_period/AvailableSubjectTable";
import EditDatePeriod from "@/components/ui/custom/education/registration_period/EditDatePeriod";
import EditRegisPeriodDialog from "@/components/ui/custom/education/registration_period/EditRegisPeriodDialog";
import RegistrationDetailSectionMap from "@/components/ui/custom/education/registration_period/RegistrationDetailSectionMap";
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
  GraduationCap,
  Info,
  Plus,
  Settings,
  Users,
  XCircle,
} from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

export default function page() {
  const [activeSection, setActiveSection] = useState("overview");
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Refs for sections
  const overviewSectionRef = useRef<HTMLDivElement>(null);
  const classesSectionRef = useRef<HTMLDivElement>(null);
  const subjectsSectionRef = useRef<HTMLDivElement>(null);

  const [registrationPeriod, setRegistrationPeriod] = useState<RegistrationPeriod | null>(null);
  const [loading, setLoading] = useState(true);

  const [openEditDatePeriod, setOpenEditDatePeriod] = useState(false);
  const [openEditRegisPeriodDialog, setOpenEditRegisPeriodDialog] = useState(false);
  const [openAddAdvailableSubject, setOpenAddAdvailableSubject] = useState(false);

  // Handle section change with auto-scroll
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);

    // Get the appropriate ref based on section
    let targetRef;
    switch (sectionId) {
      case "overview":
        targetRef = overviewSectionRef;
        break;
      case "classes":
        targetRef = classesSectionRef;
        break;
      case "subjects":
        targetRef = subjectsSectionRef;
        break;
      default:
        targetRef = overviewSectionRef;
    }

    // Scroll to the section with smooth behavior
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
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
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded-lg w-64"></div>
            <div className="bg-white rounded-2xl p-8 shadow-lg space-y-4">
              <div className="h-6 bg-gray-200 rounded-lg w-48"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded-lg w-full"></div>
                <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
              </div>
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
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
      <div className="container mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="hover:bg-gray-50 hover:shadow-md transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Registration Period {id}</h1>
                  <p className="text-gray-600 text-sm lg:text-base">
                    {registrationPeriod.description || "Comprehensive registration period management"}
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Status Badge */}
            <div className="flex items-center gap-3">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(registrationPeriod.status)}`}
              >
                {getStatusIcon(registrationPeriod.status)}
                <span>{registrationPeriod.status}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section Navigation */}
        <RegistrationDetailSectionMap activeSection={activeSection} onSectionChange={handleSectionChange} />

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Overview Section */}
          {activeSection === "overview" && (
            <div ref={overviewSectionRef} className="space-y-6">
              {/* Period Details Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Period Details</h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Basic Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">
                      Basic Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Period Name</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {registrationPeriod.description || `Registration Period ${registrationPeriod.id}`}
                        </p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Semester</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">Fall 2024</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          Academic Year
                        </label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">2024-2025</p>
                      </div>
                    </div>
                  </div>

                  {/* Date Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">Timeline</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Start Date</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {formatDateShort(registrationPeriod.startDate)}
                        </p>
                        <p className="text-sm text-gray-500">{formatDate(registrationPeriod.startDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">End Date</label>
                        <p className="text-lg font-semibold text-gray-900 mt-1">
                          {formatDateShort(registrationPeriod.endDate)}
                        </p>
                        <p className="text-sm text-gray-500">{formatDate(registrationPeriod.endDate)}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Duration</label>
                        <p className="text-lg font-semibold text-purple-600 mt-1">
                          {getDaysDifference(registrationPeriod.startDate, registrationPeriod.endDate)} days
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Status and Actions */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-800 border-b border-gray-100 pb-2">
                      Status & Actions
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                          Current Status
                        </label>
                        <div className="mt-2">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border ${getStatusColor(registrationPeriod.status)}`}
                          >
                            {getStatusIcon(registrationPeriod.status)}
                            <span>{registrationPeriod.status}</span>
                          </div>
                        </div>
                      </div>

                      {registrationPeriod.status === RegisPeriodStatus.Open && (
                        <div>
                          <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                            Days Remaining
                          </label>
                          <p className="text-3xl font-bold text-orange-600 mt-1">
                            {Math.max(
                              0,
                              Math.ceil(
                                (new Date(registrationPeriod.endDate).getTime() - new Date().getTime()) /
                                  (1000 * 60 * 60 * 24),
                              ),
                            )}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col gap-2 pt-2">
                        <Button variant="outline" onClick={() => setOpenEditRegisPeriodDialog(true)} className="w-full">
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit Details
                        </Button>
                        {registrationPeriod.status === RegisPeriodStatus.Open && (
                          <Button onClick={handleExtendPeriod} className="w-full">
                            <Calendar className="w-4 h-4 mr-2" />
                            Extend Period
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-green-50 rounded-lg">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Registration Statistics</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Users className="h-6 w-6 text-blue-600" />
                      <span className="font-semibold text-blue-800">Total Students</span>
                    </div>
                    <p className="text-3xl font-bold text-blue-900">1,247</p>
                    <p className="text-sm text-blue-600 mt-1">+12% from last period</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <GraduationCap className="h-6 w-6 text-green-600" />
                      <span className="font-semibold text-green-800">Classes</span>
                    </div>
                    <p className="text-3xl font-bold text-green-900">{mockClasses.length}</p>
                    <p className="text-sm text-green-600 mt-1">8 departments</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                      <span className="font-semibold text-purple-800">Subjects</span>
                    </div>
                    <p className="text-3xl font-bold text-purple-900">{MOCK_AVAILABLE_SUBJECTS.length}</p>
                    <p className="text-sm text-purple-600 mt-1">Available for registration</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Calendar className="h-6 w-6 text-orange-600" />
                      <span className="font-semibold text-orange-800">Registrations</span>
                    </div>
                    <p className="text-3xl font-bold text-orange-900">892</p>
                    <p className="text-sm text-orange-600 mt-1">Active registrations</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Classes Section */}
          {activeSection === "classes" && (
            <div ref={classesSectionRef}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-50 rounded-lg">
                      <GraduationCap className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Available Classes</h2>
                      <p className="text-sm text-gray-600">Manage classes eligible for this registration period</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    <AddAvailableClass
                      onAddClasses={function (classIds: number[]): void {
                        throw new Error("Function not implemented.");
                      }}
                    />
                  </div>
                </div>

                <AvailableClassForRegis
                  availableClasses={mockClasses}
                  onEditClass={function (classItem: ClassModel): void {
                    throw new Error("Function not implemented.");
                  }}
                  onViewDetails={function (classItem: ClassModel): void {
                    throw new Error("Function not implemented.");
                  }}
                  onRegisterClass={function (classItem: ClassModel): void {
                    throw new Error("Function not implemented.");
                  }}
                  onDeleteClass={function (classItem: ClassModel): void {
                    throw new Error("Function not implemented.");
                  }}
                />
              </div>
            </div>
          )}

          {/* Subjects Section */}
          {activeSection === "subjects" && (
            <div ref={subjectsSectionRef}>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-50 rounded-lg">
                      <BookOpen className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Available Subjects</h2>
                      <p className="text-sm text-gray-600">Manage subjects available for registration in this period</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    <Button onClick={() => setOpenAddAdvailableSubject(true)}>
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
          )}
        </div>

        {/* Dialogs and Modals */}
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
  );
}
