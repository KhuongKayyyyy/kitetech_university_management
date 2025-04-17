
import React from 'react'
import { departmentData, departments, majors } from '@/app/api/fakedata'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import DepartmentItem from '@/components/ui/custom/education/department/DepartmentItem'
import MajorItem from '@/components/ui/custom/education/major/MajorItem'
import { DepartmentTable } from '@/components/ui/custom/education/department/DepartmentTable'
const page = () => {
    return (
        <div className="px-5 bg-primary-foreground py-5 min-h-screen">
            <div className="flex flex-col sm:flex-row justify-between items-center pb-5">
                <h1 className="text-4xl font-extrabold">Department Management</h1>
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

            {/* Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {/* Example: render multiple DepartmentItem components */}
                {departmentData.map((department) => (
                    <DepartmentItem
                        key={department.id}
                        department={department}
                    />
                ))}
            </div>
            <h1 className="text-2xl font-bold py-5">Data table</h1>
            <DepartmentTable departments={departmentData}></DepartmentTable>
        </div>
    )
}

export default page