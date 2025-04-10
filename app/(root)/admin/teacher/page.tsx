import Database from '@/components/ui/Database'
import React from 'react'

const page = () => {
    return (
        <>
            <div className='px-5'>
                <h1 className='text-4xl font-extrabold pb-5'>
                    Teacher Database
                </h1>
                <Database></Database>
            </div>

        </>
    )
}

export default page