import { RegistrationPeriod } from "../model/RegistrationPeriodModel";
import { registrationPeriodRepository } from "../repositories/registrationPeriodRepository";

export const registrationPeriodService = {
  getRegistrationPeriods: async () => {
    const response = await registrationPeriodRepository.getRegistrationPeriods();
    return response.data;
  },
  addRegistrationPeriod: async (registrationPeriod: RegistrationPeriod) => {
    const response = await registrationPeriodRepository.addRegistrationPeriod(registrationPeriod);
    return response.data;
  },
  updateRegistrationPeriod: async (registrationPeriod: RegistrationPeriod) => {
    const response = await registrationPeriodRepository.updateRegistrationPeriod(registrationPeriod);
    return response.data;
  },
  deleteRegistrationPeriod: async (id: number) => {
    const response = await registrationPeriodRepository.deleteRegistrationPeriod(id);
    return response.data;
  },
  getRegistrationPeriod: async (id: number) => {
    const response = await registrationPeriodRepository.getRegistrationPeriod(id);
    return response.data;
  },
  downloadRegistrationPeriodTemplate: async () => {
    const response = await registrationPeriodRepository.downloadRegistrationPeriodTemplate();
    return response.data;
  },
  importRegistrationPeriod: async (file: File) => {
    const response = await registrationPeriodRepository.importRegistrationPeriod(file);
    return response.data;
  },

  addAvailableClass: async (course_registration_id: string, class_ids: number[]) => {
    const response = await registrationPeriodRepository.addAvailableClass(course_registration_id, class_ids);
    return response.data;
  },

  removeAvailableClass: async (course_registration_id: string, class_ids: number[]) => {
    const response = await registrationPeriodRepository.removeAvailableClass(course_registration_id, class_ids);
    return response.data;
  },
  addAvailableCourse: async (course_registration_id: string, courseData: {
    subject_id: number;
    description: string;
    schedules: Array<{
      sections: number;
      schedule: string;
    }>;
    start_date: string;
    end_date: string;
    max_student: number;
    location: string;
  }) => {
    const response = await registrationPeriodRepository.addAvailableCourse(course_registration_id, courseData);
    return response.data;
  },

  removeAvailableCourse: async (course_registration_id: string, course_ids: number[]) => {
    const response = await registrationPeriodRepository.removeAvailableCourse(course_registration_id, course_ids);
    return response.data;
  },
};
