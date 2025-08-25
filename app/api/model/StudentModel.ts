import { ClassModel } from "./ClassModel";

export interface Student {
  id?: number;
  full_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: number;
  birth_date?: string;
  classes?: ClassModel;
  class_id?: number;
}