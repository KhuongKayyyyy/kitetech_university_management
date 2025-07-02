export interface User {
  id: number;
  username: string;
  password: string;
  full_name: string;
  email: string;
  isActive: boolean;
  isDeleted: boolean;
  role: Role;
  created_at: string;
  updated_at: string;
  avatar: string;
}
