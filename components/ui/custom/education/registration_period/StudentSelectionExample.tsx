"use client";

import React, { useState } from "react";

import { UserModel } from "@/app/api/model/UserModel";
import { Button } from "@/components/ui/button";
import { UserPlus, Users } from "lucide-react";
import { toast } from "sonner";

import AvailableStudentToAdd from "./AvailableStudentToAdd";

/**
 * Example component showing how to use the AvailableStudentToAdd dialog
 * This can be integrated into any parent component that needs student selection
 */
export default function StudentSelectionExample() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<UserModel[]>([]);
  const [alreadySelectedIds] = useState<number[]>([1, 2, 3]); // Example: IDs of already selected students

  const handleStudentsSelected = (students: UserModel[]) => {
    setSelectedStudents(students);
    console.log("Selected students:", students);

    // Here you can add your logic to handle the selected students
    // For example, add them to a course, registration period, etc.

    // Example: Show selected student names
    const studentNames = students.map((s) => s.full_name || s.username).join(", ");
    toast.success(`Selected: ${studentNames}`);
  };

  const handleRemoveStudent = (studentId: number) => {
    setSelectedStudents((prev) => prev.filter((s) => s.id !== studentId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Student Selection Example</h3>
        <Button onClick={() => setIsDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Students
        </Button>
      </div>

      {/* Selected Students Display */}
      {selectedStudents.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-2">Selected Students ({selectedStudents.length})</h4>
          <div className="space-y-2">
            {selectedStudents.map((student) => (
              <div key={student.id} className="flex items-center justify-between bg-white rounded-md p-3 border">
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium text-gray-900">{student.full_name || "N/A"}</p>
                    <p className="text-sm text-gray-600">
                      {student.username} • {student.email}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveStudent(student.id!)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student Selection Dialog */}
      <AvailableStudentToAdd
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onStudentsSelected={handleStudentsSelected}
        alreadySelectedStudentIds={alreadySelectedIds}
        title="Select Students for Registration"
        description="Choose students to add to the registration period. Only active students with 'student' role are shown."
      />
    </div>
  );
}
