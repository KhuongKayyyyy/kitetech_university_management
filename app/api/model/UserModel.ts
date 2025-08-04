import { RoleModel } from "./RoleModel";

export interface UserModel {
  id?: number;
  username?: string;
  password?: string;
  full_name?: string;
  email?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  role?: RoleModel;
  created_at?: string;
  updated_at?: string;
  avatar?: string;
}

export interface UserCreateModel {
  username: string;
  password: string;
  full_name: string;
  email: string;
}
