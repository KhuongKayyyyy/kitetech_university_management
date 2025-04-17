import React from 'react'
import { Card } from '../../../card'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Teacher } from '@/app/api/model/teacher';
import { TeacherDetailDialog } from './TeacherDetailDialog';

const TeacherItem = ({ teacher }: { teacher: Teacher }) => {
    return (
        <Card className="!flex-row items-center justify-center gap-6 p-6 !h-[150px] md:h-[20vh] bg-white w-full">
            <div className="shrink-0">
                <Avatar className="w-25 h-25">
                    <AvatarImage src="https://i.pravatar.cc/100?img=12" alt="Teacher Avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                </Avatar>
            </div>
            <div className="flex flex-col justify-center items-start">
                <h3 className="text-lg font-semibold">{teacher.name}</h3>
                <p className="text-sm text-muted-foreground py-2">Senior Lecturer</p>
                {/* <Button
                    variant="link"
                    className="p-0 h-auto text-sm text-primary"
                    onClick={onViewProfile}
                >
                    View profile
                </Button> */}
                <TeacherDetailDialog teacher={teacher}></TeacherDetailDialog>
            </div>
        </Card>
    )
}

export default TeacherItem
