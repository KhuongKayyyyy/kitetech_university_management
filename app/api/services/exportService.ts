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
    const cleanPeriodName = data.registrationPeriodName.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
    const filename = `Registration_Period_${data.registrationPeriodId}_${cleanPeriodName}_${timestamp}.xlsx`;

    // Save the file
    XLSX.writeFile(workbook, filename);
  }

  /**
   * Create summary sheet with overview of all courses
   */
  private static createSummarySheet(data: ExportData): any[][] {
    const totalEnrolled = data.courses.reduce((sum, course) => sum + course.enrolled, 0);
    const totalCapacity = data.courses.reduce((sum, course) => sum + course.max_student, 0);
    const fullCourses = data.courses.filter(course => course.enrolled >= course.max_student).length;
    const availableCourses = data.courses.length - fullCourses;

    const summaryData: any[][] = [
      // Main Header
      ['🎓 UNIVERSITY REGISTRATION PERIOD REPORT', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      
      // Period Information
      ['📋 PERIOD INFORMATION', '', '', '', '', '', ''],
      ['Period ID:', data.registrationPeriodId, '', '', '', '', ''],
      ['Period Name:', data.registrationPeriodName, '', '', '', '', ''],
      ['Export Date:', new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        weekday: 'long'
      }), '', '', '', '', ''],
      ['Export Time:', new Date().toLocaleTimeString('en-US'), '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      
      // Statistics
      ['📊 REGISTRATION STATISTICS', '', '', '', '', '', ''],
      ['Total Courses Available:', data.courses.length.toString(), '', '', '', '', ''],
      ['Total Student Capacity:', totalCapacity.toString(), '', '', '', '', ''],
      ['Total Enrolled Students:', totalEnrolled.toString(), '', '', '', '', ''],
      ['Available Spots:', (totalCapacity - totalEnrolled).toString(), '', '', '', '', ''],
      ['Full Courses:', fullCourses.toString(), '', '', '', '', ''],
      ['Available Courses:', availableCourses.toString(), '', '', '', '', ''],
      ['Enrollment Rate:', `${((totalEnrolled / totalCapacity) * 100).toFixed(1)}%`, '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      
      // Course overview table
      ['📚 COURSE OVERVIEW', '', '', '', '', '', ''],
      ['Subject Name', 'Subject ID', 'Semester', 'Location', 'Enrolled', 'Max Students', 'Status', 'Enrollment %'],
    ];

    // Add course data
    data.courses.forEach(course => {
      const status = course.enrolled >= course.max_student ? '🔴 Full' : 
                    course.enrolled > course.max_student * 0.8 ? '🟡 Nearly Full' : '🟢 Available';
      const enrollmentPercent = ((course.enrolled / course.max_student) * 100).toFixed(1) + '%';
      
      summaryData.push([
        course.subject_name,
        course.subject_id,
        course.semester,
        course.location,
        course.enrolled,
        course.max_student,
        status,
        enrollmentPercent
      ]);
    });

    return summaryData;
  }

  /**
   * Create detailed course sheet with class info and registered students
   */
  private static async createCourseSheet(course: Course): Promise<any[][]> {
    const enrollmentPercent = ((course.enrolled / course.max_student) * 100).toFixed(1);
    const status = course.enrolled >= course.max_student ? '🔴 Full' : 
                  course.enrolled > course.max_student * 0.8 ? '🟡 Nearly Full' : '🟢 Available';

    const courseData: any[][] = [
      // Course header
      ['📚 COURSE DETAILS', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['Subject Name:', course.subject_name, '', '', '', '', ''],
      ['Subject ID:', course.subject_id.toString(), '', '', '', '', ''],
      ['Semester:', course.semester, '', '', '', '', ''],
      ['Description:', course.description || 'N/A', '', '', '', '', ''],
      ['Location:', course.location, '', '', '', '', ''],
      ['Start Date:', this.formatDate(course.start_date), '', '', '', '', ''],
      ['End Date:', this.formatDate(course.end_date), '', '', '', '', ''],
      ['Duration:', this.calculateDuration(course.start_date, course.end_date), '', '', '', '', ''],
      ['Teacher:', course.teacher_username || 'TBA', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      
      // Enrollment Information
      ['👥 ENROLLMENT INFORMATION', '', '', '', '', '', ''],
      ['Enrolled Students:', course.enrolled.toString(), '', '', '', '', ''],
      ['Max Students:', course.max_student.toString(), '', '', '', '', ''],
      ['Available Spots:', (course.max_student - course.enrolled).toString(), '', '', '', '', ''],
      ['Enrollment Rate:', `${enrollmentPercent}%`, '', '', '', '', ''],
      ['Status:', status, '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      
      // Schedule information
      ['📅 COURSE SCHEDULE', '', '', '', '', '', ''],
      ['Section', 'Schedule', 'Created At', 'Updated At', '', '', ''],
    ];

    // Add schedule data
    if (course.schedules && course.schedules.length > 0) {
      course.schedules.forEach(schedule => {
        courseData.push([
          schedule.sections,
          schedule.schedule,
          this.formatDate(schedule.created_at),
          this.formatDate(schedule.updated_at),
          '',
          '',
          ''
        ]);
      });
    } else {
      courseData.push(['No schedule information available', '', '', '', '', '', '']);
    }

    courseData.push(['', '', '', '', '', '', '']);

    // Registered students section
    courseData.push(['🎓 REGISTERED STUDENTS', '', '', '', '', '', '']);
    courseData.push(['#', 'Student Name', 'Username', 'Email', 'Status', 'Role', 'Registration Date']);

    try {
      // Fetch registered students for this course
      const students = await subjectClassService.getRegistedStudentList(course.id.toString());
      
      if (students && students.length > 0) {
        students.forEach((student, index) => {
          const status = student.isActive ? '🟢 Active' : '🔴 Inactive';
          courseData.push([
            index + 1,
            student.full_name,
            student.username,
            student.email,
            status,
            student.role,
            this.formatDate(student.created_at)
          ]);
        });
        
        // Add summary row
        courseData.push(['', '', '', '', '', '', '']);
        courseData.push(['TOTAL:', students.length.toString(), '', '', '', '', '']);
      } else {
        courseData.push(['No students registered for this course', '', '', '', '', '', '']);
      }
    } catch (error) {
      console.error('Error fetching students for course:', course.subject_name, error);
      courseData.push(['Error loading student data', '', '', '', '', '', '']);
    }

    return courseData;
  }

  /**
   * Create basic course sheet when student data cannot be fetched
   */
  private static createBasicCourseSheet(course: Course): any[][] {
    const enrollmentPercent = ((course.enrolled / course.max_student) * 100).toFixed(1);
    const status = course.enrolled >= course.max_student ? '🔴 Full' : 
                  course.enrolled > course.max_student * 0.8 ? '🟡 Nearly Full' : '🟢 Available';

    const courseData: any[][] = [
      // Course header
      ['📚 COURSE DETAILS', '', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      ['Subject Name:', course.subject_name, '', '', '', '', ''],
      ['Subject ID:', course.subject_id.toString(), '', '', '', '', ''],
      ['Semester:', course.semester, '', '', '', '', ''],
      ['Description:', course.description || 'N/A', '', '', '', '', ''],
      ['Location:', course.location, '', '', '', '', ''],
      ['Start Date:', this.formatDate(course.start_date), '', '', '', '', ''],
      ['End Date:', this.formatDate(course.end_date), '', '', '', '', ''],
      ['Duration:', this.calculateDuration(course.start_date, course.end_date), '', '', '', '', ''],
      ['Teacher:', course.teacher_username || 'TBA', '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      
      // Enrollment Information
      ['👥 ENROLLMENT INFORMATION', '', '', '', '', '', ''],
      ['Enrolled Students:', course.enrolled.toString(), '', '', '', '', ''],
      ['Max Students:', course.max_student.toString(), '', '', '', '', ''],
      ['Available Spots:', (course.max_student - course.enrolled).toString(), '', '', '', '', ''],
      ['Enrollment Rate:', `${enrollmentPercent}%`, '', '', '', '', ''],
      ['Status:', status, '', '', '', '', ''],
      ['', '', '', '', '', '', ''],
      
      // Schedule information
      ['📅 COURSE SCHEDULE', '', '', '', '', '', ''],
      ['Section', 'Schedule', 'Created At', 'Updated At', '', '', ''],
    ];

    // Add schedule data
    if (course.schedules && course.schedules.length > 0) {
      course.schedules.forEach(schedule => {
        courseData.push([
          schedule.sections,
          schedule.schedule,
          this.formatDate(schedule.created_at),
          this.formatDate(schedule.updated_at),
          '',
          '',
          ''
        ]);
      });
    } else {
      courseData.push(['No schedule information available', '', '', '', '', '', '']);
    }

    courseData.push(['', '', '', '', '', '', '']);
    courseData.push(['🎓 REGISTERED STUDENTS', '', '', '', '', '', '']);
    courseData.push(['⚠️ Note: Student data could not be loaded', '', '', '', '', '', '']);

    return courseData;
  }

  /**
   * Add alternating row colors for better readability
   */
  private static addAlternatingRowColors(sheet: XLSX.WorkSheet, rowCount: number): void {
    // Find data rows (skip headers and section headers)
    const dataRows: number[] = [];
    
    for (let row = 0; row < rowCount; row++) {
      let isDataRow = false;
      for (let col = 0; col < 8; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (sheet[cellRef] && sheet[cellRef].v && typeof sheet[cellRef].v === 'string') {
          const value = sheet[cellRef].v.toString();
          // Check if this is a data row (contains student info, course info, etc.)
          if (value.includes('@') || // Email addresses
              value.match(/^\d+$/) || // Numbers (student IDs, etc.)
              (value.length > 3 && !value.includes('📋') && !value.includes('📊') && !value.includes('📚') && !value.includes('👥') && !value.includes('📅') && !value.includes('🎓'))) {
            isDataRow = true;
            break;
          }
        }
      }
      if (isDataRow) {
        dataRows.push(row);
      }
    }

    // Apply alternating colors to data rows
    dataRows.forEach((row, index) => {
      const isEven = index % 2 === 0;
      const backgroundColor = isEven ? "F9FAFB" : "FFFFFF"; // Light gray and white
      
      for (let col = 0; col < 8; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (sheet[cellRef]) {
          if (!sheet[cellRef].s) {
            sheet[cellRef].s = {};
          }
          if (!sheet[cellRef].s.fill) {
            sheet[cellRef].s.fill = { fgColor: { rgb: backgroundColor } };
          }
        }
      }
    });
  }

  /**
   * Format date to a readable string
   */
  private static formatDate(dateString: string): string {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  /**
   * Calculate duration between two dates
   */
  private static calculateDuration(startDate: string, endDate: string): string {
    try {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return `${diffDays} days`;
    } catch (error) {
      return 'N/A';
    }
  }

  /**
   * Apply beautiful styling to summary sheet
   */
  private static applySummaryStyles(sheet: XLSX.WorkSheet, rowCount: number): void {
    // Set column widths
    const colWidths = [
      { wch: 30 }, // Column A
      { wch: 25 }, // Column B
      { wch: 15 }, // Column C
      { wch: 15 }, // Column D
      { wch: 15 }, // Column E
      { wch: 15 }, // Column F
      { wch: 15 }, // Column G
      { wch: 15 }, // Column H
    ];
    sheet['!cols'] = colWidths;

    // Apply styles to main header with gradient-like effect
    if (sheet['A1']) {
      sheet['A1'].s = {
        font: { bold: true, size: 20, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "0F172A" } }, // Dark navy blue
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thick", color: { rgb: "1E40AF" } },
          bottom: { style: "thick", color: { rgb: "1E40AF" } },
          left: { style: "thick", color: { rgb: "1E40AF" } },
          right: { style: "thick", color: { rgb: "1E40AF" } }
        }
      };
    }

    // Style section headers with different colors
    const sectionHeaders = [
      { text: '📋 PERIOD INFORMATION', color: "059669" }, // Emerald green
      { text: '📊 REGISTRATION STATISTICS', color: "DC2626" }, // Red
      { text: '📚 COURSE OVERVIEW', color: "7C3AED" } // Purple
    ];
    
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < 8; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (sheet[cellRef]) {
          const sectionHeader = sectionHeaders.find(sh => sh.text === sheet[cellRef].v);
          if (sectionHeader) {
            sheet[cellRef].s = {
              font: { bold: true, size: 16, color: { rgb: "FFFFFF" } },
              fill: { fgColor: { rgb: sectionHeader.color } },
              alignment: { horizontal: "left", vertical: "center" },
              border: {
                top: { style: "medium", color: { rgb: "FFFFFF" } },
                bottom: { style: "medium", color: { rgb: "FFFFFF" } },
                left: { style: "medium", color: { rgb: "FFFFFF" } },
                right: { style: "medium", color: { rgb: "FFFFFF" } }
              }
            };
          }
        }
      }
    }

    // Style course overview table header with vibrant color
    const overviewHeaderRow = 20; // Adjust based on new structure
    for (let col = 0; col < 8; col++) {
      const cellRef = XLSX.utils.encode_cell({ r: overviewHeaderRow, c: col });
      if (sheet[cellRef]) {
        sheet[cellRef].s = {
          font: { bold: true, color: { rgb: "FFFFFF" } },
          fill: { fgColor: { rgb: "1F2937" } }, // Dark gray
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            top: { style: "thin", color: { rgb: "9CA3AF" } },
            bottom: { style: "thin", color: { rgb: "9CA3AF" } },
            left: { style: "thin", color: { rgb: "9CA3AF" } },
            right: { style: "thin", color: { rgb: "9CA3AF" } }
          }
        };
      }
    }

    // Add alternating row colors for better readability
    this.addAlternatingRowColors(sheet, rowCount);
    
    // Add special styling for status indicators
    this.addStatusStyling(sheet, rowCount);
  }

  /**
   * Apply beautiful styling to course sheets
   */
  private static applyCourseStyles(sheet: XLSX.WorkSheet, rowCount: number): void {
    // Set column widths
    const colWidths = [
      { wch: 25 }, // Column A
      { wch: 30 }, // Column B
      { wch: 15 }, // Column C
      { wch: 15 }, // Column D
      { wch: 15 }, // Column E
      { wch: 15 }, // Column F
      { wch: 20 }, // Column G
    ];
    sheet['!cols'] = colWidths;

    // Style main headers with vibrant colors
    if (sheet['A1']) {
      sheet['A1'].s = {
        font: { bold: true, size: 18, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "1E40AF" } }, // Deep blue
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "thick", color: { rgb: "3B82F6" } },
          bottom: { style: "thick", color: { rgb: "3B82F6" } },
          left: { style: "thick", color: { rgb: "3B82F6" } },
          right: { style: "thick", color: { rgb: "3B82F6" } }
        }
      };
    }

    // Style section headers with distinct colors
    const sectionHeaders = [
      { text: '📚 COURSE DETAILS', color: "059669" }, // Emerald green
      { text: '👥 ENROLLMENT INFORMATION', color: "DC2626" }, // Red
      { text: '📅 COURSE SCHEDULE', color: "7C3AED" }, // Purple
      { text: '🎓 REGISTERED STUDENTS', color: "EA580C" } // Orange
    ];
    
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < 7; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (sheet[cellRef]) {
          const sectionHeader = sectionHeaders.find(sh => sh.text === sheet[cellRef].v);
          if (sectionHeader) {
            sheet[cellRef].s = {
              font: { bold: true, size: 15, color: { rgb: "FFFFFF" } },
              fill: { fgColor: { rgb: sectionHeader.color } },
              alignment: { horizontal: "left", vertical: "center" },
              border: {
                top: { style: "medium", color: { rgb: "FFFFFF" } },
                bottom: { style: "medium", color: { rgb: "FFFFFF" } },
                left: { style: "medium", color: { rgb: "FFFFFF" } },
                right: { style: "medium", color: { rgb: "FFFFFF" } }
              }
            };
          }
        }
      }
    }

    // Style table headers with professional colors
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < 7; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (sheet[cellRef] && this.isTableHeader(sheet[cellRef].v)) {
          sheet[cellRef].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "374151" } }, // Dark gray
            alignment: { horizontal: "center", vertical: "center" },
            border: {
              top: { style: "thin", color: { rgb: "9CA3AF" } },
              bottom: { style: "thin", color: { rgb: "9CA3AF" } },
              left: { style: "thin", color: { rgb: "9CA3AF" } },
              right: { style: "thin", color: { rgb: "9CA3AF" } }
            }
          };
        }
      }
    }

    // Add alternating row colors for better readability
    this.addAlternatingRowColors(sheet, rowCount);
    
    // Add special styling for status indicators
    this.addStatusStyling(sheet, rowCount);
  }

  /**
   * Add special styling for status indicators
   */
  private static addStatusStyling(sheet: XLSX.WorkSheet, rowCount: number): void {
    for (let row = 0; row < rowCount; row++) {
      for (let col = 0; col < 7; col++) {
        const cellRef = XLSX.utils.encode_cell({ r: row, c: col });
        if (sheet[cellRef] && sheet[cellRef].v && typeof sheet[cellRef].v === 'string') {
          const value = sheet[cellRef].v.toString();
          
          // Style status indicators with colors
          if (value.includes('🟢') || value.includes('Active')) {
            sheet[cellRef].s = {
              ...sheet[cellRef].s,
              font: { ...sheet[cellRef].s?.font, color: { rgb: "059669" }, bold: true },
              fill: { fgColor: { rgb: "D1FAE5" } } // Light green background
            };
          } else if (value.includes('🔴') || value.includes('Full') || value.includes('Inactive')) {
            sheet[cellRef].s = {
              ...sheet[cellRef].s,
              font: { ...sheet[cellRef].s?.font, color: { rgb: "DC2626" }, bold: true },
              fill: { fgColor: { rgb: "FEE2E2" } } // Light red background
            };
          } else if (value.includes('🟡') || value.includes('Nearly Full')) {
            sheet[cellRef].s = {
              ...sheet[cellRef].s,
              font: { ...sheet[cellRef].s?.font, color: { rgb: "D97706" }, bold: true },
              fill: { fgColor: { rgb: "FEF3C7" } } // Light yellow background
            };
          }
        }
      }
    }
  }

  /**
   * Check if a cell value is a table header
   */
  private static isTableHeader(value: any): boolean {
    const headers = [
      'Section', 'Schedule', 'Created At', 'Updated At',
      '#', 'Student Name', 'Username', 'Email', 'Status', 'Role', 'Registration Date',
      'Subject Name', 'Subject ID', 'Semester', 'Location', 'Enrolled', 'Max Students', 'Status', 'Enrollment %',
      'TOTAL:'
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
