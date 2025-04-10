import Database from '@/components/ui/Database'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import React from 'react'

const page = () => {
    return (
        <>
            <div className='px-5'>
                <h1 className='text-4xl font-extrabold pb-5'>
                    Student Database
                </h1>
                <Sheet>
                    <SheetTrigger>Open</SheetTrigger>
                    <SheetContent className="w-[400px] sm:w-[540px]">
                        <SheetHeader>
                            <SheetTitle>Are you absolutely sure?</SheetTitle>
                            <SheetDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
                <Database></Database>
            </div>

        </>
    )
}

export default page