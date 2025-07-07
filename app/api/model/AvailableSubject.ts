export interface AvailableSubject {
  id: number;
  registration_period_id: number;
  curriculum_item_id: number;
  subject_id: number;
  subject_name: string;
  max_registrations: number;
  current_registrations: number;
  day_of_week: string;
  start_period: number;
  end_period: number;
  weeks: string;
}


export const MOCK_AVAILABLE_SUBJECTS: AvailableSubject[] = [
  {
    id: 1,
    registration_period_id: 1,
    curriculum_item_id: 1,
    subject_id: 1,
    subject_name: "Math",
    max_registrations: 40,
    current_registrations: 32,
    day_of_week: "Monday",
    start_period: 1,
    end_period: 3,
    weeks: "1-16"
  },
  {
    id: 2,
    registration_period_id: 1,
    curriculum_item_id: 2,
    subject_id: 2,
    subject_name: "Math",
    max_registrations: 35,
    current_registrations: 28,
    day_of_week: "Tuesday",
    start_period: 4,
    end_period: 6,
    weeks: "1-16"
  },
  {
    id: 3,
    registration_period_id: 2,
    curriculum_item_id: 3,
    subject_id: 3,
    subject_name: "Math",
    max_registrations: 30,
    current_registrations: 30,
    day_of_week: "Wednesday",
    start_period: 2,
    end_period: 4,
    weeks: "1-16"
  },
  {
    id: 4,
    registration_period_id: 2,
    curriculum_item_id: 4,
    subject_id: 4,
    subject_name: "Math",
    max_registrations: 25,
    current_registrations: 18,
    day_of_week: "Thursday",
    start_period: 7,
    end_period: 9,
    weeks: "1-16"
  },
  {
    id: 5,
    registration_period_id: 1,
    curriculum_item_id: 5,
    subject_id: 5,
    subject_name: "Math",
    max_registrations: 45,
    current_registrations: 42,
    day_of_week: "Friday",
    start_period: 1,
    end_period: 2,
    weeks: "1-16"
  },
  {
    id: 6,
    registration_period_id: 3,
    curriculum_item_id: 6,
    subject_id: 6,
    subject_name: "Math",
    max_registrations: 20,
    current_registrations: 15,
    day_of_week: "Monday",
    start_period: 5,
    end_period: 7,
    weeks: "1-8"
  },
  {
    id: 7,
    registration_period_id: 3,
    curriculum_item_id: 7,
    subject_id: 7,
    subject_name: "Math",
    max_registrations: 38,
    current_registrations: 25,
    day_of_week: "Tuesday",
    start_period: 1,
    end_period: 3,
    weeks: "9-16"
  },
  {
    id: 8,
    registration_period_id: 2,
    curriculum_item_id: 8,
    subject_id: 8,
    subject_name: "Math",
    max_registrations: 50,
    current_registrations: 48,
    day_of_week: "Wednesday",
    start_period: 8,
    end_period: 10,
    weeks: "1-16"
  },
  {
    id: 9,
    registration_period_id: 1,
    curriculum_item_id: 9,
    subject_id: 9,
    subject_name: "Math",
    max_registrations: 22,
    current_registrations: 19,
    day_of_week: "Thursday",
    start_period: 3,
    end_period: 5,
    weeks: "1-12"
  },
  {
    id: 10,
    registration_period_id: 3,
    curriculum_item_id: 10,
    subject_id: 10,
    subject_name: "Math",
    max_registrations: 33,
    current_registrations: 27,
    day_of_week: "Friday",
    start_period: 6,
    end_period: 8,
    weeks: "1-16"
  }
];

