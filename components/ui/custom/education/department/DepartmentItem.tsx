import React, { useMemo } from 'react'
import {
    Calculator,
    DraftingCompass,
    LampWallDown,
    ScanEyeIcon,
    TextSearchIcon,
} from 'lucide-react'
import { Department } from '@/app/api/model/model'
import { Card } from '../../../card'
import { DepartmentDialog } from './DepartmentDialog'

const iconColors = [
    { bg: 'bg-red-100', text: 'text-red-600' },
    { bg: 'bg-yellow-100', text: 'text-yellow-600' },
    { bg: 'bg-green-100', text: 'text-green-600' },
    { bg: 'bg-blue-100', text: 'text-blue-600' },
    { bg: 'bg-purple-100', text: 'text-purple-600' },
    { bg: 'bg-pink-100', text: 'text-pink-600' },
    { bg: 'bg-teal-100', text: 'text-teal-600' },
    { bg: 'bg-orange-100', text: 'text-orange-600' },
]

// 🔥 Icon map declared inline in the same file
const iconMap = {
    Calculator,
    DraftingCompass,
    LampWallDown,
    ScanEyeIcon,
    TextSearchIcon,
}

const DepartmentItem = ({ department }: { department: Department }) => {
    const { bg, text } = useMemo(() => {
        const random = Math.floor(Math.random() * iconColors.length)
        return iconColors[random]
    }, [])

    // 🔁 Resolve the icon from the string
    const Icon = iconMap[department.icon as keyof typeof iconMap]

    return (
        <Card className="relative flex items-center flex-row px-6 py-4 sm:px-8 md:px-10 max-w-full overflow-hidden">
            <div className={`flex items-center justify-center w-12 h-12 rounded-full shrink-0 ${bg}`}>
                {Icon && <Icon className={`w-6 h-6 ${text}`} strokeWidth={2} />}
            </div>
            <div className="flex flex-col gap-1 ml-4 overflow-hidden">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold leading-tight break-words">
                    {department.name}
                </h1>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground break-words">
                    {department.majors.length} majors
                </p>
            </div>
            <DepartmentDialog department={department} isIcon={true} />
        </Card>
    )
}

export default DepartmentItem
