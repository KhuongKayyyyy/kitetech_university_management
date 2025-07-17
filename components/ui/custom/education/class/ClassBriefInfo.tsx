import React from "react";

import { ClassModel } from "@/app/api/model/ClassModel";

interface ClassBriefInfoProps {
  classItem: ClassModel;
}

export default function ClassBriefInfo({ classItem }: ClassBriefInfoProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="space-y-4">
        {/* Class Name */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">{classItem.classCode}</h3>
          <p className="text-sm text-gray-500">Class ID: {classItem.id}</p>
        </div>

        {/* Class Details Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Major ID</label>
              <p className="text-sm font-medium text-gray-900">{classItem.majorId}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
