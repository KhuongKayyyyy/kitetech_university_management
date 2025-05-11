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
  FileText,
  GraduationCap,
  MessageSquare,
  Paperclip,
  Plus,
  Send,
  Settings,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";

const ClassPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("stream");
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
    students: 18,
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
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
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
          <Button
            variant="outline"
            size="sm"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
          >
            <Settings size={16} className="mr-2" />
            Settings
          </Button>
          <Button size="sm" className="bg-white text-blue-700 hover:bg-white/90">
            <GraduationCap size={16} className="mr-2" />
            Course Materials
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="stream" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-white border shadow-sm p-1 rounded-lg">
              <TabsTrigger value="stream" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Stream
              </TabsTrigger>
              <TabsTrigger
                value="classwork"
                className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
              >
                Classwork
              </TabsTrigger>
              <TabsTrigger value="people" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                People
              </TabsTrigger>
              <TabsTrigger value="grades" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
                Grades
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stream">
              {/* Announcement Form */}
              <Card className="mb-6 border-none shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <form onSubmit={handleAnnouncementSubmit}>
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                        <AvatarImage src="https://i.pravatar.cc/40?u=teacher1" alt="Teacher" />
                        <AvatarFallback className="bg-blue-100 text-blue-700">TS</AvatarFallback>
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

            <TabsContent value="classwork">
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

            <TabsContent value="people">
              <Card className="border-none shadow-md">
                <CardHeader className="border-b bg-gray-50">
                  <CardTitle className="text-gray-800">Class Members</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <h3 className="font-medium mb-3 text-blue-700 flex items-center">
                    <Users size={16} className="mr-2" /> Teachers (1)
                  </h3>
                  <div className="flex items-center gap-3 p-4 border-b rounded-lg bg-gray-50 mb-4">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage src="https://i.pravatar.cc/40?u=teacher1" alt="Dr. Smith" />
                      <AvatarFallback className="bg-blue-100 text-blue-700">DS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium text-gray-800">Dr. Smith</h4>
                      <p className="text-sm text-gray-500">john.smith@university.edu</p>
                    </div>
                  </div>

                  <h3 className="font-medium mt-6 mb-3 text-blue-700 flex items-center">
                    <Users size={16} className="mr-2" /> Students ({classData.students})
                  </h3>
                  <div className="space-y-2 rounded-lg border overflow-hidden">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center gap-3 p-4 border-b hover:bg-gray-50 transition-colors">
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                          <AvatarImage src={`https://i.pravatar.cc/40?u=student${i}`} alt={`Student ${i + 1}`} />
                          <AvatarFallback className="bg-gray-100 text-gray-700">S{i + 1}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium text-gray-800">Student {i + 1}</h4>
                          <p className="text-sm text-gray-500">student{i + 1}@university.edu</p>
                        </div>
                      </div>
                    ))}
                    {classData.students > 5 && (
                      <Button
                        variant="outline"
                        className="w-full rounded-none border-0 border-t text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <ChevronDown size={16} className="mr-2" />
                        Show more students
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="grades">
              <Card className="border-none shadow-md">
                <CardHeader className="border-b bg-gray-50">
                  <CardTitle className="text-gray-800">Grades</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <p className="text-gray-600 mb-4 bg-blue-50 p-3 rounded-lg border border-blue-100 flex items-center">
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
                      className="text-blue-600 mr-2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                    View and manage student grades for all assignments.
                  </p>
                  <div className="border rounded-lg overflow-hidden shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Student
                          </th>
                          {classData.assignments.map((assignment) => (
                            <th
                              key={assignment.id}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {assignment.title}
                            </th>
                          ))}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Overall
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-8 w-8">
                                  <img
                                    className="h-8 w-8 rounded-full border border-gray-200"
                                    src={`https://i.pravatar.cc/32?u=student${i}`}
                                    alt=""
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">Student {i + 1}</div>
                                </div>
                              </div>
                            </td>
                            {classData.assignments.map((assignment) => {
                              const score = Math.floor(Math.random() * 30) + 70;
                              return (
                                <td key={assignment.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  <span
                                    className={`px-2 py-1 rounded-full ${score >= 80 ? "bg-green-100 text-green-800" : score >= 70 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                                  >
                                    {score}/100
                                  </span>
                                </td>
                              );
                            })}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 font-medium">
                                {Math.floor(Math.random() * 15) + 80}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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

export default ClassPage;
