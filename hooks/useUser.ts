import { useEffect, useState } from "react";
import { UserModel, UserCreateModel } from "@/app/api/model/UserModel";
import { userService } from "@/app/api/services/userService";
import { toast } from "sonner";

export const useUsers = () => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userService.getUsers();
        setUsers(data);
      } catch (err: any) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);

  const addUser = async (user: UserCreateModel) => {
    try {
      setIsAdding(true);
      setError(null);
      
      const newUser = await userService.addUser(user);
      setUsers(prev => [...prev, newUser]);
      
      toast.success("User " + user.username + " created successfully!");
      return newUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to create user";
      setError(err);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsAdding(false);
    }
  };

  const getUserById = async (id: string) => {
    try {
      setLoading(true);
      const user = await userService.getUser(id);
      return user;
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (user: UserModel) => {
    try {
      setIsUpdating(true);
      setError(null);
      
      const updatedUser = await userService.updateUser(user);
      setUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      
      toast.success("User " + user.username + " updated successfully!");
      return updatedUser;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to update user";
      setError(err);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setIsDeleting(true);
      setError(null);
      
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(u => u.id !== parseInt(id)));
      toast.success("User deleted successfully!");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to delete user";
      setError(err);
      toast.error(errorMessage);
      throw err;
    } finally {
      setIsDeleting(false);
    }
  };

  return { 
    users, 
    setUsers, 
    loading, 
    error, 
    addUser, 
    getUserById, 
    isAdding,
    isDeleting,
    isUpdating,
    updateUser, 
    deleteUser 
  };
};
