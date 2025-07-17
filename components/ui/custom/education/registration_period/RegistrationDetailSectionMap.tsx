"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { BookOpen, GraduationCap, Info } from "lucide-react";

interface RegistrationDetailSectionMapProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const sections = [
  {
    id: "overview",
    label: "Overview",
    icon: Info,
    description: "Period details and statistics",
  },
  {
    id: "classes",
    label: "Classes",
    icon: GraduationCap,
    description: "Available classes for registration",
  },
  {
    id: "subjects",
    label: "Subjects",
    icon: BookOpen,
    description: "Available subjects for registration",
  },
];

export default function RegistrationDetailSectionMap({
  activeSection,
  onSectionChange,
}: RegistrationDetailSectionMapProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;

          return (
            <Button
              key={section.id}
              variant={isActive ? "default" : "ghost"}
              onClick={() => onSectionChange(section.id)}
              className={cn(
                "group flex items-center gap-3 justify-start text-left h-auto p-5 flex-1 transition-all duration-300 ease-in-out",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg transform scale-[1.02]"
                  : "hover:bg-gray-50 text-gray-700 hover:shadow-md hover:-translate-y-1 hover:border-gray-300 border border-transparent",
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive ? "bg-primary-foreground/20" : "bg-gray-100 group-hover:bg-primary/10 group-hover:scale-110",
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-all duration-300",
                    isActive ? "text-primary-foreground" : "text-gray-600 group-hover:text-primary",
                  )}
                />
              </div>
              <div className="flex flex-col">
                <span
                  className={cn(
                    "font-semibold transition-colors duration-300",
                    isActive ? "text-primary-foreground" : "group-hover:text-gray-900",
                  )}
                >
                  {section.label}
                </span>
                <span
                  className={cn(
                    "text-xs mt-1 transition-colors duration-300",
                    isActive ? "text-primary-foreground/80" : "text-gray-500 group-hover:text-gray-600",
                  )}
                >
                  {section.description}
                </span>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
