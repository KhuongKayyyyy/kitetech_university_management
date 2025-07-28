# Curriculum V2 Fake Data Documentation

This directory contains comprehensive fake data for the new Curriculum V2 system. The data is structured to match the new curriculum creation workflow with boards, semester columns, and prerequisite relationships.

## File Structure

### `FakeCurriculumV2Data.tsx`
Main file containing all the fake data for the V2 curriculum system.

### `SimplifiedCurriculumExample.tsx`
Examples showing the conversion from complex to simplified format.

### `FakeCurriclumnData.tsx`
Original V1 curriculum data (legacy format).

## Data Structure Overview

### 1. Curriculum Info
```typescript
const FakeCurriculumInfo = {
  id: "curriculum-1704067200000",
  name: "Computer Science Bachelor Program 2024",
  description: "Comprehensive 4-year bachelor program...",
  academicYear: "2024",
  facultyId: "1",
  majorId: "1",
  totalCredits: 140,
  createdAt: "2024-01-01T00:00:00.000Z",
};
```

### 2. Board Types
Available board types for curriculum organization:
- **Core Subjects** (8 semesters) - Essential subjects
- **Physical Education** (2 semesters) - Fitness courses
- **Skill Development** (4 semesters) - Practical skills
- **English Courses** (3 semesters) - Language skills
- **Philosophy & Ethics** (2 semesters) - Philosophy courses

### 3. Board Structure
Each board contains:
- **ID**: Unique identifier
- **Name & Type**: Board classification
- **Column Order**: Ordered list of semester columns
- **Semester Columns**: Individual semester containers with subjects

Example:
```typescript
{
  id: "board-core-1704067200000-0",
  name: "Core Subjects",
  type: "core",
  semesterColumn: {
    "semester-1-board-core-1704067200000-0": {
      id: "semester-1-board-core-1704067200000-0",
      title: "Semester 1",
      subjectIds: ["subject-101-1704067200001-abc123def", ...],
      semesterNumber: 1,
    }
  }
}
```

### 4. Subject Data Format

#### Complex Format (Internal Storage)
```typescript
{
  SubjectID: "101",
  SubjectName: "Calculus I",
  TotalCredits: 4,
  Semester: 1,
  IsRequired: true,
  HasPrerequisite: false,
  PrerequisiteSubjects: [SubjectModel], // Full objects
  // ... many more fields
}
```

#### Simplified Format (Export/Storage)
```typescript
{
  SubjectID: "101",
  Semester: "semester-1-board-core-1704067200000-0", // Column ID
  IsRequired: true,
  MinCredit: 4,
  SubjectNumber: 1, // Position in semester
  HasPrerequisite: false,
  PrerequisiteSubjects: ["subject-id-1", "subject-id-2"], // String IDs
}
```

## Key Features

### 1. Prerequisite Relationships
The fake data includes complex prerequisite chains:
- **Linear**: Calculus I → Calculus II → Statistics
- **Convergent**: AI + Statistics → Machine Learning
- **Branching**: Programming → OOP → (Web Dev + Software Engineering)

### 2. Multi-Board Organization
Subjects are organized across different boards:
- Core subjects span 8 semesters with decreasing load
- Supporting subjects (PE, English) have focused placement
- Cross-board dependencies are properly maintained

### 3. Credit Distribution
- **Total Credits**: 140 across all subjects
- **Semester Load**: 14-18 credits per semester (realistic)
- **Subject Types**: Mix of theoretical and practical courses

## Usage Examples

### Import the Data
```typescript
import {
  FakeCompleteCurriculumState,
  FakeCurriculumInfo,
  FakeBoards,
  FakeCurriculumSubjects,
  FakeAvailableSubjects,
} from "@/app/api/fakedata";
```

### Use in Components
```typescript
// Initialize curriculum state
const [state, setState] = useState(FakeCompleteCurriculumState);

// Load for testing
const testData = {
  curriculumInfo: FakeCurriculumInfo,
  boards: FakeBoards,
  subjects: FakeCurriculumSubjects,
};
```

### Test Conversion Function
```typescript
import { testConversion } from "@/app/api/fakedata";

// Run conversion test
const simplified = testConversion();
console.log("Converted curriculum:", simplified);
```

## Subject Mapping

### Core Curriculum Flow
1. **Semester 1-2**: Foundations (Calculus, Programming, Physics)
2. **Semester 3-4**: Core CS (Data Structures, Databases, Networks)
3. **Semester 5-6**: Advanced Topics (AI, ML, Mobile Dev)
4. **Semester 7-8**: Projects and Ethics (Capstone, Internship)

### Prerequisites Chain Examples
- Calculus I → Calculus II → Statistics → AI → Machine Learning
- Programming → OOP → (Data Structures, Web Dev, Software Engineering)
- Networks → (Cybersecurity, Cloud Computing)

## Available Test Subjects
Additional subjects for testing the "Add Subject" functionality:
- Chemistry I & II
- Quantum Computing
- Blockchain Technology
- Internet of Things
- Advanced Algorithms
- Computer Graphics
- Philosophy courses

## Integration Points

### With Curriculum Creation Page
```typescript
// Use in create page
const handleLoadTestData = () => {
  setState(FakeCompleteCurriculumState);
  setCurriculumInfo(FakeCurriculumInfo);
};
```

### With Search Dialog
```typescript
// Available subjects for adding
const availableSubjects = FakeAvailableSubjects.filter(
  subject => !existingSubjectIds.has(subject.id)
);
```

### With Save Dialog
```typescript
// Test the conversion
const simplified = convertToSimplified(state.subjects, state.boards);
console.log("Simplified format:", simplified);
```

## Benefits for Development

1. **Complete Testing**: Full curriculum with all relationships
2. **Realistic Data**: Proper credit loads and semester distribution  
3. **Complex Prerequisites**: Multi-level dependency chains
4. **Board Variety**: Different types of curriculum organization
5. **Conversion Testing**: Examples of simplified format output

## Notes

- All IDs follow the new format: `subject-{id}-{timestamp}-{random}`
- Semester column IDs reference actual board structure
- Prerequisites maintain referential integrity
- Credit totals are realistic for a 4-year program
- Data can be used immediately without additional setup 