"use client";

import React, { useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import ClassDetailSectionMap from "@/components/ui/custom/education/class/ClassDetailSectionMap";
import CurriculumSection from "@/components/ui/custom/education/class/sections/CurriculumSection";
import PerformanceSection from "@/components/ui/custom/education/class/sections/PerformanceSection";
import StudentSection from "@/components/ui/custom/education/class/sections/StudentSection";
import { Calendar, GraduationCap, Plus } from "lucide-react";
import { useParams } from "next/navigation";

export default function page() {
  const [activeSection, setActiveSection] = useState("student");
  const { id } = useParams();

  // Refs for sections
  const studentSectionRef = useRef<HTMLDivElement>(null);
  const curriculumSectionRef = useRef<HTMLDivElement>(null);
  const performanceSectionRef = useRef<HTMLDivElement>(null);

  // Handle section change with auto-scroll
  const handleSectionChange = (sectionId: string) => {
    setActiveSection(sectionId);

    // Get the appropriate ref based on section
    let targetRef;
    switch (sectionId) {
      case "student":
        targetRef = studentSectionRef;
        break;
      case "curriculum":
        targetRef = curriculumSectionRef;
        break;
      case "performance":
        targetRef = performanceSectionRef;
        break;
      default:
        targetRef = studentSectionRef;
    }

    // Scroll to the section with smooth behavior
    if (targetRef.current) {
      targetRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-primary" />
              Class {id} Management
            </h1>
            <p className="text-gray-600 mt-1">Comprehensive class management dashboard</p>
          </div>
          {/* <div className="flex items-center gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Schedule
            </Button>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Content
            </Button>
          </div> */}
        </div>
      </div>

      {/* Section Navigation */}
      <ClassDetailSectionMap activeSection={activeSection} onSectionChange={handleSectionChange} />

      {/* Students Section */}
      {activeSection === "student" && (
        <div ref={studentSectionRef}>
          <StudentSection classId={id as string} />
        </div>
      )}

      {/* Curriculum Section */}
      {activeSection === "curriculum" && (
        <div ref={curriculumSectionRef}>
          <CurriculumSection classId={id as string} />
        </div>
      )}

      {/* Performance Section */}
      {activeSection === "performance" && (
        <div ref={performanceSectionRef}>
          <PerformanceSection classId={id as string} />
        </div>
      )}
    </div>
  );
}
