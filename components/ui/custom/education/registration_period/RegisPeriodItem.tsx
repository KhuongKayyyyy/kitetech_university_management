import React from "react";

import { RegistrationPeriod } from "@/app/api/model/RegistrationPeriodModel";
import { RegisPeriodStatus } from "@/constants/enum/RegisPeriodStatus";
import { AlertCircle, Calendar, CheckCircle, Clock, XCircle } from "lucide-react";

interface RegisPeriodItemProps {
  period: RegistrationPeriod;
  onEdit?: (period: RegistrationPeriod) => void;
  onDelete?: (period: RegistrationPeriod) => void;
}

export default function RegisPeriodItem({ period, onEdit, onDelete }: RegisPeriodItemProps) {
  const getStatusColor = (status: RegisPeriodStatus) => {
    switch (status) {
      case RegisPeriodStatus.Open:
        return "bg-green-100 text-green-800 border-green-200";
      case RegisPeriodStatus.Closed:
        return "bg-gray-100 text-gray-800 border-gray-200";
      case RegisPeriodStatus.Cancelled:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: RegisPeriodStatus) => {
    switch (status) {
      case RegisPeriodStatus.Open:
        return <CheckCircle className="h-4 w-4" />;
      case RegisPeriodStatus.Closed:
        return <XCircle className="h-4 w-4" />;
      case RegisPeriodStatus.Cancelled:
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200/50 shadow-sm hover:shadow-md hover:bg-white/90 transition-all duration-300 hover:scale-[1.02] group">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3">
          {/* Header with Status */}
          <div className="flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(period.status)}`}
            >
              {getStatusIcon(period.status)}
              {period.status}
            </div>
            <span className="text-sm text-gray-500">Semester {period.semesterId}</span>
          </div>

          {/* Description */}
          {period.description && (
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">
              {period.description}
            </h3>
          )}

          {/* Date Range */}
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Start: {formatDate(period.startDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>End: {formatDate(period.endDate)}</span>
            </div>
          </div>

          {/* Period ID */}
          <div className="text-xs text-gray-400">ID: {period.id}</div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {onEdit && (
            <button
              onClick={() => onEdit(period)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit period"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(period)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete period"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
