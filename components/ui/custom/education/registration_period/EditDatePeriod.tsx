import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditDatePeriodProps {
  requiredFutureDate?: boolean;
  currentDate?: Date;
  onDateSelected: (date: Date) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function EditDatePeriod({
  requiredFutureDate,
  currentDate,
  onDateSelected,
  open,
  setOpen,
}: EditDatePeriodProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(currentDate);

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
  };

  const handleSave = () => {
    if (selectedDate) {
      onDateSelected(selectedDate);
      setOpen(false);
    }
  };

  const handleCancel = () => {
    setSelectedDate(currentDate);
    setOpen(false);
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Date Period</DialogTitle>
          <DialogDescription>Select a new date for the registration period.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-center py-4">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            className="rounded-md border"
            disabled={requiredFutureDate ? (date) => date < today : undefined}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!selectedDate}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
