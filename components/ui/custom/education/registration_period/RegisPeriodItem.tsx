import React, { useState } from "react";

import { RegistrationPeriod } from "@/app/api/model/RegistrationPeriodModel";
import { registrationPeriodService } from "@/app/api/services/registrationPeriodService";
import { APP_ROUTES } from "@/constants/AppRoutes";
import { RegisPeriodStatus } from "@/constants/enum/RegisPeriodStatus";
import { AlertCircle, Calendar, CheckCircle, Clock, Edit2, Trash2, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ConfirmDeleteRegistrationPeriodDialog from "./ConfirmDeleteRegistrationPeriodDialog";

interface RegisPeriodItemProps {
  period: RegistrationPeriod;
  onEdit?: (period: RegistrationPeriod) => void;
  onDelete?: (period: RegistrationPeriod) => void;
}

export default function RegisPeriodItem({ period, onEdit, onDelete }: RegisPeriodItemProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 border-emerald-200 shadow-emerald-100";
      case "Closed":
        return "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border-slate-200 shadow-slate-100";
      case "Cancelled":
        return "bg-gradient-to-r from-red-50 to-rose-50 text-red-700 border-red-200 shadow-red-100";
      default:
        return "bg-gradient-to-r from-slate-50 to-gray-50 text-slate-700 border-slate-200 shadow-slate-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Open":
        return <CheckCircle className="h-4 w-4 drop-shadow-sm" />;
      case "Closed":
        return <XCircle className="h-4 w-4 drop-shadow-sm" />;
      case "Cancelled":
        return <AlertCircle className="h-4 w-4 drop-shadow-sm" />;
      default:
        return <Clock className="h-4 w-4 drop-shadow-sm" />;
    }
  };

  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  const router = useRouter();

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Navigating to registration period:", period.id);
    router.push(`${APP_ROUTES.REGISTRATION_PERIOD}/${period.id}?name=${period.description}`);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(period);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true);
      await registrationPeriodService.deleteRegistrationPeriod(period.id);
      onDelete?.(period);
      toast.success("Registration period deleted successfully!");
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting registration period:", error);
      toast.error("Failed to delete registration period. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialogOpen(false);
  };

  return (
    <div className="relative group">
      <div
        onClick={handleCardClick}
        className="bg-gradient-to-br from-white via-white to-slate-50/30 rounded-2xl p-7 border border-gray-200/60 shadow-lg shadow-gray-100/50 hover:shadow-2xl hover:shadow-gray-200/40 hover:border-gray-300/80 transition-all duration-500 hover:scale-[1.02] cursor-pointer transform-gpu backdrop-blur-sm hover:-translate-y-1"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-5">
            {/* Header with Status */}
            <div className="flex items-center gap-4">
              <div
                className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-sm font-semibold border shadow-sm ${getStatusColor(period.status || "Unknown")}`}
              >
                {getStatusIcon(period.status || "Unknown")}
                <span className="tracking-wide">{period.status || "Unknown"}</span>
              </div>
              <span className="text-sm text-slate-600 bg-gradient-to-r from-slate-100 to-gray-100 px-3 py-1.5 rounded-lg font-medium shadow-sm border border-slate-200/50">
                {period.semester?.name || "N/A"}
              </span>
            </div>

            {/* Description */}
            {period.description && (
              <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors duration-300 leading-tight">
                {period.description}
              </h3>
            )}

            {/* Date Range */}
            <div className="flex items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2.5 rounded-xl border border-blue-100 shadow-sm">
                <Calendar className="h-4 w-4 text-blue-500 drop-shadow-sm" />
                <span className="font-semibold text-blue-700">Start:</span>
                <span className="font-medium text-gray-700">{formatDate(period.start_date)}</span>
              </div>
              <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 px-4 py-2.5 rounded-xl border border-orange-100 shadow-sm">
                <Calendar className="h-4 w-4 text-orange-500 drop-shadow-sm" />
                <span className="font-semibold text-orange-700">End:</span>
                <span className="font-medium text-gray-700">{formatDate(period.end_date)}</span>
              </div>
            </div>

            {/* Period ID */}
            <div className="text-xs text-gray-400 font-mono bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 inline-block">
              ID: {period.id}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="absolute top-5 right-5 flex items-center gap-2.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        {onEdit && (
          <button
            onClick={handleEdit}
            className="p-3 bg-gradient-to-r from-white to-blue-50 text-gray-600 hover:text-blue-600 hover:from-blue-50 hover:to-blue-100 border border-gray-200 hover:border-blue-300 rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-200/30 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
            title="Edit registration period"
          >
            <Edit2 className="h-4 w-4 drop-shadow-sm" />
          </button>
        )}
        {onDelete && (
          <button
            onClick={handleDelete}
            className="p-3 bg-gradient-to-r from-white to-red-50 text-gray-600 hover:text-red-600 hover:from-red-50 hover:to-red-100 border border-gray-200 hover:border-red-300 rounded-xl shadow-lg hover:shadow-xl hover:shadow-red-200/30 transition-all duration-300 transform hover:scale-110 backdrop-blur-sm"
            title="Delete registration period"
          >
            <Trash2 className="h-4 w-4 drop-shadow-sm" />
          </button>
        )}
      </div>

      <ConfirmDeleteRegistrationPeriodDialog
        open={deleteDialogOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        registrationPeriod={period}
        isDeleting={isDeleting}
      />
    </div>
  );
}
