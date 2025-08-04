"use client";

import React, { useEffect, useState } from "react";

import { UserModel } from "@/app/api/model/UserModel";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UpdateAccountDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  user: UserModel | null;
  onUpdateAccount?: (userData: UserModel) => Promise<void>;
  isUpdating?: boolean;
}

export default function UpdateAccountDialog({
  isOpen,
  setIsOpen,
  user,
  onUpdateAccount,
  isUpdating = false,
}: UpdateAccountDialogProps) {
  const [formData, setFormData] = useState<UserModel>({
    id: 0,
    username: "",
    password: "",
    full_name: "",
    email: "",
  });
  const [errors, setErrors] = useState<Partial<UserModel>>({});

  // Populate form data when user prop changes
  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id || 0,
        username: user.username || "",
        password: "", // Don't pre-fill password for security
        full_name: user.full_name || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof UserModel, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<UserModel> = {};

    if (!formData.username?.trim()) {
      newErrors.username = "Username is required";
    }

    // Only validate password if it's provided (optional for updates)
    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.full_name?.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Call the onUpdateAccount callback if provided
      if (onUpdateAccount) {
        // Create update data - exclude password if empty
        const updateData = { ...formData };
        if (!updateData.password?.trim()) {
          delete updateData.password;
        }

        await onUpdateAccount(updateData);

        // Reset form and close dialog on success
        setFormData({
          id: 0,
          username: "",
          password: "",
          full_name: "",
          email: "",
        });
        setErrors({});
        setIsOpen(false);
      }
    } catch (error) {
      // Error is already handled by the hook, just log for debugging
      console.error("Error updating account:", error);
    }
  };

  const handleCancel = () => {
    setFormData({
      id: 0,
      username: "",
      password: "",
      full_name: "",
      email: "",
    });
    setErrors({});
    setIsOpen(false);
  };

  // Don't render if no user is selected
  if (!user) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Account</DialogTitle>
          <DialogDescription>
            Update the account details below. Leave password empty to keep current password.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username *</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username (e.g., 52100973)"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className={errors.username ? "border-red-500" : ""}
              />
              {errors.username && <p className="text-sm text-red-500">{errors.username}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password (Leave empty to keep current)</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter new password (optional)"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="Enter full name (e.g., Nguyen Dat Khuong)"
                value={formData.full_name}
                onChange={(e) => handleInputChange("full_name", e.target.value)}
                className={errors.full_name ? "border-red-500" : ""}
              />
              {errors.full_name && <p className="text-sm text-red-500">{errors.full_name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email (e.g., 52100973@kitetech.edu.vn)"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isUpdating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Update Account"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
