export interface RoleModel {
    id?: number;
    name?: string;
    description?: string;
    isActive?: boolean;
    created_at?: string;
    updated_at?: string;
    permissions?: any[];
  }