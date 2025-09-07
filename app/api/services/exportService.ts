import * as XLSX from 'xlsx';
import { Course } from '@/app/api/model/Course';
import { RegisteredStudent } from '@/app/api/model/RegistrationPeriodModel';
import { subjectClassService } from './courseService';

export interface ExportData {
  registrationPeriodId: string;
  registrationPeriodName: string;
  courses: Course[];
}

export class ExportService {
  /**
   * Export available courses to Excel with multiple tabs
   * Each tab represents a course with class info and registered students
   */
  static async exportAvailableCoursesToExcel(data: ExportData): Promise<void> {
    const workbook = XLSX.utils.book_new();
    
    // Create summary sheet
    const summaryData = this.createSummarySheet(data);
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    this.applySummaryStyles(summarySheet, summaryData.length);
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');

    // Create individual course sheets
    for (const course of data.courses) {
      try {
        const courseData = await this.createCourseSheet(course);
        const courseSheet = XLSX.utils.aoa_to_sheet(courseData);
        this.applyCourseStyles(courseSheet, courseData.length);
        
        // Clean sheet name (Excel has restrictions on sheet names)
        const cleanSheetName = this.cleanSheetName(course.subject_name);
        XLSX.utils.book_append_sheet(workbook, courseSheet, cleanSheetName);
      } catch (error) {
        console.error(`Error creating sheet for course ${course.subject_name}:`, error);
        // Create a basic sheet with course info only
        const basicCourseData = this.createBasicCourseSheet(course);
        const basicSheet = XLSX.utils.aoa_to_sheet(basicCourseData);
        this.applyCourseStyles(basicSheet, basicCourseData.length);
        const cleanSheetName = this.cleanSheetName(course.subject_name);
        XLSX.utils.book_append_sheet(workbook, basicSheet, cleanSheetName);
      }
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Registration_Period_${data.registrationPeriodId}_${timestamp}.xlsx`;

    // Save the file
    XLSX.writeFile(workbook, filename);
  }

  /**
   * Create summary sheet with overview of all courses
   */
  private static createSummarySheet(data: ExportData): any[][] {
    const summaryData: any[][] = [
      // Header
      ['REGISTRATION PERIOD SUMMARY', '', '', '', '', ''],
      ['', '', '', '', '', ''],
      ['Period ID:', data.registrationPeriodId, '', '', '', ''],
      ['Period Name:', data.registrationPeriodName, '', '', '', ''],
      ['Export Date:', new Date().toLocaleDateString(), '', '', '', ''],
      ['Total Courses:', data.courses.length.toString(), '', '', '', ''],
      ['', '', '', '', '', ''],
      
      // Course overview table
      ['COURSE OVERVIEW', '', '', '', '', ''],
      ['Subject Name', 'Subject ID', 'Semester', 'Location', 'Enrolled', 'Max Students', 'Status'],
    ];

    // Add course data
    data.courses.forEach(course => {
      const status = course.enrolled >= course.max_student ? 'Full' : 'Available';
      summaryData.push([
        course.subject_name,
        course.subject_id,
        course.semester,
        course.location,
        course.enrolled,
        course.max_student,
        status
      ]);
    });

    return summaryData;
  }

  /**
   * Create detailed course sheet with class info and registered students
   */
  private static async createCourseSheet(course: Course): Promise<any[][]> {
    const courseData: any[][] = [
      // Course header
      ['COURSE DETAILS', '', '', '', '', ''],
      ['', '', '', '', '', ''],
      ['Subject Name:', course.subject_name, '', '', '', ''],
      ['Subject ID:', course.subject_id.toString(), '', '', '', ''],
      ['Semester:', course.semester, '', '', '', ''],
      ['Description:', course.description || 'N/A', '', '', '', ''],
      ['Location:', course.location, '', '', '', ''],
      ['Start Date:', course.start_date, '', '', '', ''],
      ['End Date:', course.end_date, '', '', '', ''],
      ['Enrolled Students:', course.enrolled.toString(), '', '', '', ''],
      ['Max Students:', course.max_student.toString(), '', '', '', ''],
      ['Teacher:', course.teacher_username, '', '', '', ''],
      ['', '', '', '', '', ''],
      
      // Schedule information
      ['COURSE SCHEDULE', '', '', '', '', ''],
      ['Sections', 'Schedule', 'Created At', 'Updated At', '', ''],
    ];

    // Add schedule data
    course.schedules.forEach(schedule => {
      courseData.push([
        schedule.sections,
        schedule.schedule,
        new Date(schedule.created_at).toLocaleDateString(),
        new Date(schedule.updated_at).toLocaleDateString(),
        '',
        ''
      ]);
    });

    courseData.push(['', '', '', '', '', '']);

    // Registered students section
    courseData.push(['REGISTERED STUDENTS', '', '', '', '', '']);
    courseData.push(['Student Name', 'Username', 'Email', 'Status', 'Role', 'Created At']);

    try {
      // Fetch registered students for this course
      const students = await subjectClassService.getRegistedStudentList(course.id.toString());
      
      if (students && students.length > 0) {
        students.forEach(student => {
          courseData.push([
            student.full_name,
            student.username,
            student.email,
            student.isActive ? 'Active' : 'Inactive',
            student.role,
            new Date(student.created_at).toLocaleDateString()
          ]);
        });
      } else {
        courseData.push(['No students registered for this course', '', '', '', '', '']);
      }
    } catch (error) {
      console.error('Error fetching students for course:', course.subject_name, error);
      courseData.push(['Error loading student data', '', '', '', '', '']);
    }

    return courseData;
  }

  /**
   * Create basic course sheet when student data cannot be fetched
   */
  private static createBasicCourseSheet(course: Course): any[][] {
    const courseData: any[][] = [
      // Course header
      ['COURSE DETAILS', '', '', '', '', ''],
      ['', '', '', '', '', ''],
      ['Subject Name:', course.subject_name, '', '', '', ''],
      ['Subject ID:', course.subject_id.toString(), '', '', '', ''],
      ['Semester:', course.semester, '', '', '', ''],
      ['Description:', course.description || 'N/A', '', '', '', ''],
      ['Location:', course.location, '', '', '', ''],
      ['Start Date:', course.start_date, '', '', '', ''],
      ['End Date:', course.end_date, '', '', '', ''],
      ['Enrolled Students:', course.enrolled.toString(), '', '', '', ''],
      ['Max Students:', course.max_student.toString(), '', '', '', ''],
      ['Teacher:', course.teacher_username, '', '', '', ''],
      ['', '', '', '', '', ''],
      
      // Schedule information
      ['COURSE SCHEDULE', '', '', '', '', ''],
      ['Sections', 'Schedule', 'Created At', 'Updated At', '', ''],
    ];

    // Add schedule data
    course.schedules.forEach(schedule => {
      courseData.push([
        schedule.sections,
        schedule.schedule,
        new Date(schedule.created_at).toLocaleDateString(),
        new Date(schedule.updated_at).toLocaleDateString(),
        '',
        ''
      ]);
    });

    courseData.push(['', '', '', '', '', '']);
    courseData.push(['REGISTERED STUDENTS', '', '', '', '', '']);
    courseData.push(['Note: Student data could not be loaded', '', '', '', '', '']);

    return courseData;
  }

  /**
   * Apply beautiful styling to summary sheet
   */
  private static applySummaryStyles(sheet: XLSX.WorkSheet, rowCount: number): void {
    // Set column widths
    const colWidths = [
      { wch: 25 }, // Subject Name
      { wch: 12 }, // Subject ID
      { wch: 15 }, // Semester
      { wch: 20 }, // Location
      { wch: 10 }, // Enrolled
      { wch: 12 }, // Max Students
      { wch: 12 }, // Status
    ];
    sheet['!cols'] = colWidths;

    // Apply styles to header rows
    if (sheet['A1']) {
      sheet['A1'].s = {
        font: { bold: true, size: 16, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "2E86AB" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    // Style course overview header
    const overviewHeaderRow = 8;
    for (let col = 0; col < 7; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: overviewHeaderRow, c: col });
      if (sheet[cellRef]) {
        sheet[cellRef].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "4A90E2" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }
    }
  }

  /**
   * Apply beautiful styling to course sheets
   */
  private static applyCourseStyles(sheet: XLSX.WorkSheet, rowCount: number): void {
    // Set column widths
    const colWidths = [
      { wch: 20 }, // Column A
      { wch: 25 }, // Column B
      { wch: 15 }, // Column C
      { wch: 15 }, // Column D
      { wch: 15 }, // Column E
      { wch: 15 }, // Column F
    ];
    sheet['!cols'] = colWidths;

    // Style main headers
    if (sheet['A1']) {
      sheet['A1'].s = {
        font: { bold: true, size: 16, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "2E86AB" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    // Style section headers
    const sectionHeaders = ['COURSE SCHEDULE', 'REGISTERED STUDENTS'];
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < 6; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (sheet[cellRef] && sectionHeaders.includes(sheet[cellRef].v)) {
          sheet[cellRef].s = {
            font: { bold: true, size: 14, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "4A90E2" } },
            alignment: { horizontal: "center", vertical: "center" }
          };
        }
      }
    }

    // Style table headers
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < 6; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (sheet[cellRef] && this.isTableHeader(sheet[cellRef].v)) {
          sheet[cellRef].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "6C7B7F" } },
            alignment: { horizontal: "center", vertical: "center" }
          };
        }
      }
    }
  }

  /**
   * Check if a cell value is a table header
   */
  private static isTableHeader(value: any): boolean {
    const headers = [
      'Sections', 'Schedule', 'Created At', 'Updated At',
      'Student Name', 'Username', 'Email', 'Status', 'Role', 'Created At',
      'Subject Name', 'Subject ID', 'Semester', 'Location', 'Enrolled', 'Max Students', 'Status'
    ];
    return headers.includes(value);
  }

  /**
   * Clean sheet name to comply with Excel naming restrictions
   */
  private static cleanSheetName(name: string): string {
    // Excel sheet names cannot exceed 31 characters and cannot contain certain characters
    let cleanName = name
      .replace(/[\\\/\?\*\[\]]/g, '') // Remove invalid characters
      .substring(0, 31); // Limit to 31 characters
    
    // Ensure it's not empty
    if (!cleanName.trim()) {
      cleanName = 'Course';
    }
    
    return cleanName;
  }
}
