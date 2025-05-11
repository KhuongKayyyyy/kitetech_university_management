import React from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { BookOpen, Calendar, Clock, MoreVertical, Star, Users } from "lucide-react";
import Image from "next/image";

const ClassItem = () => {
  return (
    <Card className="overflow-hidden shadow-md rounded-lg border-t-4 border-t-blue-600 hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]">
      <div className="absolute top-0 right-0">
        <Badge variant="outline" className="bg-blue-50 text-blue-700 m-2 font-medium">
          Spring 2023
        </Badge>
      </div>

      <CardHeader className="pt-5 pb-0 px-5">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            Introduction to Python
            <Star size={16} className="text-yellow-400 fill-yellow-400" />
          </h3>
          <button className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors">
            <MoreVertical size={18} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
          <span className="font-medium text-blue-600">CS101</span> - Computer Science
        </p>
      </CardHeader>

      <CardContent className="px-5 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Calendar size={16} className="text-green-600" />
          <span>Mon, Wed, Fri</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Clock size={16} className="text-orange-600" />
          <span>10:30 AM - 12:00 PM</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} className="text-purple-600" />
          <span>18 students enrolled</span>
        </div>
      </CardContent>

      <div className="px-5 pb-3">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
      </div>

      <CardFooter className="px-5 pb-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center shadow-sm">
            <BookOpen size={16} className="text-blue-600" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-gray-700">3 assignments due</span>
            <span className="text-xs text-gray-500">Next due: Tomorrow</span>
          </div>
        </div>
        <div className="flex -space-x-2">
          <img
            src="https://i.pravatar.cc/32?u=student1"
            alt="Student"
            className="h-7 w-7 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
          />
          <img
            src="https://i.pravatar.cc/32?u=student2"
            alt="Student"
            className="h-7 w-7 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform"
          />
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-white flex items-center justify-center shadow-sm">
            <span className="text-xs font-medium text-blue-600">+16</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ClassItem;
