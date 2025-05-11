import React from 'react'
import ClassItem from './ClassItem'

const TeacherClassSession = () => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {Array.from({ length: 20 }).map((_, index) => (
                <ClassItem key={index} />
            ))}
        </div>
    )
}

export default TeacherClassSession