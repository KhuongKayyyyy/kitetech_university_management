import React from 'react'
import { Card } from '../../../card'
import { Button } from '../../../button'
import { X } from 'lucide-react'

interface Teacher {
    name: string
}

const TeachDetailInformation: React.FC<{ teacher: Teacher; onClose: () => void }> = ({
    teacher,
    onClose,
}) => {
    return (
        <>
            {/* Overlay for mobile */}
            <div
                className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                onClick={onClose}
            />

            {/* Drawer-style panel */}
            <div
                className={`
                    fixed z-50 inset-y-0 right-0 w-full max-w-md bg-white dark:bg-background
                    shadow-lg p-4 transition-transform duration-300 ease-in-out
                    transform lg:static lg:transform-none lg:shadow-none lg:bg-transparent
                `}
            >
                <Card className="relative w-full p-4 h-full">
                    <h2 className="text-xl font-bold mb-2">{teacher.name}</h2>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={onClose}
                    >
                        <X size={16} />
                    </Button>
                    <p className="text-muted-foreground">Detail content goes here</p>
                </Card>
            </div>
        </>
    )
}

export default TeachDetailInformation
