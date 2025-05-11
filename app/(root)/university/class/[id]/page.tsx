"use client";

import React, { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BookOpen,
  Calendar,
  ChevronDown,
  Clock,
  Clock8,
  FileCheck,
  FileText,
  GraduationCap,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  Settings,
  Users,
} from "lucide-react";
import { useParams } from "next/navigation";

const UniversityClassPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("announcements");
  const [announcement, setAnnouncement] = useState("");

  // Mock data - in a real app, you would fetch this from an API
  const classData = {
    id,
    name: "Introduction to Python Programming",
    code: "CS101",
    department: "Computer Science",
    semester: "Spring 2023",
    schedule: "Mon, Wed, Fri",
    time: "10:30 AM - 12:00 PM",
    students: 25,
    location: "Building A, Room 101",
    instructor: {
      name: "Dr. John Smith",
      email: "john.smith@university.edu",
      avatar: "https://i.pravatar.cc/40?u=teacher1",
    },
    assignments: [
      { id: 1, title: "Variables and Data Types", dueDate: "Tomorrow", status: "pending" },
      { id: 2, title: "Control Flow", dueDate: "Next week", status: "pending" },
      { id: 3, title: "Functions", dueDate: "In 2 weeks", status: "draft" },
    ],
    announcements: [
      {
        id: 1,
        author: "Dr. Smith",
        avatar: "https://i.pravatar.cc/40?u=teacher1",
        date: "Yesterday",
        content: "Remember to submit your assignments by Friday!",
        comments: 3,
      },
      {
        id: 2,
        author: "Dr. Smith",
        avatar: "https://i.pravatar.cc/40?u=teacher1",
        date: "Last week",
        content: "Class will be held online next Monday due to conference.",
        comments: 5,
      },
    ],
    syllabus: {
      description:
        "This course introduces fundamental programming concepts using Python. Students will learn about variables, control structures, functions, and basic data structures.",
      objectives: [
        "Understand programming fundamentals and computational thinking",
        "Write and debug Python programs that solve real-world problems",
        "Apply appropriate data structures in program design",
        "Implement effective algorithms for data processing tasks",
      ],
      textbooks: [
        { title: "Python Programming: An Introduction to Computer Science", author: "John Zelle", required: true },
        { title: "Automate the Boring Stuff with Python", author: "Al Sweigart", required: false },
      ],
    },
    attendance: [
      { date: "2023-09-05", present: 23, absent: 2 },
      { date: "2023-09-07", present: 24, absent: 1 },
      { date: "2023-09-12", present: 22, absent: 3 },
    ],
  };

  const handleAnnouncementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your API
    console.log("New announcement:", announcement);
    setAnnouncement("");
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      {/* Class Header */}
      <div className="relative h-56 rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 mb-8 overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-0 left-0 p-8 text-white">
          <h1 className="text-3xl font-bold tracking-tight">{classData.name}</h1>
          <div className="flex items-center gap-3 mt-3">
            <Badge variant="outline" className="bg-white/20 text-white border-white/30 px-3 py-1 font-medium">
              {classData.code}
            </Badge>
            <span className="text-white/80">•</span>
            <span className="text-white/90 font-medium">{classData.department}</span>
            <span className="text-white/80">•</span>
            <span className="text-white/90 font-medium">{classData.semester}</span>
          </div>
        </div>
        <div className="absolute top-6 right-6 flex gap-3">
          <Button size="sm" className="bg-white text-blue-700 hover:bg-white/90">
            <GraduationCap size={16} className="mr-2" />
            Course Materials
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="announcements" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-white border shadow-sm p-1 rounded-lg">
              <TabsTrigger
                value="announcements"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                Announcements
              </TabsTrigger>
              <TabsTrigger
                value="syllabus"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                Syllabus
              </TabsTrigger>
              <TabsTrigger
                value="assignments"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                Assignments
              </TabsTrigger>
              <TabsTrigger
                value="materials"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                Materials
              </TabsTrigger>
              <TabsTrigger
                value="attendance"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                Attendance
              </TabsTrigger>
              <TabsTrigger
                value="students"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                Students
              </TabsTrigger>
            </TabsList>

            <TabsContent value="announcements">
              {/* Announcement Form */}
              <Card className="mb-6 border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <form onSubmit={handleAnnouncementSubmit}>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={classData.instructor.avatar} alt={classData.instructor.name} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">
                          {classData.instructor.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Input
                          placeholder="Announce something to your class..."
                          className="mb-3 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          value={announcement}
                          onChange={(e) => setAnnouncement(e.target.value)}
                        />
                        <div className="flex justify-between items-center">
                          <Button
                            variant="outline"
                            size="sm"
                            type="button"
                            className="text-gray-600 hover:text-blue-600 hover:border-blue-300"
                          >
                            <Paperclip size={16} className="mr-2" />
                            Attach
                          </Button>
                          <Button
                            size="sm"
                            type="submit"
                            disabled={!announcement.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <Send size={16} className="mr-2" />
                            Post
                          </Button>
                        </div>
                      </div>
                    </div>
                  </form>
                </CardContent>
              </Card>

              {/* Announcements */}
              {classData.announcements.map((announcement) => (
                <Card
                  key={announcement.id}
                  className="mb-5 overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src={announcement.avatar} alt={announcement.author} />
                        <AvatarFallback className="bg-blue-100 text-blue-700">{announcement.author[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold text-gray-800">{announcement.author}</h3>
                          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                            {announcement.date}
                          </span>
                        </div>
                        <p className="text-gray-700 mb-4 leading-relaxed">{announcement.content}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                          >
                            <MessageSquare size={16} className="mr-1" />
                            {announcement.comments} comments
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="syllabus">
              <Card className="border-none shadow-md">
                <CardHeader className="border-b bg-gray-50">
                  <CardTitle className="text-gray-800">Course Syllabus</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Course Description</h3>
                      <p className="text-gray-700 leading-relaxed">{classData.syllabus.description}</p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Learning Objectives</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {classData.syllabus.objectives.map((objective, index) => (
                          <li key={index} className="leading-relaxed">
                            {objective}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Textbooks</h3>
                      <div className="space-y-3">
                        {classData.syllabus.textbooks.map((book, index) => (
                          <div
                            key={index}
                            className="flex items-start border-l-4 pl-4 py-2 border-blue-500 bg-blue-50 rounded-r-lg"
                          >
                            <div>
                              <h4 className="font-medium text-gray-800">{book.title}</h4>
                              <p className="text-sm text-gray-600">by {book.author}</p>
                              <Badge
                                className={
                                  book.required ? "bg-blue-100 text-blue-800 mt-2" : "bg-gray-100 text-gray-800 mt-2"
                                }
                              >
                                {book.required ? "Required" : "Optional"}
                              </Badge>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assignments">
              <Card className="border-none shadow-md">
                <CardHeader className="border-b bg-gray-50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-gray-800">Assignments</CardTitle>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus size={16} className="mr-2" />
                      Create
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {classData.assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-blue-50 transition-colors cursor-pointer group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shadow-sm group-hover:bg-blue-200 transition-colors">
                            <FileText size={22} className="text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{assignment.title}</h4>
                            <p className="text-sm text-gray-500">Due: {assignment.dueDate}</p>
                          </div>
                        </div>
                        <Badge
                          variant={assignment.status === "pending" ? "default" : "outline"}
                          className={
                            assignment.status === "pending"
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "border-gray-300 text-gray-600"
                          }
                        >
                          {assignment.status === "pending" ? "Assigned" : "Draft"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="materials">
              <Card className="border-none shadow-md">
                <CardHeader className="border-b bg-gray-50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-gray-800">Course Materials</CardTitle>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus size={16} className="mr-2" />
                      Upload
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-700">Week 1: Introduction to Python</h3>
                    <div className="space-y-2 pl-4 mb-6">
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-blue-600" />
                          <span className="text-gray-800">Lecture Slides - Introduction to Python.pdf</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-green-600" />
                          <span className="text-gray-800">Lab 1 - Setting up Python.docx</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>

                    <h3 className="font-medium text-gray-700">Week 2: Variables and Data Types</h3>
                    <div className="space-y-2 pl-4 mb-6">
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-blue-600" />
                          <span className="text-gray-800">Lecture Slides - Variables and Data Types.pdf</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-3">
                          <FileText size={18} className="text-purple-600" />
                          <span className="text-gray-800">Code Examples - Variables.py</span>
                        </div>
                        <Button variant="outline" size="sm">
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="attendance">
              <Card className="border-none shadow-md">
                <CardHeader className="border-b bg-gray-50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-gray-800">Attendance Records</CardTitle>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <FileCheck size={16} className="mr-2" />
                      Take Attendance
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <Clock8 size={18} className="text-blue-600" />
                        <h3 className="font-medium text-gray-800">Recent Sessions</h3>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Export
                        </Button>
                        <Button variant="outline" size="sm">
                          Print
                        </Button>
                      </div>
                    </div>

                    <div className="border rounded-lg overflow-hidden shadow-sm">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Present
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Absent
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Attendance Rate
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {classData.attendance.map((record, index) => {
                            const date = new Date(record.date);
                            const formattedDate = date.toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            });
                            const attendanceRate = Math.round(
                              (record.present / (record.present + record.absent)) * 100,
                            );

                            return (
                              <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{formattedDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.present}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.absent}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`px-2 py-1 rounded-full ${attendanceRate >= 90 ? "bg-green-100 text-green-800" : attendanceRate >= 80 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                                  >
                                    {attendanceRate}%
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                                    View Details
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="students">
              <Card className="border-none shadow-md">
                <CardHeader className="border-b bg-gray-50">
                  <CardTitle className="text-gray-800">Enrolled Students</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="mb-4 flex justify-between items-center">
                    <div className="relative w-64">
                      <Input placeholder="Search students..." className="pl-10" />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      >
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                    </div>
                    <Button variant="outline" size="sm">
                      Export List
                    </Button>
                  </div>

                  <div className="space-y-2 rounded-lg border overflow-hidden">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-4 border-b hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarImage src={`https://i.pravatar.cc/40?u=student${i}`} alt={`Student ${i + 1}`} />
                            <AvatarFallback className="bg-gray-100 text-gray-700">S{i + 1}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-medium text-gray-800">Student {i + 1}</h4>
                            <p className="text-sm text-gray-500">student{i + 1}@university.edu</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            ID: S{2023100 + i}
                          </Badge>
                          <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-800">
                            View Profile
                          </Button>
                        </div>
                      </div>
                    ))}
                    {classData.students > 8 && (
                      <Button
                        variant="outline"
                        className="w-full rounded-none border-0 border-t text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <ChevronDown size={16} className="mr-2" />
                        Show all {classData.students} students
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="border-b bg-gray-50 pb-4">
              <CardTitle className="text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-blue-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 8v8" />
                  <path d="M8 12h8" />
                </svg>
                Class Information
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-5">
                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
                    <Calendar size={22} className="text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Schedule</h4>
                    <p className="text-sm text-gray-600">{classData.schedule}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center shadow-sm">
                    <Clock size={22} className="text-orange-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Time</h4>
                    <p className="text-sm text-gray-600">{classData.time}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Location</h4>
                    <p className="text-sm text-gray-600">{classData.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center shadow-sm">
                    <Users size={22} className="text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Students</h4>
                    <p className="text-sm text-gray-600">{classData.students} enrolled</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center shadow-sm">
                    <BookOpen size={22} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">Assignments</h4>
                    <p className="text-sm text-gray-600">{classData.assignments.length} total</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md overflow-hidden">
            <CardHeader className="border-b bg-gray-50 pb-4">
              <CardTitle className="text-gray-800 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-2 text-red-600"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                Upcoming Due Dates
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {classData.assignments.map((assignment, index) => (
                  <div
                    key={assignment.id}
                    className={`flex items-center gap-4 p-4 border rounded-lg ${index === 0 ? "bg-red-50 border-red-100" : ""} hover:shadow-md transition-all duration-200`}
                  >
                    <div
                      className={`h-12 w-12 rounded-full ${index === 0 ? "bg-red-100" : "bg-gray-100"} flex items-center justify-center shadow-sm`}
                    >
                      <FileText size={22} className={index === 0 ? "text-red-600" : "text-gray-600"} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">{assignment.title}</h4>
                      <p className={`text-sm ${index === 0 ? "text-red-600 font-medium" : "text-gray-600"}`}>
                        Due: {assignment.dueDate}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UniversityClassPage;
