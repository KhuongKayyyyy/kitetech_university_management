"use client";

import * as React from "react";

import { DEFAULT_AVATAR } from "@/app/constants/AppImage";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { RootState } from "@/store/store";
import {
  AudioWaveform,
  Book,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  SchoolIcon,
  Settings2,
  SquareTerminal,
  User,
} from "lucide-react";
import { useSelector } from "react-redux";

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const data = {
    user: userInfo,
    navMain: [
      {
        title: "Users",
        url: "/admin",
        icon: User,
        isActive: true,
        items: [
          {
            title: "Overview",
            url: "/admin/users",
          },
          {
            title: "Student",
            url: "/admin/users/student",
          },
          {
            title: "Teacher",
            url: "/admin/users/teacher",
          },
        ],
      },
      {
        title: "Education",
        url: "#",
        icon: Book,
        items: [
          {
            title: "Department",
            url: "/admin/education/department",
          },
          {
            title: "Major",
            url: "/admin/education/major",
          },

          {
            title: "Subject",
            url: "/admin/education/subject",
          },
          {
            title: "Curriculum",
            url: "/admin/education/curriculum",
          },
          {
            title: "Class",
            url: "/admin/education/class",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: Settings2,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: Frame,
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: PieChart,
      },
      {
        name: "Travel",
        url: "#",
        icon: Map,
      },
    ],
  };

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
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>{userInfo && <NavUser user={userInfo} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
