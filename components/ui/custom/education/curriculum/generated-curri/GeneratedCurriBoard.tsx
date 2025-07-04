import React from "react";

import { CurriculumnSubjectModel } from "@/app/api/model/CurriculumnSubjectModel";
import { BookOpen, Calendar, GraduationCap, Trophy } from "lucide-react";

import GeneratedCurriColumn from "./GeneratedCurriColumn";

interface GeneratedCurriBoardProps {
  subjects: CurriculumnSubjectModel[];
}

export default function GeneratedCurriBoard({ subjects }: GeneratedCurriBoardProps) {
  // Group subjects by semester
  const groupedSubjects = subjects.reduce(
    (acc, subject) => {
      const semesterKey = subject.Semester;
      if (!acc[semesterKey]) {
        acc[semesterKey] = [];
      }
      acc[semesterKey].push(subject as CurriculumnSubjectModel);
      return acc;
    },
    {} as Record<number, CurriculumnSubjectModel[]>,
  );

  // Sort semesters in ascending order
  const sortedSemesters = Object.keys(groupedSubjects)
    .map(Number)
    .sort((a, b) => a - b);

  const totalCredits = subjects.reduce((sum, subject) => sum + subject.TotalCredits, 0);
  const requiredSubjects = subjects.filter((subject) => subject.IsRequired).length;
  const electiveSubjects = subjects.filter((subject) => !subject.IsRequired).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-gradient-to-r from-indigo-400/15 to-cyan-400/15 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-violet-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Enhanced Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-primary/20 to-blue-500/30 rounded-2xl backdrop-blur-sm border border-white/20 shadow-2xl">
                  <GraduationCap className="w-12 h-12 text-primary" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-blue-500/40 rounded-2xl blur-xl opacity-50"></div>
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-primary bg-clip-text text-transparent mb-4">
              Curriculum Board
            </h1>
            <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
              Comprehensive overview of your academic journey with interactive semester planning
            </p>
          </div>

          {/* Enhanced Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-primary/10 to-primary/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{subjects.length}</div>
                  <div className="text-gray-600 text-sm">Total Subjects</div>
                </div>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500/10 to-blue-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Trophy className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{totalCredits}</div>
                  <div className="text-gray-600 text-sm">Total Credits</div>
                </div>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-green-500/10 to-green-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-800">{sortedSemesters.length}</div>
                  <div className="text-gray-600 text-sm">Semesters</div>
                </div>
              </div>
            </div>

            <div className="group bg-white/70 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-purple-500/10 to-purple-500/20 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-800">
                    {requiredSubjects}/{electiveSubjects}
                  </div>
                  <div className="text-gray-600 text-sm">Required/Elective</div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Curriculum Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {sortedSemesters.map((semester, index) => {
              const subjects = groupedSubjects[semester];
              const semesterName = subjects[0]?.SemesterName || `Semester ${semester}`;

              return (
                <div key={semester} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <GeneratedCurriColumn subjects={subjects} semesterName={semesterName} />
                </div>
              );
            })}
          </div>

          {/* Enhanced Progress Indicator */}
          <div className="mt-16 bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/30 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-primary bg-clip-text text-transparent mb-4">
                Academic Progress
              </h2>
              <p className="text-gray-600">Track your journey through the curriculum</p>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-8">
              <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary via-blue-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min((sortedSemesters.length / 8) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="absolute top-6 left-0 right-0 flex justify-between text-sm text-gray-600">
                <span>Start</span>
                <span className="font-medium text-primary">{sortedSemesters.length}/8 Semesters</span>
                <span>Graduation</span>
              </div>
            </div>

            {/* Credit Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Credit Distribution</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Required Courses</span>
                    <span className="font-medium text-red-600">
                      {subjects.filter((s) => s.IsRequired).reduce((sum, s) => sum + s.TotalCredits, 0)} credits
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Elective Courses</span>
                    <span className="font-medium text-blue-600">
                      {subjects.filter((s) => !s.IsRequired).reduce((sum, s) => sum + s.TotalCredits, 0)} credits
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Course Types</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Subjects</span>
                    <span className="font-medium text-primary">{subjects.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Avg Credits/Semester</span>
                    <span className="font-medium text-green-600">
                      {sortedSemesters.length > 0 ? Math.round(totalCredits / sortedSemesters.length) : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
