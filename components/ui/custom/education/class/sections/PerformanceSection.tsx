"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { Award, BarChart3, BookOpen, Calendar, TrendingUp } from "lucide-react";

interface PerformanceSectionProps {
  classId: string;
}

export default function PerformanceSection({ classId }: PerformanceSectionProps) {
  // Mock performance data
  const performanceMetrics = {
    averageGrade: 8.2,
    passRate: 92.5,
    totalAssignments: 12,
    completedAssignments: 8,
    upcomingExams: 2,
    recentActivity: [
      { type: "assignment", title: "Database Design Project", date: "2024-01-15", status: "submitted" },
      { type: "exam", title: "Midterm Exam", date: "2024-01-20", status: "upcoming" },
      { type: "quiz", title: "SQL Quiz #3", date: "2024-01-10", status: "graded" },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Performance Analytics</h2>
              <p className="text-gray-600">Comprehensive class performance insights</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Export Report
            </Button>
            <Button size="sm" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              View Details
            </Button>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">Assignments</span>
            </div>
            <div className="text-2xl font-bold text-yellow-600">
              {performanceMetrics.completedAssignments}/{performanceMetrics.totalAssignments}
            </div>
            <div className="text-xs text-yellow-600">66% completion rate</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Upcoming Exams</span>
            </div>
            <div className="text-2xl font-bold text-purple-600">{performanceMetrics.upcomingExams}</div>
            <div className="text-xs text-purple-600">Next: Jan 20, 2024</div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {performanceMetrics.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-lg ${
                    activity.type === "assignment"
                      ? "bg-blue-100"
                      : activity.type === "exam"
                        ? "bg-red-100"
                        : "bg-green-100"
                  }`}
                >
                  {activity.type === "assignment" && <BookOpen className="w-4 h-4 text-blue-600" />}
                  {activity.type === "exam" && <Award className="w-4 h-4 text-red-600" />}
                  {activity.type === "quiz" && <TrendingUp className="w-4 h-4 text-green-600" />}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{activity.title}</div>
                  <div className="text-sm text-gray-600">{activity.date}</div>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  activity.status === "submitted"
                    ? "bg-green-100 text-green-800"
                    : activity.status === "upcoming"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-blue-100 text-blue-800"
                }`}
              >
                {activity.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Charts Placeholder */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="text-center py-8">
          <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Detailed Analytics Coming Soon</h3>
          <p className="text-gray-600">Advanced performance charts and detailed analytics will be available here.</p>
          <Button className="mt-4" variant="outline">
            Request Beta Access
          </Button>
        </div>
      </div>
    </div>
  );
}
