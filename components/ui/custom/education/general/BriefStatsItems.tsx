"use client";

import React from "react";

import { Card } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";

interface BriefStatsItemsProps {
  title: string;
  icon: React.ReactNode;
  total: number;
  percentageChange: number;
  isIncrease: boolean;
  unit?: string;
}

export default function BriefStatsItems({
  title,
  icon,
  total,
  percentageChange,
  isIncrease,
  unit = "",
}: BriefStatsItemsProps) {
  return (
    <Card className="h-[140px] p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] cursor-pointer">
      <div className="flex items-center gap-4 h-full">
        <div className="p-4 bg-primary/10 rounded-lg transition-colors duration-300 hover:bg-primary/20">{icon}</div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <div className="flex items-center gap-3">
            <h3 className="text-3xl font-bold text-gray-900">
              {total} {unit}
            </h3>
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full ${
                isIncrease ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
              }`}
            >
              {isIncrease ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              <span className="text-sm font-medium">{percentageChange}%</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
