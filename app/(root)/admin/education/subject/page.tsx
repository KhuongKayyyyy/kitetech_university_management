"use client";

import React from "react";
import { departmentData } from "@/app/api/fakedata";
import { SubjectTable } from "@/components/ui/custom/education/subject/SubjectTable";
import SubjectItem from "@/components/ui/custom/education/subject/SubjectItem";
import { Subject } from "@/app/api/model/model";
import { subjects } from "@/app/api/fakedata";

// Helper to flatten all majors and map by ID
const getMajorMap = () => {
    const majorMap = new Map<number, { major: any; departmentName: string }>();
    departmentData.forEach((dept) => {
        dept.majors.forEach((major) => {
            majorMap.set(major.id, {
                major,
                departmentName: dept.name,
            });
        });
    });
    return majorMap;
};

const SubjectPage = () => {
    const majorMap = getMajorMap();

    // Group subjects by majorId
    const groupedSubjects: { [majorId: number]: Subject[] } = {};
    subjects.forEach((subject) => {
        if (!groupedSubjects[subject.majorId]) {
            groupedSubjects[subject.majorId] = [];
        }
        groupedSubjects[subject.majorId].push(subject);
    });

    return (

        <div className="px-5 bg-primary-foreground py-5 min-h-screen">
            <h1 className="text-4xl font-extrabold">Subject Management</h1>
            <h1 className="text-2xl font-bold py-5">Data Table</h1>
            <SubjectTable subjects={subjects} />
            <div className="flex flex-col sm:flex-row justify-between items-center pb-5">
                <div className="flex items-center space-x-3">
                    <label htmlFor="year-picker" className="text-sm font-medium">
                        Select Year:
                    </label>
                    <select
                        id="year-picker"
                        className="border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                        <option value="2023">2023</option>
                        <option value="2024">2024</option>
                        <option value="2025">2025</option>
                        <option value="2026">2026</option>
                    </select>
                </div>
            </div>

            {Object.entries(groupedSubjects).map(([majorId, subjectList]) => {
                const majorInfo = majorMap.get(Number(majorId));
                if (!majorInfo) return null;

                return (
                    <div key={majorId} className="mt-10">
                        <h2 className="text-xl font-semibold mb-2 text-primary">
                            Subjects in {majorInfo.major.name}
                        </h2>
                        <p className="text-sm text-muted-foreground mb-4">
                            Department: {majorInfo.departmentName}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {subjectList.map((subject) => (
                                <SubjectItem key={subject.id} subject={subject} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default SubjectPage;
