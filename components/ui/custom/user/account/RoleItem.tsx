import React from "react";

import { RoleModel } from "@/app/api/model/RoleModel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, MoreVertical, Shield, Trash2, Users } from "lucide-react";

interface RoleItemProps {
  role: RoleModel;
}

export default function RoleItem({ role }: RoleItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{role.name}</h3>
              <p className="text-sm text-gray-600 mt-1">{role.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={role.isActive ? "default" : "secondary"}>{role.isActive ? "Active" : "Inactive"}</Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Role
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Role
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {/* Permissions */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions</h4>
            <div className="flex flex-wrap gap-1">
              {role.permissions && role.permissions.length > 0 ? (
                role.permissions.slice(0, 3).map((permission, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-500">No permissions assigned</span>
              )}
              {role.permissions && role.permissions.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{role.permissions.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {/* Metadata */}
          <div className="text-xs text-gray-500 space-y-1">
            <div>Created: {formatDate(role.created_at || "")}</div>
            <div>Updated: {formatDate(role.updated_at || "")}</div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-3 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="h-4 w-4" />
            <span>ID: {role.id}</span>
          </div>

          <Button variant="outline" size="sm">
            View Details
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
