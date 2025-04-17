
import React from 'react'
import { departmentData, majors } from '@/app/api/fakedata'
import MajorItem from '@/components/ui/custom/education/major/MajorItem'
import { MajorTable } from '@/components/ui/custom/education/major/MajorTable'
const page = () => {
    const allMajors = departmentData.flatMap((dept) => dept.majors);
    return (
        <div className="px-5 bg-primary-foreground py-5 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center pb-5">
                <h1 className="text-4xl font-extrabold">Major Management</h1>
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
            {departmentData.map((department) => (
                <div key={department.id} className="mt-10">
                    <h2 className="text-xl font-semibold mb-4">
                        Majors in {department.name}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {department.majors.map((major) => (
                            <MajorItem key={major.id} major={major} department={department} />
                        ))}
                    </div>
                </div>
            ))}

            <h1 className="text-2xl font-bold py-5">Data table</h1>
            <MajorTable majors={allMajors}></MajorTable>
        </div>
    )
}

export default page