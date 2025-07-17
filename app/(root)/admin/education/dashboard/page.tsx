"use client";

import React, { useEffect, useState } from "react";

import { AcademicYearModel } from "@/app/api/model/AcademicYearModel";
import { MOCK_SEMESTERS } from "@/app/api/model/SemesterModel";
import { MOCK_SEMESTER_WEEKS } from "@/app/api/model/SemesterWeekModel";
import { academicYearService } from "@/app/api/services/academicYearService";
import { Button } from "@/components/ui/button";
import AcademicYearSection from "@/components/ui/custom/education/academic_year/AcademicYearSection";
import AddAcademicYearDialog from "@/components/ui/custom/education/academic_year/AddAcademicYearDialog";
import BriefStatsItems from "@/components/ui/custom/education/general/BriefStatsItems";
import SemesterSection from "@/components/ui/custom/education/semester/SemesterSection";
import SemesterWeekSection from "@/components/ui/custom/education/semester/SemesterWeekSection";
import { BookOpen, Building2, Calendar, GraduationCap, Plus, Users } from "lucide-react";

export default function Page() {
  const [academicYear, setAcademicYear] = useState<AcademicYearModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchAcademicYears = async () => {
      try {
        const academicYears = await academicYearService.getAcademicYears();
        setAcademicYear(academicYears);
      } catch (error) {
        console.error("Failed to fetch academic years", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAcademicYears();
  }, []);

  const statsData = [
    {
      title: "Academic Years",
      icon: <Calendar className="w-5 h-5 text-primary" />,
      total: academicYear.length,
      percentageChange: 10,
      isIncrease: true,
    },
    {
      title: "Departments",
      icon: <Building2 className="w-5 h-5 text-primary" />,
      total: 10,
      percentageChange: 10,
      isIncrease: true,
    },
    {
      title: "Classes",
      icon: <Users className="w-5 h-5 text-primary" />,
      total: 24,
      percentageChange: 15,
      isIncrease: true,
    },
    {
      title: "Subjects",
      icon: <BookOpen className="w-5 h-5 text-primary" />,
      total: 48,
      percentageChange: 8,
      isIncrease: true,
    },
    {
      title: "Majors",
      icon: <GraduationCap className="w-5 h-5 text-primary" />,
      total: 12,
      percentageChange: 5,
      isIncrease: true,
    },
  ];

  const handleAddAcademicYear = async (newYear: AcademicYearModel) => {
    try {
      const newAcademicYear = await academicYearService.addAcademicYear(newYear);
      setAcademicYear((prev) => [...prev, newAcademicYear]);
    } catch (error) {
      console.error("Failed to add academic year", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Education Dashboard</h1>
              <p className="text-gray-600 mt-1">Manage academic years, semesters, and educational resources</p>
            </div>
          </div>

          <Button className="bg-primary hover:bg-primary/90 transition-colors" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Academic Year
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statsData.map((stat, index) => (
            <BriefStatsItems
              key={index}
              title={stat.title}
              icon={stat.icon}
              total={stat.total}
              percentageChange={stat.percentageChange}
              isIncrease={stat.isIncrease}
            />
          ))}
        </div>
      </div>

      {/* Academic Years Section */}
      <div className="mb-8">
        <AcademicYearSection academicYears={academicYear} />
      </div>

      {/* Semesters Section */}
      <div className="mb-8">
        <SemesterSection semesters={MOCK_SEMESTERS} />
      </div>

      {/* Semester Weeks Section */}
      <div className="mb-8">
        <SemesterWeekSection weeks={MOCK_SEMESTER_WEEKS} semesters={MOCK_SEMESTERS} />
      </div>

      {/* Add Academic Year Dialog */}
      <AddAcademicYearDialog open={open} setOpen={setOpen} onAddAcademicYear={handleAddAcademicYear} />
    </div>
  );
}
