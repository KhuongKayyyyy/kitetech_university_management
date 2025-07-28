"use client";

import React, { useState } from "react";

import { RoleModel } from "@/app/api/model/RoleModel";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Edit, X } from "lucide-react";

interface Permission {
  name: string;
  actions: string[];
}

const permissions: Permission[] = [
  {
    name: "Account Management",
    actions: ["View", "Add", "Edit", "Delete"],
  },
  {
    name: "Role Management",
    actions: ["View", "Add", "Edit", "Delete"],
  },
  {
    name: "Class Management",
    actions: ["View", "Add", "Edit", "Delete"],
  },
  {
    name: "Student Management",
    actions: ["View", "Add", "Edit", "Delete"],
  },
  {
    name: "Teacher Management",
    actions: ["View", "Add", "Edit", "Delete"],
  },
  {
    name: "Class Management",
    actions: ["Create Meeting Room", "Join Meeting Room"],
  },
];

interface RoleDetailDialogProps {
  role: RoleModel;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export default function RoleDetailDialog({ role, open, onOpenChange, trigger }: RoleDetailDialogProps) {
  const [name, setName] = useState(role.name);
  const [description, setDescription] = useState(role.description);
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, string[]>>(() => {
    // Initialize with existing role permissions
    const initial: Record<string, string[]> = {};
    if (role.permissions) {
      role.permissions.forEach((permission) => {
        // Simple mapping - you might need to adjust this based on your data structure
        const permissionName = permission.includes("Management") ? permission : permission + " Management";
        initial[permissionName] = ["View"]; // Default to View, adjust as needed
      });
    }
    return initial;
  });

  const handlePermissionChange = (permissionName: string, action: string, checked: boolean) => {
    setSelectedPermissions((prev) => {
      const current = prev[permissionName] || [];
      if (checked) {
        return {
          ...prev,
          [permissionName]: [...current, action],
        };
      } else {
        return {
          ...prev,
          [permissionName]: current.filter((a) => a !== action),
        };
      }
    });
  };

  const handleCancel = () => {
    setName(role.name);
    setDescription(role.description);
    // Reset permissions to original
    const initial: Record<string, string[]> = {};
    if (role.permissions) {
      role.permissions.forEach((permission) => {
        const permissionName = permission.includes("Management") ? permission : permission + " Management";
        initial[permissionName] = ["View"];
      });
    }
    setSelectedPermissions(initial);
    onOpenChange?.(false);
  };

  const handleSave = () => {
    // Handle saving the role here
    console.log({ id: role.id, name, description, permissions: selectedPermissions });
    onOpenChange?.(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Edit role
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => onOpenChange?.(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">
              Name <span className="text-red-500">*</span>
            </Label>
            <Input id="name" placeholder="Input name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Input description"
              className="min-h-[80px] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <Label>Permissions</Label>
            <div className="space-y-3">
              {permissions.map((permission) => (
                <div key={permission.name} className="space-y-2">
                  <div className="font-medium text-sm">{permission.name}</div>
                  <div className="flex flex-wrap gap-4">
                    {permission.actions.map((action) => (
                      <div key={action} className="flex items-center space-x-2">
                        <Checkbox
                          id={`${permission.name}-${action}`}
                          checked={selectedPermissions[permission.name]?.includes(action) || false}
                          onCheckedChange={(checked) =>
                            handlePermissionChange(permission.name, action, checked as boolean)
                          }
                        />
                        <Label htmlFor={`${permission.name}-${action}`} className="text-sm font-normal">
                          {action}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name?.trim()}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
