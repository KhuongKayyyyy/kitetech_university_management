import React from "react";

import { CourseDetailModel } from "@/app/api/model/Course";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Calendar,
  Clock,
  Download,
  Edit,
  FileText,
  FolderOpen,
  Plus,
  Target,
  Upload,
  Users,
} from "lucide-react";

interface ClassMaterialsTabProps {
  subjectClass: CourseDetailModel;
}

export default function ClassMaterialsTab({ subjectClass }: ClassMaterialsTabProps) {
  // Mock materials data
  const materials = [
    {
      id: "1",
      name: "Course Syllabus",
      type: "document",
      size: "2.3 MB",
      uploadedAt: "2024-01-15",
      downloads: 45,
    },
    {
      id: "2",
      name: "Week 1-4 Lecture Notes",
      type: "presentation",
      size: "15.7 MB",
      uploadedAt: "2024-01-20",
      downloads: 38,
    },
    {
      id: "3",
      name: "Assignment Guidelines",
      type: "document",
      size: "1.2 MB",
      uploadedAt: "2024-01-22",
      downloads: 42,
    },
    {
      id: "4",
      name: "Practice Problems Set 1",
      type: "document",
      size: "3.8 MB",
      uploadedAt: "2024-01-25",
      downloads: 35,
    },
  ];

  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case "document":
        return <FileText className="h-4 w-4" />;
      case "presentation":
        return <BookOpen className="h-4 w-4" />;
      case "video":
        return <BookOpen className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case "document":
        return "bg-blue-100 text-blue-800";
      case "presentation":
        return "bg-purple-100 text-purple-800";
      case "video":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Course Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Course Description</CardTitle>
            <CardDescription>Overview of the course content and objectives</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">{subjectClass.description}</p>
            <div className="mt-4 flex items-center space-x-2">
              <Badge variant="outline">{subjectClass.subject?.credits} credits</Badge>
              <Badge variant="outline">{subjectClass.semester}</Badge>
              {subjectClass.is_active ? (
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Syllabus</CardTitle>
            <CardDescription>Weekly breakdown of course content</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-sm">Week 1-4: Introduction</h4>
                  <p className="text-xs text-muted-foreground">Basic concepts and foundations</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-sm">Week 5-8: Core Topics</h4>
                  <p className="text-xs text-muted-foreground">Main course content and applications</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-sm">Week 9-12: Advanced Topics</h4>
                  <p className="text-xs text-muted-foreground">Complex concepts and problem solving</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <h4 className="font-medium text-sm">Week 13-16: Review & Final</h4>
                  <p className="text-xs text-muted-foreground">Review, projects, and final examination</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Materials */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Course Materials</CardTitle>
              <CardDescription>Documents, presentations, and resources for the course</CardDescription>
            </div>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Upload Material
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {materials.map((material) => (
              <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    {getFileTypeIcon(material.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium">{material.name}</h4>
                      <Badge className={getFileTypeColor(material.type)}>{material.type}</Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                      <span>{material.size}</span>
                      <span>•</span>
                      <span>Uploaded {material.uploadedAt}</span>
                      <span>•</span>
                      <span>{material.downloads} downloads</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Materials</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.length}</div>
            <p className="text-xs text-muted-foreground">uploaded files</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{materials.reduce((sum, m) => sum + m.downloads, 0)}</div>
            <p className="text-xs text-muted-foreground">total downloads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Credits</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjectClass.subject?.credits}</div>
            <p className="text-xs text-muted-foreground">course credits</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">16</div>
            <p className="text-xs text-muted-foreground">weeks</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Manage course materials and content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Material
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit Syllabus
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export All
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Updates
            </Button>
            <Button variant="outline" size="sm">
              <Users className="w-4 h-4 mr-2" />
              Share Materials
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
