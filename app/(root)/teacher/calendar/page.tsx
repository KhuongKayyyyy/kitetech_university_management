"use client";

import React, { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, FileText, Plus, Users } from "lucide-react";

// Mock data for events
const events = [
  {
    id: 1,
    title: "CS101 Lecture",
    date: "2025-05-10T10:30:00",
    type: "class",
    location: "Room 302",
    description: "Introduction to Python Programming",
  },
  {
    id: 2,
    title: "Office Hours",
    date: "2025-05-10T14:00:00",
    type: "office-hours",
    location: "Faculty Office",
    description: "Open office hours for student questions",
  },
  {
    id: 3,
    title: "Assignment Due: Variables",
    date: "2025-05-11T23:59:00",
    type: "assignment",
    course: "CS101",
    description: "Assignment on variables and data types",
  },
  {
    id: 4,
    title: "Department Meeting",
    date: "2025-05-12T13:00:00",
    type: "meeting",
    location: "Conference Room",
    description: "Monthly department meeting",
  },
  {
    id: 5,
    title: "Midterm Exam",
    date: "2025-05-13T09:00:00",
    type: "exam",
    location: "Exam Hall",
    course: "CS101",
    description: "Midterm examination",
  },
];

const CalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("month");

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get events for selected date
  const selectedDateEvents = events.filter((event) => {
    const eventDate = parseISO(event.date);
    return isSameDay(eventDate, selectedDate);
  });

  // Get events for the month
  const monthEvents = events.filter((event) => {
    const eventDate = parseISO(event.date);
    return isSameMonth(eventDate, currentDate);
  });

  // Function to get event type color
  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "class":
        return "bg-blue-100 text-blue-700";
      case "office-hours":
        return "bg-green-100 text-green-700";
      case "assignment":
        return "bg-amber-100 text-amber-700";
      case "meeting":
        return "bg-purple-100 text-purple-700";
      case "exam":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "class":
        return <Users size={14} />;
      case "office-hours":
        return <Clock size={14} />;
      case "assignment":
        return <FileText size={14} />;
      case "meeting":
        return <Users size={14} />;
      case "exam":
        return <FileText size={14} />;
      default:
        return <CalendarIcon size={14} />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Calendar</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus size={16} className="mr-2" />
          Add Event
        </Button>
      </div>

      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="mb-6 bg-white border shadow-sm p-1 rounded-lg">
          <TabsTrigger value="calendar" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Calendar
          </TabsTrigger>
          <TabsTrigger value="schedule" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Schedule
          </TabsTrigger>
          <TabsTrigger value="assignments" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
            Assignments
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="shadow-md">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-bold text-gray-800">
                      {format(currentDate, "MMMM yyyy")}
                    </CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={prevMonth}>
                        <ChevronLeft size={16} />
                      </Button>
                      <Button variant="outline" size="sm" onClick={nextMonth}>
                        <ChevronRight size={16} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Calendar grid header */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                      <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Calendar grid */}
                  <div className="grid grid-cols-7 gap-1">
                    {daysInMonth.map((day, i) => {
                      // Get events for this day
                      const dayEvents = events.filter((event) => {
                        const eventDate = parseISO(event.date);
                        return isSameDay(eventDate, day);
                      });

                      return (
                        <div
                          key={i}
                          className={`min-h-[100px] p-1 border rounded-md ${
                            isSameDay(day, selectedDate)
                              ? "bg-blue-50 border-blue-200"
                              : "hover:bg-gray-50 border-gray-200"
                          } ${isToday(day) ? "border-blue-400" : ""} cursor-pointer transition-colors`}
                          onClick={() => setSelectedDate(day)}
                        >
                          <div
                            className={`text-right text-sm font-medium p-1 rounded-full w-7 h-7 flex items-center justify-center ml-auto ${
                              isToday(day) ? "bg-blue-600 text-white" : ""
                            }`}
                          >
                            {format(day, "d")}
                          </div>
                          <div className="mt-1 space-y-1">
                            {dayEvents.slice(0, 3).map((event) => (
                              <div
                                key={event.id}
                                className={`text-xs p-1 rounded truncate flex items-center ${getEventTypeColor(
                                  event.type,
                                )}`}
                              >
                                <span className="mr-1">{getEventTypeIcon(event.type)}</span>
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="text-xs text-gray-500 pl-1">+{dayEvents.length - 3} more</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="shadow-md mb-6">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gray-800">
                    {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-4">
                      {selectedDateEvents.map((event) => (
                        <div
                          key={event.id}
                          className="p-3 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="font-medium text-gray-800">{event.title}</h3>
                            <Badge className={getEventTypeColor(event.type)} variant="outline">
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{format(parseISO(event.date), "h:mm a")}</p>
                          {event.location && <p className="text-sm text-gray-600">{event.location}</p>}
                          <p className="text-sm text-gray-700 mt-2">{event.description}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No events</h3>
                      <p className="mt-1 text-sm text-gray-500">No events scheduled for this day.</p>
                      <div className="mt-6">
                        <Button size="sm">
                          <Plus size={16} className="mr-2" />
                          Add Event
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader>
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
                    {events
                      .filter((event) => event.type === "assignment" || event.type === "exam")
                      .slice(0, 3)
                      .map((event, index) => (
                        <div
                          key={event.id}
                          className={`flex items-center gap-4 p-4 border rounded-lg ${
                            index === 0 ? "bg-red-50 border-red-100" : ""
                          } hover:shadow-md transition-all duration-200`}
                        >
                          <div
                            className={`h-12 w-12 rounded-full ${
                              index === 0 ? "bg-red-100" : "bg-gray-100"
                            } flex items-center justify-center shadow-sm`}
                          >
                            <FileText size={22} className={index === 0 ? "text-red-600" : "text-gray-600"} />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-800">{event.title}</h4>
                            <p className={`text-sm ${index === 0 ? "text-red-600 font-medium" : "text-gray-600"}`}>
                              Due: {format(parseISO(event.date), "MMM d, h:mm a")}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="schedule">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Your weekly teaching schedule will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assignments">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Assignments Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">Your assignments and due dates will appear here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CalendarPage;
