"use client"

import * as React from "react"
import {
    LayoutDashboard,
    Users,
    CalendarDays,
    User,
    SchoolIcon,
} from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar"
import { DEFAULT_AVATAR } from "@/app/constants/AppImage"
import { NavUser } from "@/components/nav-user"

const data = {
    user: {
        name: "Nguyễn Đạt Khương",
        email: "zzkhngzz@gmail.com",
        avatar: DEFAULT_AVATAR,
    },
    items: [
        {
            title: "Dashboard",
            url: "/teacher/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Class",
            url: "/teacher/class",
            icon: Users,
        },
        {
            title: "Calendar",
            url: "/teacher/calendar",
            icon: CalendarDays,
        },
        {
            title: "My Profile",
            url: "/teacher/profile",
            icon: User,
        },
    ],
}

export function TeacherSideBar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="#">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                                    <SchoolIcon className="size-4" />
                                </div>
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-semibold">KiteTech</span>
                                    <span>v1.0.0</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu>
                    {data.items.map(({ title, url, icon: Icon }) => (
                        <SidebarMenuItem key={title}>
                            <SidebarMenuButton asChild>
                                <a href={url} className="flex items-center gap-2">
                                    <Icon className="size-5" />
                                    <span>{title}</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    )
}
