import React from "react";

import { AlertTriangle, Award, Target, TrendingDown, TrendingUp, Users } from "lucide-react";

interface PerformanceMetricsCardsProps {
  performanceMetrics: {
    totalStudents: number;
    averageGrade: number;
    passRate: number;
    lowPerformers: number;
    unregisteredStudents: number;
    excellentStudents: number;
    atRiskStudents: number;
  };
}

export default function PerformanceMetricsCards({ performanceMetrics }: PerformanceMetricsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-green-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Award className="w-5 h-5 text-green-600" />
          <span className="text-sm font-medium text-green-800">Average Grade</span>
        </div>
        <div className="text-2xl font-bold text-green-600">{performanceMetrics.averageGrade}</div>
        <div className="text-xs text-green-600">+0.3 from last month</div>
      </div>
      <div className="bg-blue-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-blue-800">Pass Rate</span>
        </div>
        <div className="text-2xl font-bold text-blue-600">{performanceMetrics.passRate}%</div>
        <div className="text-xs text-blue-600">+2.1% from last semester</div>
      </div>
      <div className="bg-red-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <span className="text-sm font-medium text-red-800">Low Performers</span>
        </div>
        <div className="text-2xl font-bold text-red-600">{performanceMetrics.lowPerformers}</div>
        <div className="text-xs text-red-600">Need attention</div>
      </div>
      <div className="bg-yellow-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <Users className="w-5 h-5 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">Unregistered</span>
        </div>
        <div className="text-2xl font-bold text-yellow-600">{performanceMetrics.unregisteredStudents}</div>
        <div className="text-xs text-yellow-600">Missing classes</div>
      </div>
    </div>
  );
}
