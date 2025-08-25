export interface UserModel {
  id?: number;
  username?: string;
  password?: string;
  full_name?: string;
  email?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  role?: string;
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
